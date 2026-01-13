import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';
import { github_services, github_worker_queue } from '../../services/init';

export default async function githubCodePushController(req: Request, res: Response) {
    try {
        const user_id = req.user?.id;
        if (!user_id) return ResponseWriter.unauthorized(res, 'Unauthorized');

        const { repo_name, contract_id } = req.body;

        if (!repo_name || !contract_id) {
            ResponseWriter.validation_error(res, 'Repo name and contract id are required.');
            return;
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
            ResponseWriter.validation_error(res, 'Invalid repo name');
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (!user?.githubAccessToken) {
            ResponseWriter.unauthorized(res, 'GitHub authenticaiton required');
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: { id: contract_id },
        });

        if (!contract) {
            ResponseWriter.not_found(res, 'Contract not found');
            return;
        }

        const db_repo = contract.githubRepoName;
        const owner = await github_services.get_github_owner(user.githubAccessToken);

        // case 1 -> db_repo_name = user send repo_naem
        if (db_repo === repo_name) {
            await github_worker_queue.enqueue({
                github_access_token: user.githubAccessToken,
                owner,
                repo_name,
                user_id,
                contract_id,
            });

            ResponseWriter.success(
                res,
                `https://github.com/${owner}/${repo_name}`,
                'Export job queued successfully',
                200,
            );
            return;
        }

        // db_repo !== user sent repo_name
        // check github
        const repo_exists = await github_services.check_repo_exists(
            repo_name,
            user.githubAccessToken,
        );

        if (repo_exists.exists) {
            ResponseWriter.custom(res, 200, {
                success: false,
                message: `The repository '${repo_name}' already exists in your GitHub.`,
                meta: { timestamp: new Date().toISOString() },
            });
            return;
        }

        await prisma.contract.update({
            where: { id: contract_id },
            data: { githubRepoName: repo_name },
        });

        await github_worker_queue.enqueue({
            github_access_token: user.githubAccessToken,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        ResponseWriter.success(
            res,
            `https://github.com/${owner}/${repo_name}`,
            'Export job queued successfully',
            200,
        );
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
