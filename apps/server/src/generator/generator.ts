import { Runnable, RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { new_planner_output_schema, old_planner_output_schema } from './schema/output_schema';
import Tool from './tools/tool';
import StreamParser from '../services/stream_parser';
import { ChatRole, GenerationStatus, Message, prisma } from '@northfall/database';

import { Response } from 'express';
import {
    FILE_STRUCTURE_TYPES,
    PHASE_TYPES,
    StreamEvent,
    StreamEventData,
} from '../types/stream_event_types';
import { STAGE } from '../types/content_types';
import { objectStore } from '../services/init';
import { FileContent, MODEL } from '@northfall/types';
import { mergeWithLLMFiles, prepareBaseTemplate } from '../class/test';
import chalk from 'chalk';
import { finalizer_output_schema } from './schema/finalizer_output_schema';
import { new_chat_coder_prompt, new_chat_planner_prompt } from './prompts/new_chat_prompts';
import { finalizer_prompt } from './prompts/finalizer_prompt';
import { old_chat_coder_prompt, old_chat_planner_prompt } from './prompts/old_chat_prompts';
import {
    new_coder,
    new_finalizer,
    new_planner,
    old_coder,
    old_finalizer,
    old_planner,
} from './types/generator_types';
import { start_planning_context_prompt } from './prompts/planning_context_prompt';
import { plan_context_schema } from './schema/plan_context_schema';
import ResponseWriter from '../class/response_writer';
import { ChatOpenAI } from '@langchain/openai';
import env from '../configs/config.env';

export default class Generator {
    protected gpt_planner: ChatOpenAI;
    protected gpt_coder: ChatOpenAI;
    protected claude_coder: ChatOpenAI;
    protected gpt_finalizer: ChatOpenAI;

    protected parsers: Map<string, StreamParser>;

    constructor() {
        this.gpt_planner = new ChatOpenAI({
            model: 'moonshotai/kimi-dev-72b',
            temperature: 0.2,
            streaming: false,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.SERVER_OPENROUTER_KEY,
            },
        });

        this.gpt_coder = new ChatOpenAI({
            model: 'anthropic/claude-sonnet-4.5',
            temperature: 0.2,
            streaming: true,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.SERVER_OPENROUTER_KEY,
            },
        });

        this.claude_coder = new ChatOpenAI({
            model: 'anthropic/claude-3.7-sonnet',
            temperature: 0.2,
            streaming: true,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.SERVER_OPENROUTER_KEY,
            },
        });

        this.gpt_finalizer = new ChatOpenAI({
            model: 'openai/gpt-4o-mini',
            temperature: 0.2,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: env.SERVER_OPENROUTER_KEY,
            },
        });

        this.parsers = new Map<string, StreamParser>();
    }

    public async generate(
        res: Response,
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id: string,
        idl?: Object[],
    ) {
        const parser = this.get_parser(contract_id, res);
        try {
            this.create_stream(res);

            // this check represents that chain is created without any errors
            const chain = this.get_chains(chat, model);
            if (!chain) {
                throw new Error('chains not created');
            }
            const { planner_chain, coder_chain, finalizer_chain } = chain;

            // make the contract busy
            await this.update_contract_state(contract_id, GenerationStatus.GENERATING);

            switch (chat) {
                case 'new': {
                    this.new_contract(
                        res,
                        planner_chain,
                        coder_chain,
                        finalizer_chain,
                        user_instruction,
                        contract_id,
                        parser,
                    );
                    return;
                }
                case 'old': {
                    if (idl) {
                        this.old_contract(
                            res,
                            planner_chain,
                            coder_chain,
                            finalizer_chain,
                            user_instruction,
                            contract_id,
                            parser,
                            idl,
                        );
                    } else {
                        throw new Error('idl was not found');
                    }
                }
            }
        } catch (error) {
            this.handle_error(res, error, 'generate', contract_id, parser);
        }
    }

    protected async new_contract(
        res: Response,
        planner_chain: new_planner,
        coder_chain: new_coder,
        finalizer_chain: new_finalizer,
        user_instruction: string,
        contract_id: string,
        parser: StreamParser,
    ) {
        try {
            console.log('new contract planned going to be executed ---------------');
            const planner_data = await planner_chain.invoke({
                user_instruction,
            });
            console.log(chalk.blue(planner_data));
            const full_response: string = '';

            console.log(planner_data);

            const llm_message = await prisma.message.create({
                data: {
                    content: planner_data.context,
                    contractId: contract_id,
                    role: ChatRole.AI,
                },
            });

            console.log('the context: ', chalk.red(planner_data.context));
            this.send_sse(res, STAGE.CONTEXT, {
                context: planner_data.context,
                llmMessage: llm_message,
            });

            if (!planner_data.should_continue) {
                console.log('planner said to not continue.');
                parser.reset();
                this.delete_parser(contract_id);
                this.update_contract_state(contract_id, GenerationStatus.IDLE);
                ResponseWriter.stream.end(res);
                return;
            }

            let { system_message } = await prisma.$transaction(async (tx) => {
                const system_message = await tx.message.create({
                    data: {
                        contractId: contract_id,
                        role: ChatRole.SYSTEM,
                        content: 'starting to generate in a few seconds',
                        stage: STAGE.PLANNING,
                    },
                });
                const update_contract = await tx.contract.update({
                    where: {
                        id: contract_id,
                    },
                    data: {
                        title: planner_data.contract_name,
                        description: planner_data.context,
                    },
                });

                return {
                    system_message,
                    contract: update_contract,
                };
            });

            // send planning stage from here
            console.log('the stage: ', chalk.green('Planning'));
            this.send_sse(res, STAGE.PLANNING, { stage: 'Planning' }, system_message);

            const code_stream = await coder_chain.stream({
                plan: planner_data.plan,
                files_likely_affected: planner_data.files_likely_affected,
            });

            console.log(chalk.green('coder stream started ----------------'));

            let buffer = '';
            let lastFlush = Date.now();

            const MAX_DELAY = 80;
            const MAX_CHARS = 200;

            for await (const chunk of code_stream) {
                if (!chunk.text) continue;

                buffer += chunk.text;
                const now = Date.now();

                const hasNewline = buffer.includes('\n');

                const shouldFlush =
                    hasNewline || buffer.length > MAX_CHARS || now - lastFlush > MAX_DELAY;

                if (shouldFlush) {
                    const lines = buffer.split('\n');
                    const safeChunk = lines.slice(0, -1).join('\n') + '\n';

                    if (safeChunk.trim()) {
                        console.log(safeChunk);
                        parser.feed(safeChunk, system_message);
                    }

                    buffer = lines.at(-1) ?? '';
                    lastFlush = now;
                }
            }

            // send the left over to parser
            if (buffer.trim()) {
                parser.feed(buffer + '\n', system_message);
            }

            console.log(chalk.bgRed('letters length: '), full_response.length);

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.BUILDING,
                },
            });

            console.log('the stage: ', chalk.green('Building'));
            this.send_sse(res, STAGE.BUILDING, { stage: 'Building' }, system_message);

            const llm_generated_files: FileContent[] = parser.getGeneratedFiles();
            console.log('llm generated files: ', llm_generated_files);
            const base_files: FileContent[] = prepareBaseTemplate(planner_data.contract_name);
            const final_code: FileContent[] = mergeWithLLMFiles(base_files, llm_generated_files);

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.CREATING_FILES,
                },
            });

            console.log('the stage: ', chalk.green('Creating Files'));
            this.send_sse(res, STAGE.CREATING_FILES, { stage: 'Creating Files' }, system_message);

            this.new_finalizer(
                res,
                finalizer_chain,
                final_code,
                full_response,
                contract_id,
                parser,
                system_message,
            );
        } catch (error) {
            this.handle_error(res, error, 'new_contract', contract_id, parser);
        }
    }

    protected async new_finalizer(
        res: Response,
        finalizer_chain: new_finalizer,
        generated_files: FileContent[],
        full_response: string,
        contract_id: string,
        parser: StreamParser,
        system_message: Message,
    ) {
        try {
            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.FINALIZING,
                },
            });

            console.log('the stage: ', chalk.green('Finalizing'));
            this.send_sse(res, STAGE.FINALIZING, { stage: 'Finalizing' }, system_message);

            const finalizer_data = await finalizer_chain.invoke({
                generated_files: generated_files,
            });

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.END,
                },
            });
            console.log('the stage: ', chalk.green('END'));
            this.send_sse(res, STAGE.END, { stage: 'End', data: generated_files }, system_message);

            const llm_message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.AI,
                    content: finalizer_data.context,
                },
            });

            console.log('the context: ', chalk.red(finalizer_data.context));
            this.send_sse(
                res,
                STAGE.CONTEXT,
                { context: finalizer_data.context, llmMessage: llm_message },
                system_message,
            );

            objectStore.uploadContractFiles(contract_id, generated_files, full_response);

            // save the idl to data base
            await prisma.contract.update({
                where: {
                    id: contract_id,
                },
                data: {
                    summarisedObject: JSON.stringify(finalizer_data.idl),
                },
            });
        } catch (error) {
            console.error('Error while finalizing: ', error);
        } finally {
            parser.reset();
            this.delete_parser(contract_id);
            this.update_contract_state(contract_id, GenerationStatus.IDLE);
            ResponseWriter.stream.end(res);
        }
    }

    protected async old_contract(
        res: Response,
        planner_chain: old_planner,
        coder_chain: old_coder,
        finalizer_chain: old_finalizer,
        user_instruction: string,
        contract_id: string,
        parser: StreamParser,
        idl: Object[],
    ) {
        try {
            console.log('user instruction: ', user_instruction);

            const planner_data = await planner_chain.invoke({
                user_instruction: user_instruction,
                idl: idl,
            });

            console.log(planner_data);

            const llm_message = await prisma.message.create({
                data: {
                    content: planner_data.context,
                    contractId: contract_id,
                    role: ChatRole.AI,
                },
            });

            console.log('the context: ', chalk.red(planner_data.context));
            this.send_sse(res, STAGE.CONTEXT, {
                context: planner_data.context,
                llmMessage: llm_message,
            });

            if (!planner_data.should_continue) {
                console.log('planner said to not continue.');
                parser.reset();
                this.delete_parser(contract_id);
                this.update_contract_state(contract_id, GenerationStatus.IDLE);
                ResponseWriter.stream.end(res);
                return;
            }

            let system_message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.SYSTEM,
                    content: 'starting to generate in a few seconds',
                    stage: STAGE.PLANNING,
                },
            });

            // send planning stage from here
            console.log('the stage: ', chalk.green('Planning'));
            this.send_sse(res, STAGE.PLANNING, { stage: 'Planning' }, system_message);

            const delete_files = planner_data.files_likely_affected
                .filter((f) => f.do === 'delete')
                .map((f) => f.file_path);

            const promptValue = await old_chat_coder_prompt.invoke({
                plan: planner_data.plan,
                contract_id,
                files_likely_affected: planner_data.files_likely_affected,
            });

            const initialMessages = promptValue.toChatMessages();

            const toolStepResult = await this.gpt_coder
                .bindTools([Tool.get_file])
                .invoke(initialMessages);

            const { toolResults } = await Tool.runner.invoke(toolStepResult);
            const { messages: toolMessages } = await Tool.convert.invoke({ toolResults });

            const code_stream = await this.gpt_coder.stream([
                ...initialMessages,
                toolStepResult,
                ...toolMessages,
                {
                    role: 'user',
                    content: 'Use the fetched file contents to implement the planned changes.',
                },
            ]);

            for await (const chunk of code_stream) {
                if (chunk && chunk.text) {
                    parser.feed(chunk.text, system_message);
                }
            }

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.BUILDING,
                },
            });

            console.log('the stage: ', chalk.green('Building'));
            this.send_sse(res, STAGE.BUILDING, { stage: 'Building' }, system_message);

            const gen_files = parser.getGeneratedFiles();
            console.log('generated files: ', gen_files);
            const updated_contract = await this.update_contract(
                contract_id,
                gen_files,
                delete_files,
            );

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.CREATING_FILES,
                },
            });

            console.log('the stage: ', chalk.green('Creating Files'));
            this.send_sse(res, STAGE.CREATING_FILES, { stage: 'Creating Files' }, system_message);

            this.old_finalizer(
                res,
                finalizer_chain,
                updated_contract,
                contract_id,
                parser,
                system_message,
                delete_files,
            );
        } catch (error) {
            this.handle_error(res, error, 'old_contract', contract_id, parser);
        }
    }

    protected async old_finalizer(
        res: Response,
        finalizer_chain: old_finalizer,
        generated_files: FileContent[],
        contract_id: string,
        parser: StreamParser,
        system_message: Message,
        delete_files: string[],
    ) {
        try {
            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.FINALIZING,
                },
            });

            console.log('the stage: ', chalk.green('Finalizing'));
            this.send_sse(res, STAGE.FINALIZING, { stage: 'Finalizing' }, system_message);

            const finalizer_data = await finalizer_chain.invoke({
                generated_files: generated_files,
            });

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    stage: STAGE.END,
                },
            });
            console.log('the stage: ', chalk.green('END'));
            this.send_sse(res, STAGE.END, { stage: 'End', data: generated_files }, system_message);

            const llm_message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.AI,
                    content: finalizer_data.context,
                },
            });

            console.log('the context: ', chalk.red(finalizer_data.context));
            this.send_sse(
                res,
                STAGE.CONTEXT,
                { context: finalizer_data.context, llmMessage: llm_message },
                system_message,
            );

            this.update_idl(contract_id, finalizer_data.idl, delete_files);
        } catch (error) {
            console.error('Error while finalizing: ', error);
        } finally {
            parser.reset();
            this.delete_parser(contract_id);
            this.update_contract_state(contract_id, GenerationStatus.IDLE);
            ResponseWriter.stream.end(res);
        }
    }

    protected async update_contract(
        contract_id: string,
        generated_files: FileContent[],
        deleting_files_path: string[],
    ) {
        try {
            const contract = await objectStore.get_resource_files(contract_id);

            let remaining_files: FileContent[] = contract;
            // delete the given files from the contract
            if (deleting_files_path.length > 0) {
                remaining_files = contract.filter(
                    (file) => !deleting_files_path.includes(file.path),
                );
            }

            // const gen_file_map = new Map(generated_files.map(file => [file.path, file.content]));
            const remaining_files_map = new Map(remaining_files.map((file) => [file.path, file]));
            const new_files: FileContent[] = [];

            // update old + add new
            generated_files.forEach((file) => {
                if (remaining_files_map.has(file.path)) {
                    remaining_files_map.set(file.path, file);
                } else {
                    new_files.push(file);
                }
            });

            const updated_contract: FileContent[] = [
                ...Array.from(remaining_files_map.values()),
                ...new_files,
            ];

            console.log(chalk.yellowBright('updating contract in s3...'));
            await objectStore.updateContractFiles(contract_id, updated_contract);

            return updated_contract;
        } catch (error) {
            console.error('Error while updating contract to s3: ', error);
            return [];
        }
    }

    protected async update_idl(
        contract_id: string,
        generated_idl_parts: any[],
        deleting_files_path: string[],
    ) {
        try {
            const contract = await prisma.contract.findUnique({
                where: {
                    id: contract_id,
                },
                select: {
                    summarisedObject: true,
                },
            });

            if (!contract?.summarisedObject) {
                await prisma.contract.update({
                    where: {
                        id: contract_id,
                    },
                    data: {
                        summarisedObject: JSON.stringify(generated_idl_parts),
                    },
                });
                return;
            }

            const idl = JSON.parse(contract.summarisedObject);

            const remainingIdl = idl.filter(
                (item: any) => !deleting_files_path.includes(item.path),
            );

            const existingIdlMap = new Map(remainingIdl.map((item: any) => [item.path, item]));
            const newIdlParts: any[] = [];

            for (const gen_i of generated_idl_parts) {
                const existingIdl = existingIdlMap.get(gen_i.path);

                if (existingIdl) {
                    Object.assign(existingIdl, gen_i);
                } else {
                    newIdlParts.push(gen_i);
                }
            }

            const updatedIdl = [...remainingIdl, ...newIdlParts];

            await prisma.contract.update({
                where: {
                    id: contract_id,
                },
                data: {
                    summarisedObject: JSON.stringify(updatedIdl),
                },
            });
        } catch (error) {
            console.error('Error while updating idl: ', error);
        }
    }

    protected get_chains(
        chat: 'new' | 'old',
        model: MODEL,
    ): {
        planner_chain: RunnableSequence;
        coder_chain: Runnable;
        finalizer_chain: RunnableSequence;
    } | null {
        try {
            let planner_chain;
            let coder_chain;
            let finalizer_chain;

            const coder = model === MODEL.CLAUDE ? this.claude_coder : this.gpt_coder;

            switch (chat) {
                case 'new': {
                    planner_chain = RunnableSequence.from([
                        new_chat_planner_prompt,
                        this.gpt_planner.withStructuredOutput(new_planner_output_schema),
                    ]);

                    coder_chain = new_chat_coder_prompt.pipe(coder);

                    finalizer_chain = RunnableSequence.from([
                        finalizer_prompt,
                        this.gpt_finalizer.withStructuredOutput(finalizer_output_schema),
                    ]);

                    return {
                        planner_chain: planner_chain,
                        coder_chain: coder_chain,
                        finalizer_chain: finalizer_chain,
                    };
                }

                case 'old': {
                    planner_chain = RunnableSequence.from([
                        old_chat_planner_prompt,
                        this.gpt_planner.withStructuredOutput(old_planner_output_schema),
                    ]);

                    const coder_chain = old_chat_coder_prompt
                        .pipe(coder.bindTools([Tool.get_file]))
                        .pipe(Tool.runner)
                        .pipe(Tool.convert)
                        .pipe(
                            new RunnableLambda({
                                func: ({ messages }: { messages: any }) => [
                                    ...messages,
                                    {
                                        role: 'user',
                                        content:
                                            'Use the fetched file contents to implement the planned changes.',
                                    },
                                ],
                            }),
                        )
                        .pipe(coder);

                    finalizer_chain = RunnableSequence.from([
                        finalizer_prompt,
                        this.gpt_finalizer.withStructuredOutput(finalizer_output_schema),
                    ]);

                    return {
                        planner_chain: planner_chain,
                        coder_chain: coder_chain,
                        finalizer_chain,
                    };
                }
            }
        } catch (error) {
            console.error('Error while getting chains: ', error);
            return null;
        }
    }

    public async plan_context(
        res: Response,
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id: string,
        // idl?: Object[],
    ) {
        try {
            const planner_chain = RunnableSequence.from([
                start_planning_context_prompt,
                this.gpt_planner.withStructuredOutput(plan_context_schema),
            ]);

            const planner_data = await planner_chain.invoke({ user_instruction });
            const message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.PLAN,
                    content: planner_data.short_description,
                    plannerContext: JSON.stringify(planner_data),
                },
            });
            ResponseWriter.success(
                res,
                message,
                `successfully outlined your plan for ${planner_data.contract_title}`,
            );
        } catch (err) {
            ResponseWriter.error(res, 'error in outlining your plan');
            console.error('Error while planning context ', err);
        }
    }

    protected get_parser(contract_id: string, res: Response): StreamParser {
        if (!this.parsers.has(contract_id)) {
            const parser = new StreamParser();

            parser.on(PHASE_TYPES.THINKING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.THINKING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.GENERATING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.GENERATING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.BUILDING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.BUILDING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.CREATING_FILES, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.CREATING_FILES, data, systemMessage),
            );

            parser.on(PHASE_TYPES.COMPLETE, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.COMPLETE, data, systemMessage),
            );

            parser.on(FILE_STRUCTURE_TYPES.EDITING_FILE, ({ data, systemMessage }) =>
                this.send_sse(res, FILE_STRUCTURE_TYPES.EDITING_FILE, data, systemMessage),
            );

            parser.on(PHASE_TYPES.ERROR, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.ERROR, data, systemMessage),
            );

            parser.on(STAGE.CONTEXT, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.CONTEXT, data, systemMessage),
            );

            parser.on(STAGE.PLANNING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.PLANNING, data, systemMessage),
            );

            parser.on(STAGE.GENERATING_CODE, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.GENERATING_CODE, data, systemMessage),
            );

            parser.on(STAGE.BUILDING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.BUILDING, data, systemMessage),
            );

            parser.on(STAGE.CREATING_FILES, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.CREATING_FILES, data, systemMessage),
            );

            parser.on(STAGE.FINALIZING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.FINALIZING, data, systemMessage),
            );

            parser.on(STAGE.END, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.END, data, systemMessage),
            );

            this.parsers.set(contract_id, parser);
        }
        return this.parsers.get(contract_id) as StreamParser;
    }

    protected delete_parser(contract_id: string): void {
        this.parsers.delete(contract_id);
    }

    protected async update_contract_state(contract_id: string, state: GenerationStatus) {
        await prisma.contract.update({
            where: {
                id: contract_id,
            },
            data: {
                generationStatus: state,
            },
        });
    }

    public send_sse(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        system_message?: Message,
    ): void {
        const event: StreamEvent = {
            type,
            data,
            systemMessage: system_message as Message,
            timestamp: Date.now(),
        };

        ResponseWriter.stream.write(res, `data: ${JSON.stringify(event)}\n\n`);
    }

    public create_stream(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
    }

    // this after any fn throws an error this method resets parser, delete the parser from mapping, make the contract idle again and sends back the data
    protected async handle_error(
        res: Response,
        error: unknown,
        coming_from_fn: string,
        contract_id: string,
        parser: StreamParser,
    ) {
        console.error(`Error in ${coming_from_fn}`, error);
        parser.reset();
        this.delete_parser(contract_id);
        this.update_contract_state(contract_id, GenerationStatus.IDLE);
        ResponseWriter.stream.end(res);
    }
}
