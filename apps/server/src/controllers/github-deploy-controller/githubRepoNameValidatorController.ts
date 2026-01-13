import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';
import { github_services } from '../../services/init';

export default async function githubRepoNameValidatorController(req: Request, res: Response) {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            ResponseWriter.unauthorized(res, 'Unauthorized');
            return;
        }

        const { repo_name, contract_id } = req.body;

        if (!repo_name) {
            ResponseWriter.validation_error(res, 'Repo name is required');
            return;
        }

        if (!contract_id) {
            ResponseWriter.validation_error(res, 'Contract ID is required');
            return;
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
            ResponseWriter.validation_error(res, 'Invalid repo name');
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: user_id } });

        if (!user?.githubAccessToken) {
            ResponseWriter.custom(res, 200, {
                success: false,
                message: 'GitHub authentication required',
                meta: { timestamp: Date.now().toString() },
            });
            return;
        }

        const contract = await prisma.contract.findUnique({ where: { id: contract_id } });

        if (!contract) {
            ResponseWriter.not_found(res, 'Contract not found');
            return;
        }

        const db_repo = contract.githubRepoName;
        const exists_in_github = await github_services.check_repo_exists(
            repo_name,
            user.githubAccessToken,
        );
        if (!db_repo) {
            if (exists_in_github.exists) {
                ResponseWriter.custom(res, 200, {
                    success: false,
                    meta: { timestamp: Date.now().toString() },
                    message: 'Repo already exists',
                });
                return;
            }
        }

        if (db_repo === repo_name) {
            ResponseWriter.success(res, repo_name, 'Linked repo');
            return;
        }

        if (exists_in_github.exists) {
            ResponseWriter.custom(res, 200, {
                success: false,
                meta: { timestamp: Date.now().toString() },
                message: 'Repo already exists in github',
            });
            return;
        }

        ResponseWriter.success(res, repo_name, 'Repo name available');
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
