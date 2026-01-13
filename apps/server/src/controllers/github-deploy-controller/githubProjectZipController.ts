import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';
import { github_services } from '../../services/init';

export default async function githubProjectZipController(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user) return ResponseWriter.unauthorized(res, 'unauthorized');

        const user_record = await prisma.user.findUnique({
            where: { id: user.id },
            select: { githubAccessToken: true },
        });
        if (!user_record?.githubAccessToken) {
            ResponseWriter.unauthorized(res, 'GitHub not connected');
            return;
        }

        const { contractId } = req.body;
        if (!contractId) {
            return ResponseWriter.not_found(res, 'contract id not foind');
        }

        const result = await github_services.create_zip_file(contractId);

        if (!result) {
            return ResponseWriter.not_found(res, 'No codebase found');
        }
        const { buffer, contract_name } = result;

        console.log('conrtca name is: ', contract_name);

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="northfall-${contract_name}.zip"`,
        );
        res.setHeader('Access-Control-Expose-Headers', 'contract-name');
        res.setHeader('contract-name', contract_name);

        res.status(200).send(buffer);
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
