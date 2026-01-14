import { BuildJobPayload, COMMAND } from '@northfall/types';
import { Job, Worker } from 'bullmq';
import { kubernetes_services } from '..';
import { env } from '../configs/configs.env';
import { JobContext } from '../jobs/job.context';

export default class RedisQueue {
    private queue: Worker;
    private namespace: string = env.KUBERNETES_NAMESPACE;

    constructor(queue_name: string) {
        this.queue = new Worker(queue_name, this.process_job.bind(this), {
            connection: {
                url: env.KUBERNETES_REDIS_URL,
            },
        });
    }

    private async process_job(job: Job) {
        const command = job.name as COMMAND;
        const payload = job.data as BuildJobPayload;
        const context = new JobContext(payload.userId, payload.contractId);
        console.log(`Processing job ${job.id}: ${command}`);

        try {
            switch (command) {
                case COMMAND.NORTHFALL_BUILD:
                    return await this.handleBuild(context);
                case COMMAND.NORTHFALL_TEST:
                    return await this.handleTest(payload);
                case COMMAND.NORTHFALL_DEPLOY_DEVNET:
                    return await this.handleDeployDevnet(payload);
                case COMMAND.NORTHFALL_DEPLOY_MAINNET:
                    return await this.handleDeployMainnet(payload);
                case COMMAND.NORTHFALL_VERIFY:
                    return await this.handleVerify(payload);
                default:
                    throw new Error(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            throw error;
        }
    }

    private async handleBuild(context: JobContext) {
        return kubernetes_services.job_processor.execute_build_in_pod(context, [
            'sh',
            '-c',
            'anchor build',
        ]);
    }

    private async handleTest(payload: BuildJobPayload) {
        console.log('Testing contract:', payload.contractId);
        return { success: true, message: 'test succeded' };
    }

    private async handleDeployDevnet(payload: BuildJobPayload) {
        console.log('Deploying to devnet:', payload.contractId);
        return { success: true, message: 'Deployed to devnet' };
    }

    private async handleDeployMainnet(payload: BuildJobPayload) {
        console.log('Deploying to mainnet:', payload.contractId);
        return { success: true, message: 'Deployed to mainnet' };
    }

    private async handleVerify(payload: BuildJobPayload) {
        console.log('Verifying contract:', payload.contractId);
        return { success: true, message: 'Verification completed' };
    }

    public async close() {
        await this.queue.close();
    }
}
