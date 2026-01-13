import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';

export default async function getUserContracts(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
        ResponseWriter.unauthorized(res);
        return;
    }

    try {
        const user_record = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                contracts: {
                    take: 6,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        contractType: true,
                        clientSdk: true,
                        deployed: true,
                        createdAt: true,
                        messages: {
                            orderBy: {
                                createdAt: 'asc',
                            },
                            take: 1,
                            select: {
                                content: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user_record || !user_record.contracts.length) {
            ResponseWriter.success(res, [], 'No contracts found for this user.');
            return;
        }

        ResponseWriter.success(res, user_record.contracts, 'Fetched contracts succesfully');
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
