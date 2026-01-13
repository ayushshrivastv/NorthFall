import { PlanType, prisma } from '@northfall/database';
import { NextFunction, Request, Response } from 'express';
import PLANS from '../configs/config.plans';

export default function contractLimit(isCreating = false) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const existing_user = await prisma.user.findUnique({
                where: { id: user.id },
                include: {
                    subscription: true,
                },
            });

            if (!existing_user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            // if user is not createing a new contract then always allow
            if (!isCreating) {
                return next();
            }

            const sub = existing_user.subscription;

            const plan = sub?.plan || PlanType.FREE;

            const start = sub?.start || new Date(0);
            const end = sub?.end || new Date('2100-01-01T00:00:00.000Z');

            // count contracts ONLY in current billing cycle
            const total_created_contracts = await prisma.contract.count({
                where: {
                    userId: user.id,
                    createdAt: {
                        gte: start, // greater than equal to
                        lte: end, // less than equal to
                    },
                },
            });

            const limit = PLANS[plan].limit;

            if (total_created_contracts >= limit) {
                return res.status(423).json({
                    success: false,
                    message: 'Contract limit reached for this billing cycle.',
                    goBack: true,
                });
            }

            next();
        } catch (error) {
            console.error('Error in contract limit:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };
}
