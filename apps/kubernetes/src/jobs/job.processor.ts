import { kubernetes_services } from '..';
import { env } from '../configs/configs.env';
import { PodServices } from '../services/pod.services';
import { JobContext } from './job.context';
import { randomUUID } from 'crypto';

export default class JobProcessors {
    public async execute_build_in_pod(context: JobContext, command: string[]) {
        try {
            let job_name: string | null = null;
            let pod_name: string | null = null;
            const job_id = randomUUID();
            const is_acquired = await kubernetes_services.redis_lock_service.is_acquired(
                context.userId,
                context.contractId,
            );
            if (is_acquired) {
                context.send_error_message(
                    'Previous command execution in progress, please wait...',
                );
                return;
            }

            const locked = await kubernetes_services.redis_lock_service.acquire_lock(
                context.userId,
                context.contractId,
            );
            if (!locked) {
                context.send_error_message('Failed to execute command, please try again');
                return;
            }

            context.send_server_message('queuing your command');

            const files = await PodServices.get_codebase(context.contractId);
            if (!files || files.length === 0) {
                context.send_error_message('Failed to execute command, please try again...');
                return;
            }

            const result = await kubernetes_services.kubernetes_manager.create_job(
                job_id,
                context.userId,
                context.contractId,
                command.join(' '),
            );
            job_name = result.job_name;
            pod_name = result.pod_name;

            // const pod_name = await kubernetes_services.kubernetes_manager.create_pod(
            //     job_id,
            //     context.userId,
            //     context.contractId,
            //     command.join(' '),
            // );

            console.log(`Job: ${job_name}, Pod: ${pod_name}`);

            if (!pod_name) {
                context.send_error_message('Internal server error');
                return;
            }

            await kubernetes_services.kubernetes_manager.wait_for_pod_running(pod_name);
            await kubernetes_services.kubernetes_manager.wait_for_container_ready(
                env.KUBERNETES_NAMESPACE,
                pod_name,
                'anchor-executor',
            );

            await kubernetes_services.kubernetes_manager.copy_files_to_pod(
                env.KUBERNETES_NAMESPACE,
                pod_name,
                files,
            );

            context.send_command_exectuion('executing command......');

            await kubernetes_services.kubernetes_manager.run_command_on_pod({
                namespace: env.KUBERNETES_NAMESPACE,
                pod_name: pod_name,
                container_name: 'anchor-executor',
                command: command,
                onData: (chunk) => {
                    context.send_logs(chunk.toString());
                },
            });

            context.send_server_message('Successfully built your anchor contract');
            return { success: true };
        } catch (error) {
            console.error('some error occured while creating the pod : ', error);
        } finally {
            await Promise.allSettled([
                kubernetes_services.redis_lock_service.release_lock(
                    context.userId,
                    context.contractId,
                ),
            ]);
            context.send_completion('execution complete');
        }
    }
}
