import { BatchV1Api, CoreV1Api, Exec, Log, LogOptions, V1Status } from '@kubernetes/client-node';
import podTemplate from './template.kubernetes';
import { env } from '../configs/configs.env';
import { PodServices } from '../services/pod.services';
import KubernetesClient from './client.kubernetes';
import { Writable } from 'stream';
import { PodStatus } from '../types/types.kubernetes';
import { FileContent } from '@northfall/types';
import get_job_template from './template.job.kubernetes';

export default class KubernetesManager {
    private core_api: CoreV1Api;
    private exec_command: Exec;
    private batch_api: BatchV1Api;
    private log: Log;

    constructor(kubernetes_client: KubernetesClient) {
        this.core_api = kubernetes_client.core_api;
        this.exec_command = kubernetes_client.exec;
        this.log = kubernetes_client.log;
        this.batch_api = kubernetes_client.batch_api;
    }

    public async create_job(
        job_id: string,
        user_id: string,
        contract_id: string,
        command: string,
    ): Promise<{ job_name: string; pod_name: string }> {
        try {
            const job_name: string = `build-${job_id}`.toLowerCase().slice(0, 63);
            const job_template = get_job_template({
                user_id,
                contract_id,
                command,
                job_id,
                job_name,
            });

            await this.batch_api.createNamespacedJob({
                namespace: env.KUBERNETES_NAMESPACE,
                body: job_template,
            });

            const pod_name = await this.wait_for_job_pod(job_name);
            return { job_name, pod_name };
        } catch (err) {
            console.error('error while creating the job : ', err);
            throw err;
        }
    }

    private async wait_for_job_pod(job_name: string, timeoutMs = 30000): Promise<string> {
        const start = Date.now();
        const namespace = env.KUBERNETES_NAMESPACE;

        while (Date.now() - start < timeoutMs) {
            try {
                // List pods with job-name label
                const pods = await this.core_api.listNamespacedPod({
                    namespace,
                    labelSelector: `job-name=${job_name}`,
                });

                if (pods.items.length > 0) {
                    const pod_name = pods.items[0].metadata?.name;
                    if (pod_name) {
                        console.log(`Job ${job_name} created pod: ${pod_name}`);
                        return pod_name;
                    }
                }
            } catch (err) {
                console.error('Error checking for job pod:', err);
            }

            await new Promise((r) => setTimeout(r, 1000));
        }

        throw new Error(`Timeout waiting for Job ${job_name} to create pod`);
    }

    public async get_job_status(job_name: string): Promise<{
        active: boolean;
        succeeded: boolean;
        failed: boolean;
    }> {
        try {
            const job = await this.batch_api.readNamespacedJob({
                namespace: env.KUBERNETES_NAMESPACE,
                name: job_name,
            });

            return {
                active: (job.status?.active ?? 0) > 0,
                succeeded: (job.status?.succeeded ?? 0) > 0,
                failed: (job.status?.failed ?? 0) > 0,
            };
        } catch (err) {
            console.error('Error getting job status:', err);
            throw err;
        }
    }

    /**
     * Wait for Job to complete
     */
    public async wait_for_job_completion(
        job_name: string,
        timeoutMs = 15 * 60_000,
    ): Promise<{ success: boolean; error?: string }> {
        const start = Date.now();

        while (Date.now() - start < timeoutMs) {
            const status = await this.get_job_status(job_name);

            if (status.succeeded) {
                return { success: true };
            }

            if (status.failed) {
                return {
                    success: false,
                    error: 'Job failed during execution',
                };
            }

            await new Promise((r) => setTimeout(r, 2000));
        }

        return {
            success: false,
            error: 'Job execution timed out',
        };
    }

    /**
     * Optional: Force delete Job (not usually needed due to TTL)
     */
    public async delete_job(job_name: string): Promise<void> {
        try {
            await this.batch_api.deleteNamespacedJob({
                namespace: env.KUBERNETES_NAMESPACE,
                name: job_name,
                propagationPolicy: 'Background', // Also delete pods
            });
            console.log(`Deleted Job: ${job_name}`);
        } catch (error: unknown) {
            const err = error as { statusCode: number };
            if (err.statusCode === 404) {
                console.log(`Job ${job_name} already deleted`);
                return;
            }
            throw err;
        }
    }

