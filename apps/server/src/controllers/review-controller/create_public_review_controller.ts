import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { public_review_schema } from '@northfall/types';
import { prisma } from '@northfall/database';

export default async function create_public_review_controller(req: Request, res: Response) {
    try {
        if (!req.user || !req.user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const parsed_data = public_review_schema.safeParse(req.body);
        if (!parsed_data.success) {
            ResponseWriter.validation_error(res, 'invalid review data');
            return;
        }

        await prisma.publicReview.create({
            data: {
                userId: req.user.id,
                rating: parsed_data.data.rating,
                title: parsed_data.data.title,
                content: parsed_data.data.content,
            },
        });

        ResponseWriter.success(res, {}, 'review submitted successfully');
        return;
    } catch (error) {
        console.error('failed to submit review', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
