import { RunnableSequence } from '@langchain/core/runnables';
import {
    continue_planning_context_prompt,
    start_planning_context_prompt,
} from '../prompts/planning_context_prompt';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { plan_context_schema } from '../schema/plan_context_schema';
import { ChatRole, GenerationStatus, prisma } from '@northfall/database';
import ResponseWriter from '../../class/response_writer';
import { Response } from 'express';
import { finalizer_output_schema } from '../schema/finalizer_output_schema';
import Generator from '../generator';

export default class Planner extends Generator {
    public async start(res: Response, user_instruction: string, contract_id: string) {
        try {
            // create planner chain
            const planner_chain = RunnableSequence.from([
                start_planning_context_prompt,
                this.gpt_planner.withStructuredOutput(plan_context_schema),
            ]);

            // instead of streaming planner, invoke it to get schema based output
            const planner_data = await planner_chain.invoke({ user_instruction });

            // create the message for saving planner data
            const message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.PLAN,
                    content: planner_data.short_description,
                    plannerContext: JSON.stringify(planner_data),
                },
            });

            // write the response with message
            ResponseWriter.success(
                res,
                message,
                `successfully outlined your plan for ${planner_data.contract_title}`,
            );
        } catch (error) {
            this.handle_error(res, error, 'continue planner', contract_id);
        }
    }

    public async continue(
        res: Response,
        user_instruction: string,
        llm: ChatOpenAI | ChatAnthropic | ChatGoogleGenerativeAI,
        contract_id: string,
        summarized_object: (typeof finalizer_output_schema)[],
    ) {
        try {
            // create planner chain
            const planner_chain = RunnableSequence.from([
                continue_planning_context_prompt,
                llm.withStructuredOutput(plan_context_schema),
            ]);

            // instead of streaming planner, invoke it to get schema based output
            const planner_data = await planner_chain.invoke({
                user_instruction,
                summarized_object,
            });

            // create the message for saving planner data
            const message = await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: ChatRole.PLAN,
                    content: planner_data.short_description,
                    plannerContext: JSON.stringify(planner_data),
                },
            });

            // write the response with message
            ResponseWriter.success(
                res,
                message,
                `successfully outlined your plan for ${planner_data.contract_title}`,
            );
        } catch (error) {
            this.handle_error(res, error, 'continue planner', contract_id);
        }
    }

    protected async handle_error(
        res: Response,
        error: unknown,
        coming_from_fn: string,
        contract_id: string,
    ) {
        console.error(`Error in ${coming_from_fn}: `, error);
        this.update_contract_state(contract_id, GenerationStatus.IDLE);
        ResponseWriter.stream.end(res);
    }
}
