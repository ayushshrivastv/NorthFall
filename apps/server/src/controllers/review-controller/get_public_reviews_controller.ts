import { prisma } from '@northfall/database';
import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';

export default async function get_public_reviews_controller(req: Request, res: Response) {
    try {
        const pub_reviews = await prisma.publicReview.findMany({
            select: {
                id: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                content: true,
                rating: true,
                visible: true,
                createdAt: true,
            },
        });

        ResponseWriter.success(res, pub_reviews, 'Fetched reviews successfully');
        return;
    } catch (error) {
        console.error('Failed to fetch public reviews: ', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
