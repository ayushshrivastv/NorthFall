import { prisma } from '@northfall/database';
import { contractReviewSchema } from '@northfall/types';
import ResponseWriter from '../../class/response_writer';
import { Request, Response } from 'express';

export default async function create_contract_review_controller(req: Request, res: Response) {
    try {
        if (!req.user || !req.user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }
        console.log('review controller hit');
        const parsedData = contractReviewSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log('error is : ', parsedData.error);
            ResponseWriter.validation_error(res, '', 'invalid data format');
            return;
        }

        console.log('parsed data is: ', parsedData.data);

        await prisma.contractGenerationReviews.create({
            data: {
                userId: req.user?.id,
                contractId: parsedData.data.contractId,
                disliked: parsedData.data.disliked,
                liked: parsedData.data.liked,
                rating: parsedData.data.rating,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                contract: { select: { id: true } },
            },
        });

        ResponseWriter.success(res, {}, 'your review is submitted');
        return;
    } catch (error) {
        ResponseWriter.server_error(res);
        console.error('error in submitting your review', error);
    }
}
