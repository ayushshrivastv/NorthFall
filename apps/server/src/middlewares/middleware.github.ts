import { NextFunction, Request, Response } from 'express';
import ResponseWriter from '../class/response_writer';
import { prisma } from '@northfall/database';

export default async function githubMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        if (!user) {
            ResponseWriter.unauthorized(res, 'Unauthorized');
            return;
        }

        const user_record = await prisma.user.findUnique({
            where: { id: user.id },
            select: { githubAccessToken: true },
        });

        if (!user_record?.githubAccessToken) {
            ResponseWriter.error(res, 'GitHub not connected');
            return;
        }

        next();
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
