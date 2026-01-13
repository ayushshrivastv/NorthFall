import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';

export default async function getAllContracts(req: Request, res: Response) {
    const user = req.user;
    if (!user) return ResponseWriter.unauthorized(res, 'Unauthorized');

    try {
        const contracts = await prisma.contract.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 6,
            select: {
                id: true,
                title: true,
                description: true,
                summarisedObject: true,
                contractType: true,
                clientSdk: true,
                deployed: true,
                createdAt: true,
            },
        });

        if (!contracts || contracts.length === 0) {
            ResponseWriter.success(res, [], 'No contracts found');
            return;
        }

        ResponseWriter.success(res, contracts, 'Fetched contracts successfully');
        return;
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
