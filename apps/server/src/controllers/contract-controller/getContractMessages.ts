import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { getContractMessagesSchema } from '../../schemas/get_contract_messages_schema';
import { prisma } from '@northfall/database';

export default async function getContractMessages(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user || !user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }
        console.log('hit');

        const parsed = getContractMessagesSchema.safeParse(req.body);
        if (!parsed.success) {
            ResponseWriter.validation_error(res, 'Invalid data');
            return;
        }

        const { contractId } = req.body;
        console.log('body: ', req.body);
        const contract_record = await prisma.contract.findUnique({
            where: { id: contractId },
            select: {
                messages: true,
            },
        });

        const messages = contract_record?.messages ?? [];

        console.log('messages for this contracat are: ', contract_record?.messages);
        ResponseWriter.success(
            res,
            {
                messages,
                hasMessages: messages.length > 0,
            },
            'Fetched messages successfully',
        );
        return;
    } catch (error) {
        console.error('failed to fetch messages: ', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
