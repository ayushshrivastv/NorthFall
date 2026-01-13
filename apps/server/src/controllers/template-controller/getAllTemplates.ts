import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';

export default async function getAllTemplates(req: Request, res: Response) {
    try {
        const templates = await prisma.template.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                tags: true,
                s3_prefix: true,
                imageUrl: true,
                solanaVersion: true,
                anchorVersion: true,
                createdAt: true,
            },
        });

        ResponseWriter.success(res, templates, 'Fetched templates successfully');
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
