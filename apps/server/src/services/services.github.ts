import axios from 'axios';
import { FileContent } from '../types/github_worker_queue_types';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import env from '../configs/config.env';
import JSZip from 'jszip';
import { prisma } from '@northfall/database';

export default class GithubServices {
    public async fetch_codebase(contract_id: string): Promise<FileContent[] | null> {
        try {
            const { data } = await axios.get(
                `${env.SERVER_CLOUDFRONT_DOMAIN}/${contract_id}/resource`,
            );
            return data;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch code');
        }
    }

    public async get_github_owner(github_access_token: string): Promise<string> {
        try {
            const octokit = new Octokit({ auth: github_access_token });
            const response: RestEndpointMethodTypes['users']['getAuthenticated']['response'] =
                await octokit.users.getAuthenticated();
            return response.data.login;
        } catch (error) {
            console.error(error);
            throw new Error('GitHub owner not found');
        }
    }

    public async check_repo_exists(
        repo_name: string,
        github_access_token: string,
    ): Promise<{ exists: boolean; repo?: unknown; error?: string }> {
        try {
            const octokit = new Octokit({ auth: github_access_token });
            const owner = await this.get_github_owner(github_access_token);

            try {
                const repo = await octokit.repos.get({ owner, repo: repo_name });
                return { exists: true, repo: repo.data };
            } catch {
                return { exists: false };
            }
        } catch (error) {
            console.error('Failed while checking repo existence', error);
            return { exists: false, error: 'Internal server error' };
        }
    }

    public async create_zip_file(
        contract_id: string,
    ): Promise<{ buffer: Buffer; contract_name: string } | null> {
        try {
            const files = await this.fetch_codebase(contract_id);
            if (!files || files.length === 0) {
                console.error('No code found');
                return null;
            }

            const zip = new JSZip();

            const contract_record = await prisma.contract.findUnique({
                where: { id: contract_id },
                select: { title: true },
            });
            if (!contract_record || !contract_record.title) {
                console.error('No contract title found');
                return null;
            }

            const contract_name = contract_record?.title;
            const root_folder = `northfall-${contract_name}`;

            for (const f of files) {
                const file_path = `${root_folder}/${f.path}`;
                zip.file(file_path, f.content);
            }

            const buffer = await zip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 },
            });

            return {
                buffer,
                contract_name: contract_name,
            };
        } catch (error) {
            console.error('Failed to create zip format', error);
            return null;
        }
    }
}