    /**
     * Create a new executor pod for a given job.
     *
     * @param job_id - job id
     * @param user_id - user id
     * @param contract_id - contract id
     * @param command - anchor commands (build/test/deploy)
     * @param code_snapshot_url - codebase
     * @returns name of pod created
     */
    public async create_pod(
        job_id: string,
        user_id: string,
        contract_id: string,
        command: string,
    ): Promise<string> {
        try {
            const pod_name = PodServices.get_pod_name(user_id, contract_id);
            const pod_template = podTemplate({
                pod_name,
                job_id,
                contract_id,
                user_id,
                command,
            });

            const response = await this.core_api.createNamespacedPod({
                namespace: env.KUBERNETES_NAMESPACE,
                body: pod_template,
            });

            console.log('pod name is:', response.metadata?.name ?? pod_name);
            return pod_name;
        } catch (err) {
            console.error('Error creating pod:', err);
            throw err;
        }
    }

    /**
     * Delete a pod from the cluster.
     *
     * @param user_id - user id
     * @param contract_id - contract id
     * @returns success boolean
     */
    public async delete_pod(
        user_id: string,
        contract_id: string,
        maxWaitMs: number = 60000,
    ): Promise<{ success: boolean }> {
        try {
            const pod_name = PodServices.get_pod_name(user_id, contract_id);

            await this.core_api.deleteNamespacedPod({
                namespace: env.KUBERNETES_NAMESPACE,
                name: pod_name,
            });

            const start = Date.now();
            while (Date.now() - start < maxWaitMs) {
                try {
                    await this.core_api.readNamespacedPod({
                        namespace: env.KUBERNETES_NAMESPACE,
                        name: pod_name,
                    });
                    await new Promise((r) => setTimeout(r, 1000));
                } catch (error) {
                    const err = error as {
                        statusCode?: number;
                        response?: {
                            statusCode?: number;
                        };
                    };
                    if (err.statusCode === 404 || err.response?.statusCode === 404) {
                        console.log(`Pod ${pod_name} successfully deleted`);
                        return { success: true };
                    }
                    throw err;
                }
            }

            console.warn(`Pod ${pod_name} deletion timeout`);
            return { success: false };
        } catch (err) {
            console.error('Error deleting pod:', err);
            return { success: false };
        }
    }

    /**
     * Get pod status
     *
     * @param namespace - k8s namespace
     * @param pod_name - pod to check
     * @returns pod_status enum
     */
    public async get_pod_status(namespace: string, pod_name: string): Promise<PodStatus> {
        try {
            const res = await this.core_api.readNamespacedPod({
                namespace,
                name: pod_name,
            });

            const phase = res.status?.phase;

            switch (phase) {
                case 'Pending':
                    return PodStatus.Pending;
                case 'Running':
                    return PodStatus.Running;
                case 'Succeeded':
                    return PodStatus.Succeeded;
                case 'Failed':
                    return PodStatus.Failed;
                default:
                    return PodStatus.Unknown;
            }
        } catch (err) {
            console.error('Error in get_pod_status:', err);
            return PodStatus.Unknown;
        }
    }

    /**
     * Wait until a pod reaches Running state or fails/times out.
     *
     * @param pod_name - name of pod
     * @param timeoutMs - max wait time
     */
    public async wait_for_pod_running(pod_name: string, timeoutMs = 10 * 60_000): Promise<void> {
        const start = Date.now();
        const namespace = env.KUBERNETES_NAMESPACE;

        console.log(`Waiting for pod ${pod_name} to be running...`);

        while (Date.now() - start < timeoutMs) {
            const status = await this.get_pod_status(namespace, pod_name);
            console.log(`Pod ${pod_name} status: ${status}`);

            if (status !== PodStatus.Running) {
                try {
                    await this.core_api.readNamespacedPod({
                        namespace,
                        name: pod_name,
                    });
                } catch (err) {
                    console.error('Error getting detailed pod status:', err);
                }
            }

            if (status === PodStatus.Running) {
                console.log('Pod is now running');
                return;
            }

            if (status === PodStatus.Failed) {
                console.error('Pod failed during startup');
                throw new Error('Pod failed during startup');
            }

            await new Promise((r) => setTimeout(r, 1500));
        }

        throw new Error('Timed out waiting for pod to be Running');
    }

