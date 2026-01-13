import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { generate_contract_schema } from '../../schemas/generate_contract_schema';
import { ChatRole, Contract, Message, prisma } from '@northfall/database';
import { generator } from '../../services/init';
import { MODEL } from '@northfall/types';

// we are not tracking the plan context count from the user side, future update will have it
export default async function plan_executor_controller(req: Request, res: Response) {
    console.log('request hit');
    const user = req.user;
    if (!user || !user.id) {
        ResponseWriter.unauthorized(res);
        return;
    }

    try {
        const parsed = generate_contract_schema.safeParse(req.body);
        if (!parsed.success) {
            ResponseWriter.validation_error(res, 'Invalid data');
            return;
        }

        let contract: (Contract & { messages: Message[] }) | null;
        contract = await prisma.contract.findUnique({
            where: {
                id: parsed.data.contract_id,
                userId: user.id,
            },
            include: {
                messages: true,
            },
        });

        if (!contract) {
            contract = await prisma.contract.create({
                data: {
                    id: parsed.data.contract_id,
                    title: 'contractor',
                    contractType: 'CUSTOM',
                    userId: user.id,
                },
                include: {
                    messages: true,
                },
            });
        }

        const message = await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: parsed.data.instruction,
                contractId: parsed.data.contract_id,
            },
        });
        console.log('messsage created is : ', message);
        generator.plan_context(
            res,
            contract.messages.length === 1 ? 'new' : 'old',
            parsed.data.instruction,
            parsed.data.model || MODEL.GEMINI,
            contract.id,
            // contract.summarisedObject ? JSON.parse(contract.summarisedObject) : undefined,
        );

        // generator.planner.start(
        //     res,
        //     parsed.data.instruction,
        //     contract.id,
        // );
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        console.error('error in plan context controller', error);
        return;
    }
}
