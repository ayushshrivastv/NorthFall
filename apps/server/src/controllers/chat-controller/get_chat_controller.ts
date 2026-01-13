import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';
import { objectStore } from '../../services/init';

export default async function get_chat_controller(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const { contractId } = req.body;
        if (!contractId) {
            ResponseWriter.no_content(res);
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: {
                id: contractId,
                userId: user.id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                deployed: true,
                programId: true,
                version: true,
                createdAt: true,
                summarisedObject: true,
                messages: {
                    select: {
                        id: true,
                        role: true,
                        content: true,
                        isPlanExecuted: true,
                        templateId: true,
                        template: {
                            select: {
                                imageUrl: true,
                            },
                        },
                        stage: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!contract) {
            ResponseWriter.not_found(res, `contract with id: ${contractId} was not found!`);
            return;
        }

        let contract_files: string = '';
        if (contract.summarisedObject) {
            const fetched_contract = await objectStore.get_resource_files(contractId);
            contract_files = JSON.stringify(fetched_contract);
        }

        ResponseWriter.success(
            res,
            {
                messages: contract.messages,
                contractFiles: contract_files || '',
            },
            'chat fetched successfully',
        );
        return;
    } catch (error) {
        console.error('Error while get_chat_controller data: ', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
