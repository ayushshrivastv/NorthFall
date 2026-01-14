import { BatchV1Api, CoreV1Api } from '@kubernetes/client-node';
import KubernetesClient from '../k8s/client.kubernetes';
import chalk from 'chalk';
import { env } from '../configs/configs.env';

interface PodCleanupConfig {
    maxCompletedAge: number;
    maxRunningAge: number;
    maxFailedAge: number;
    cleanupInterval: number;
}

export default class PodCleanupManager {
    private batch_api: BatchV1Api;
    private core_api: CoreV1Api;
    private cleanup_config: PodCleanupConfig;
    // private cleanup_timer: NodeJS.Timeout | null = null;
    private cleanup_timer: ReturnType<typeof setInterval> | null = null;
    private is_runnning: boolean = false;

    constructor(kubernetes_client: KubernetesClient, configs: Partial<PodCleanupConfig>) {
        this.core_api = kubernetes_client.core_api;
        this.batch_api = kubernetes_client.batch_api;
        this.cleanup_config = {
            maxCompletedAge: 5, // Delete completed pods after 5 minutes
            maxFailedAge: 10, // Keep failed pods for 10 minutes for debugging
            maxRunningAge: 20, // Safety limit: kill pods running > 20 minutes
            cleanupInterval: 2,
            ...configs,
        };
    }

    public start(): void {
        if (this.is_runnning) {
            console.error('pod cleanup is already started');
        }
        this.is_runnning = true;
        console.log('pod cleanup is now started');
        this.run_cleanup();

        this.cleanup_timer = setInterval(
            () => {
                this.run_cleanup();
            },
            this.cleanup_config.cleanupInterval * 60 * 1000,
        );
    }

    public stop() {
        if (!this.is_runnning) {
            console.error('error in stopping the cleamup pod service, already disabled');
        }
        if (this.cleanup_timer) {
            clearTimeout(this.cleanup_timer);
            this.cleanup_timer = null;
        }
        this.is_runnning = false;
    }

    private async run_cleanup(): Promise<void> {
        console.log(
            chalk.blue('Running cleanup after') +
                ' ' +
                chalk.yellow(this.cleanup_config.cleanupInterval + ' minutes') +
                ' ' +
                chalk.green('at') +
                ' ' +
                chalk.magenta(new Date().toISOString()),
        );

        try {
            await Promise.allSettled([this.cleanup_completed_jobs()]);
        } catch (err) {
            console.error('error in running pod cleanup', err);
        }
    }

    private async cleanup_completed_jobs(): Promise<void> {
        try {
            const jobs = await this.batch_api.listNamespacedJob({
                namespace: env.KUBERNETES_NAMESPACE,
                labelSelector: 'app=northfall-exec',
            });

            const now = Date.now();

            for (const job of jobs.items) {
                const job_name = job.metadata?.name;
                console.log('job name is : ', job_name);
                const creation_time = job.metadata?.creationTimestamp;
                console.log('creation time : ', creation_time);
                if (!creation_time) continue;

                const age_minutes = (now - new Date(creation_time).getTime()) / (60 * 1000);

                console.log('age minutes is : ', age_minutes);
                console.log('succeded is : ', job.status?.succeeded);
                console.log('failed is : ', job.status?.failed);
                console.log('active is ', job.status?.active);
            }
        } catch (error) {
            console.error('error in cleanup compledetd jobs function : ', error);
        }
    }
}