    /**
     * Wait until container is ready to accept commands.
     *
     * @param namespace - k8s namespace
     * @param pod_name - pod to monitor
     * @param container_name - container to check
     * @param timeoutMs - max wait time
     */
    public async wait_for_container_ready(
        namespace: string,
        pod_name: string,
        container_name: string,
        timeoutMs = 30_000,
    ): Promise<void> {
        const start = Date.now();

        while (Date.now() - start < timeoutMs) {
            try {
                console.log('waiting for container to be ready');
                await this.run_command_on_pod({
                    namespace,
                    pod_name,
                    container_name,
                    command: ['echo', 'ready'],
                    timeoutMs: 5000,
                });
                return;
            } catch (err) {
                console.log('failedddd', err);
                await new Promise((r) => setTimeout(r, 1000));
            }
        }

        throw new Error('Container never became ready to accept commands');
    }

    /**
     * Execute any command inside a running container inside the pod.
     *
     * @param params - exec configuration
     * @param params.namespace - k8s namespace
     * @param params.pod_name - pod name
     * @param params.container_name - container to execute in
     * @param params.command - commands
     * @param params.onData - stream callback for live output
     * @param params.timeoutMs - timeout in milliseconds
     * @returns stdout and stderr
     */
    public async run_command_on_pod(params: {
        namespace: string;
        pod_name: string;
        container_name: string;
        command: string[];
        onData?: (chunk: string) => void;
        timeoutMs?: number;
    }): Promise<{ stdout: string; stderr: string }> {
        const {
            namespace,
            pod_name,
            container_name,
            command,
            onData,
            timeoutMs = 300_000,
        } = params;

        const commandPromise = new Promise<{ stdout: string; stderr: string }>(
            (resolve, reject) => {
                let stdout_data = '';
                let stderr_data = '';
                let resolved = false;

                const stdout_stream = new Writable({
                    write(chunk, _encoding, callback) {
                        const str = chunk.toString();
                        stdout_data += str;
                        onData?.(str);
                        callback();
                    },
                });

                const stderr_stream = new Writable({
                    write(chunk, _encoding, callback) {
                        const str = chunk.toString();
                        stderr_data += str;
                        onData?.(str);
                        callback();
                    },
                });

                stdout_stream.on('error', (err) => {
                    if (!resolved) {
                        resolved = true;
                        reject(err);
                    }
                });

                stderr_stream.on('error', (err) => {
                    if (!resolved) {
                        resolved = true;
                        reject(err);
                    }
                });

                this.exec_command.exec(
                    namespace,
                    pod_name,
                    container_name,
                    command,
                    stdout_stream,
                    stderr_stream,
                    null,
                    false,
                    (status: V1Status) => {
                        if (resolved) return;
                        resolved = true;

                        stdout_stream.end();
                        stderr_stream.end();

                        if (status.status === 'Success') {
                            resolve({ stdout: stdout_data, stderr: stderr_data });
                        } else {
                            reject(new Error(status.message || 'Pod command execution failed'));
                        }
                    },
                );
            },
        );

        return Promise.race([
            commandPromise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Command execution timeout')), timeoutMs),
            ),
        ]);
    }

    /**
     * Stream logs from a pod
     *
     * @param params.namespace - k8s namespace
     * @param params.user_id - user owning the pod
     * @param params.contract_id - contract owning the pod
     * @param params.container_name - which container to stream logs from
     * @param params.tail_lines - number of trailing lines
     * @param params.onData - called for every log chunk
     */
    public async stream_pod_logs(params: {
        namespace: string;
        user_id: string;
        contract_id: string;
        container_name: string;
        tail_lines: number;
        onData: (line: string) => void;
    }): Promise<void> {
        const { namespace, user_id, contract_id, container_name, tail_lines, onData } = params;

        const pod_name = PodServices.get_pod_name(user_id, contract_id);

        const log_stream = new Writable({
            write(chunk, _encoding, callback) {
                onData(chunk.toString());
                callback();
            },
        });

        const log_options: LogOptions = {
            follow: true,
            tailLines: tail_lines,
            timestamps: false,
        };

        return new Promise<void>((resolve, reject) => {
            this.log
                .log(namespace, pod_name, container_name, log_stream, log_options)
                .then(() => {
                    log_stream.end();
                    resolve();
                })
                .catch((err) => {
                    log_stream.end();
                    reject(err);
                });
        });
    }

    /**
     * Wait until a pod completes/ succeeds/ fails
     *
     * @param namespace - k8s namespace
     * @param pod_name - pod to monitor
     * @param timeoutMs - max wait time
     * @returns final pod_Status
     */
    public async wait_for_pod_completion(
        namespace: string,
        pod_name: string,
        timeoutMs = 10 * 60_000,
    ): Promise<PodStatus> {
        const start = Date.now();

        while (Date.now() - start < timeoutMs) {
            const status = await this.get_pod_status(namespace, pod_name);

            if (status === PodStatus.Succeeded || status === PodStatus.Failed) {
                return status;
            }

            await new Promise((r) => setTimeout(r, 2000));
        }

        throw new Error('Timed out waiting for pod completion');
    }

    /**
     * Upload a list of files to a pod.
     * NOTE: This overwrites the init container's downloaded code.
     * Files are copied to /workspace (not /workspace/${contract_name}).
     *
     * @param namespace - k8s namespace
     * @param pod_name - name od pod
     * @param files - array of files: { path, content }
     */
    public async copy_files_to_pod(
        namespace: string,
        pod_name: string,
        files: FileContent[],
    ): Promise<void> {
        if (!files || files.length === 0) {
            console.log('No files supplied for copying');
            return;
        }

        const container_name = 'anchor-executor';
        const base_dir = '/workspace';

        for (const file of files) {
            if (file.path.includes('..') || file.path.startsWith('/')) {
                throw new Error(`Invalid file path: ${file.path}`);
            }
        }

        // Clear workspace (except target dir for build cache)
        await this.run_command_on_pod({
            namespace,
            pod_name,
            container_name,
            command: [
                'sh',
                '-c',
                `cd ${base_dir} && find . -maxdepth 1 -mindepth 1 ! -name 'target' -exec rm -rf {} + || true`,
            ],
        });

        // Copy each file
        for (const file of files) {
            const full_path = `${base_dir}/${file.path}`;
            const dir = full_path.substring(0, full_path.lastIndexOf('/'));

            // Create directory structure
            await this.run_command_on_pod({
                namespace,
                pod_name,
                container_name,
                command: ['mkdir', '-p', dir],
            });

            const escaped_path = full_path.replace(/'/g, "'\\''");
            const base64 = Buffer.from(file.content).toString('base64');

            await this.run_command_on_pod({
                namespace,
                pod_name,
                container_name,
                command: ['sh', '-c', `base64 -d > '${escaped_path}' << 'EOF'\n${base64}\nEOF`],
            });
        }

        try {
            await this.run_command_on_pod({
                namespace,
                pod_name,
                container_name,
                command: [
                    'sh',
                    '-c',
                    "cd /workspace && ls -la && cat package.json 2>&1 || echo 'No package.json'",
                ],
                timeoutMs: 10_000,
            });
        } catch (err) {
            console.error('Error checking workspace:', err);
        }

        // Check if yarn is installed, if not skip dependency installation
        try {
            await this.run_command_on_pod({
                namespace,
                pod_name,
                container_name,
                command: ['which', 'yarn'],
                timeoutMs: 5_000,
            });
        } catch (err) {
            console.log('Yarn not found in container, skipping dependency installation', err);
            return;
        }

        console.log('Installing dependencies...');
        try {
            const { stderr } = await this.run_command_on_pod({
                namespace,
                pod_name,
                container_name,
                command: ['sh', '-c', 'cd /workspace && yarn install 2>&1'],
                timeoutMs: 5 * 60_000,
                // onData: (chunk) => console.log(chunk), // Stream output for debugging
            });
            if (stderr) console.log('Yarn stderr:', stderr);
            console.log('Dependencies installed successfully');
        } catch (err) {
            console.error('Failed to install dependencies:', err);
            // Don't throw - Anchor projects might not need yarn
            console.log('Continuing without yarn dependencies...');
        }
    }
}
