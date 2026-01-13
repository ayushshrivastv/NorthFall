import { Job, Queue, Worker } from 'bullmq';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import queue_config from '../configs/config.queue';
import { FileContent, GithubPushJobData } from '../types/github_worker_queue_types';
import { github_services } from '../services/init';
import { prisma } from '@northfall/database';
import generateNorthfallReadme from '../utils/northfall_commit';

export class GithubWorkerQueue {
    private queue: Queue<GithubPushJobData>;

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, queue_config);
        new Worker(queue_name, this.process_job.bind(this), queue_config);
    }

    public async enqueue(job_data: GithubPushJobData) {
        const job_id = `${job_data.user_id}-${job_data.repo_name}-${Date.now()}`;
        return this.queue.add('github-push', job_data, {
            jobId: job_id,
            attempts: 2,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: false,
            removeOnFail: false,
        });
    }

    private async process_job(job: Job<GithubPushJobData>) {
        const { github_access_token, owner, repo_name, contract_id } = job.data;
        const octokit = new Octokit({ auth: github_access_token });

        try {
            const { created } = await this.ensure_repo_for_contract(
                octokit,
                owner,
                repo_name,
                contract_id,
            );
            let files = await github_services.fetch_codebase(contract_id);
            if (!files || !files.length) {
                throw new Error('No files found in codebase');
            }

            if (created && !files.some((f) => f.path === 'README.md')) {
                files = [...files, { path: 'README.md', content: generateNorthfallReadme() }];
            }
            await this.upsert_code(octokit, owner, repo_name, files);

            return {
                success: true,
                repo_url: `https://github.com/${owner}/${repo_name}`,
                files_count: files.length,
            };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            throw new Error(`GitHub push failed: ${message}`);
        }
    }

    private async ensure_repo_for_contract(
        octokit: Octokit,
        owner: string,
        repo: string,
        contract_id: string,
    ) {
        const contract = await prisma.contract.findUnique({ where: { id: contract_id } });
        if (!contract) {
            throw new Error('Contract not found');
        }

        let repo_exists = false;
        try {
            await octokit.repos.get({ owner, repo });
            repo_exists = true;
        } catch (err) {
            if (!(err instanceof RequestError && err.status === 404)) {
                throw err;
            }
        }

        if (!repo_exists) {
            await octokit.repos.createForAuthenticatedUser({
                name: repo,
                private: false,
                auto_init: true,
            });
            return { created: true };
        }
        return { created: false };
    }

    private async upsert_code(octokit: Octokit, owner: string, repo: string, files: FileContent[]) {
        let ref;
        try {
            ref = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
        } catch {
            ref = await octokit.git.getRef({ owner, repo, ref: 'heads/master' });
        }

        const base_sha = ref.data.object.sha;
        const base_commit = await octokit.git.getCommit({ owner, repo, commit_sha: base_sha });
        const tree_data = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: base_commit.data.tree.sha,
            recursive: 'true',
        });

        const existing = new Map<string, string>();
        for (const item of tree_data.data.tree) {
            if (item.type === 'blob' && item.path && item.sha) {
                existing.set(item.path, item.sha);
            }
        }

        const tree_entries: RestEndpointMethodTypes['git']['createTree']['parameters']['tree'] = [];
        for (const file of files) {
            const blob = await octokit.git.createBlob({
                owner,
                repo,
                content: file.content,
                encoding: 'utf-8',
            });

            tree_entries.push({
                path: file.path,
                sha: blob.data.sha,
                mode: '100644',
                type: 'blob',
            });

            existing.delete(file.path);
        }

        for (const [removed_path] of existing) {
            tree_entries.push({
                path: removed_path,
                sha: null,
                mode: '100644',
                type: 'blob',
            });
        }

        const new_tree = await octokit.git.createTree({
            owner,
            repo,
            tree: tree_entries,
            base_tree: base_commit.data.tree.sha,
        });

        const commit = await octokit.git.createCommit({
            owner,
            repo,
            message: 'Northfall deployment',
            tree: new_tree.data.sha,
            parents: [base_sha],
            author: { name: 'Northfall', email: 'northfall.dev.official@gmail.com' },
            committer: { name: 'Northfall', email: 'northfall.dev.official@gmail.com' },
        });

        await octokit.git.updateRef({
            owner,
            repo,
            ref: 'heads/main',
            sha: commit.data.sha,
            force: false,
        });
    }

    public get_job(job_id: string) {
        return this.queue.getJob(job_id);
    }
}
