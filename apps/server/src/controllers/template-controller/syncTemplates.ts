import { Request, Response } from 'express';
import { prisma } from '@northfall/database';
import ResponseWriter from '../../class/response_writer';
import env from '../../configs/config.env';

export default async function syncTemplate(req: Request, res: Response) {
    const auth = req.headers.authorization;
    const secret = env.SERVER_ADMIN_SECRET;

    if (!auth || auth.trim() !== `Bearer ${secret}`) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body;
    if (typeof body.id !== 'string' || body.id.includes('..')) {
        ResponseWriter.validation_error(res, 'Invalid id');
        return;
    }

    if (typeof body.title !== 'string') {
        ResponseWriter.validation_error(res, 'invalid name');
        return;
    }

    const data = {
        id: body.id,
        title: body.title,
        description: body.description || '',
        category: body.category,
        tags: Array.isArray(body.tags) ? body.tags : [],
        s3_prefix: body.s3_prefix,
        solanaVersion: body.solanaVersion,
        anchorVersion: body.anchorVersion,
        imageUrl: body.imageUrl,
        summarisedObject:
            typeof body.summarisedObject === 'string'
                ? body.summarisedObject
                : JSON.stringify(body.summarisedObject),
    };

    try {
        const template = await prisma.template.upsert({
            where: { id: body.id },
            create: data,
            update: data,
        });

        ResponseWriter.success(res, template, 'Template updated successfully');
        return;
    } catch (err) {
        console.log('syncing failed due to--------------> ', err);
        ResponseWriter.error(res, 'Failed to sync templates to db');
        return;
    }
}
