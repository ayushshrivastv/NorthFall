import axios from 'axios';
import env from '../configs/config.env';
import ResponseWriter from '../class/response_writer';
import { Response } from 'express';
import { ChatRole, prisma, Contract as ContractType } from '@northfall/database';
import { generator, objectStore } from '../services/init';
import { MODEL, STAGE } from '@northfall/types';
import chalk from 'chalk';

export default class Contract {
    static async generate_with_template(
        res: Response,
        contract_id: string,
        user_id: string,
        template_id: string,
        instruction?: string,
        model?: MODEL,
    ) {
        try {
            // fetch the template data
            const template_data = await axios.get(
                `${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${template_id}/resource`,
                {
                    responseType: 'json',
                },
            );

            // get template from the db too
            const template = await prisma.template.findUnique({
                where: {
                    id: template_id,
                },
            });
            console.log('template is : ', chalk.red(template));

            // checks if template_data doesn't exist
            if (
                !template_data ||
                !Array.isArray(template_data.data) ||
                !template ||
                !template.summarisedObject
            ) {
                ResponseWriter.not_found(res, 'Template not found');
                return;
            }

            // make the user the owner of the contract and add template's summarised-object
            await prisma.$transaction(async (tx) => {
                await tx.contract.create({
                    data: {
                        id: contract_id,
                        userId: user_id,
                        title: 'contractor',
                        contractType: 'CUSTOM',
                        summarisedObject: template.summarisedObject,
                    },
                });
            });

            // upload the template files to user's contract
            await objectStore.uploadContractFiles(
                contract_id,
                template_data.data,
                'no raw llm response for contracts generated from templates',
            );

            console.log('instruction found: ', instruction);

            if (!instruction) {
                await prisma.message.create({
                    data: {
                        contractId: contract_id,
                        templateId: template_id,
                        content: '',
                        role: 'TEMPLATE',
                    },
                });
                generator.create_stream(res);
                generator.send_sse(res, STAGE.END, { stage: 'End', data: template_data.data });
                ResponseWriter.stream.end(res);
                return;
            } else {
                // if yes then continue generation with the sent instruction

                // create user message

                await prisma.$transaction([
                    prisma.message.create({
                        data: {
                            contractId: contract_id,
                            templateId: template_id,
                            content: '',
                            role: 'TEMPLATE',
                        },
                    }),
                    prisma.message.create({
                        data: {
                            contractId: contract_id,
                            role: 'USER',
                            content: instruction,
                        },
                    }),
                ]);

                // start generating the contract
                generator.generate(
                    res,
                    'old',
                    instruction,
                    model || MODEL.GEMINI,
                    contract_id,
                    JSON.parse(template.summarisedObject),
                );
            }
        } catch (error) {
            console.error('Error in generate_contract_controller: ', error);
            if (!res.headersSent) {
                ResponseWriter.server_error(res);
                return;
            } else {
                ResponseWriter.stream.write(
                    res,
                    `data: ${JSON.stringify({
                        type: 'error',
                        error: 'Internal server error',
                    })}\n\n`,
                );
                ResponseWriter.stream.end(res);
            }
        }
    }

    static async generate_new_contract(
        res: Response,
        contract_id: string,
        user_id: string,
        instruction: string,
        model?: MODEL,
    ) {
        try {
            // create the contract and user message to generate the contract
            await prisma.$transaction(async (tx) => {
                await tx.contract.create({
                    data: {
                        id: contract_id,
                        userId: user_id,
                        title: 'contractor',
                        contractType: 'CUSTOM',
                    },
                });

                await tx.message.create({
                    data: {
                        contractId: contract_id,
                        role: 'USER',
                        content: instruction,
                    },
                });
            });

            // generate the new contract
            generator.generate(res, 'new', instruction, model || MODEL.GEMINI, contract_id);
        } catch (error) {
            console.error('Error in generate_contract_controller: ', error);
            if (!res.headersSent) {
                ResponseWriter.server_error(res);
                return;
            } else {
                ResponseWriter.stream.write(
                    res,
                    `data: ${JSON.stringify({
                        type: 'error',
                        error: 'Internal server error',
                    })}\n\n`,
                );
                ResponseWriter.stream.end(res);
            }
        }
    }

    static async continue_old_contract(
        res: Response,
        contract: ContractType,
        instruction: string,
        model?: MODEL,
    ) {
        try {
            // create user message
            await prisma.message.create({
                data: {
                    role: ChatRole.USER,
                    content: instruction,
                    contractId: contract.id,
                },
            });

            // call the generator with old chat
            generator.generate(
                res,
                'old',
                instruction,
                model || MODEL.GEMINI,
                contract.id,
                JSON.parse(contract.summarisedObject || ''),
            );
        } catch (error) {
            console.error('Error in generate_contract_controller: ', error);
            if (!res.headersSent) {
                ResponseWriter.server_error(res);
                return;
            } else {
                ResponseWriter.stream.write(
                    res,
                    `data: ${JSON.stringify({
                        type: 'error',
                        error: 'Internal server error',
                    })}\n\n`,
                );
                ResponseWriter.stream.end(res);
            }
        }
    }
}
