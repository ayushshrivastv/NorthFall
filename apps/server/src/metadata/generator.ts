import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Runnable, RunnableSequence } from '@langchain/core/runnables';
import { Response } from 'express';
import StreamParser from '../services/stream_parser';
import {
    FILE_STRUCTURE_TYPES,
    FileContent,
    PHASE_TYPES,
    STAGE,
    StreamEventData,
    MODEL,
} from '@northfall/types';
import { Message } from '@northfall/database';

export default abstract class GeneratorShape {
    protected gemini_planner!: ChatGoogleGenerativeAI;
    protected gemini_coder!: ChatGoogleGenerativeAI;
    protected claude_coder!: ChatAnthropic;
    protected parsers!: Map<string, StreamParser>;

    /**
     * this is a user exposed method which starts the generation process of the content
     * @param {Response} res
     * @param {'new' | 'old'} chat
     * @param {string} user_instruction
     * @param {MODEL} model
     * @param {string} contract_id
     * @param {Object[]} idl
     */
    abstract generate(
        res: Response,
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id: string,
        idl?: Object[],
    ): void;

    /**
     * this method is used to generate a new contract
     * @param {Response} res
     * @param {RunnableSequence} planner_chain
     * @param {Runnable} coder_chain
     * @param {string} user_instruction
     * @param {string} contract_id
     * @param {StreamParser} parser
     */
    protected abstract new_contract(
        res: Response,
        planner_chain: RunnableSequence,
        coder_chain: Runnable,
        finalizer_chain: Runnable,
        user_instruction: string,
        contract_id: string,
        parser: StreamParser,
    ): void;

    /**
     * it's role is to generate an idl from the generated code from coder
     * @param {Response} res
     * @param {Runnable} finalizer_chain
     * @param {FileContent[]} generated_files
     * @param {string} full_response
     * @param {string} contract_id
     * @param {StreamParser} parser
     * @param {Message} system_message
     */
    protected abstract new_finalizer(
        res: Response,
        finalizer_chain: RunnableSequence,
        generated_files: FileContent[],
        full_response: string,
        contract_id: string,
        parser: StreamParser,
        system_message: Message,
    ): void;

    /**
     * this method is used to update an old contract
     * @param {Response} res
     * @param {RunnableSequence} planner_chain
     * @param {Runnable} coder_chain
     * @param {RunnableSequence} finalizer_chain
     * @param {string} user_instruction
     * @param {string} contract_id
     * @param {StreamParser} parser
     * @param {Object[]} idl
     */
    protected abstract old_contract(
        res: Response,
        is_template_used: boolean,
        planner_chain: RunnableSequence,
        coder_chain: Runnable,
        finalizer_chain: RunnableSequence,
        user_instruction: string,
        contract_id: string,
        parser: StreamParser,
        idl: Object[],
    ): void;

    /**
     *
     * @param {'new' | 'old'} chat
     * @param {MODEL} model
     * @returns {{ planner_chain: RunnableSequence, coder_chain: Runnable}} returns a object of planner and coder chains
     */
    protected abstract get_chains(
        chat: 'new' | 'old',
        model: MODEL,
    ): {
        planner_chain: RunnableSequence;
        coder_chain: Runnable;
        finalizer_chain: RunnableSequence;
    };

    /**
     * returns a stream-parser based on contract_id in mapping
     * @param {string} contract_id
     * @param {Response} res
     * @returns {StreamParser}
     */
    protected abstract get_parser(contract_id: string, res: Response): StreamParser;

    /**
     * deletes a contract's stream-parser from the mapping
     * @param {string} contract_id
     */
    protected abstract delete_parser(contract_id: string): void;

    /**
     * sends sse to the client
     * @param {Response} res
     * @param {PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE} type
     * @param {StreamEventData} data
     * @param {Message} systemMessage
     */
    protected abstract send_sse(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        systemMessage?: Message,
    ): void;

    /**
     * creates stream from client
     * @param {Response} res
     */
    protected abstract create_stream(res: Response): void;
}
