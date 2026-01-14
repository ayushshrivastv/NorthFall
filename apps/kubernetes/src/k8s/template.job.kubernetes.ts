import { V1Job } from '@kubernetes/client-node';
import { env } from '../configs/configs.env';
import { pod_resources } from './resources.kubernetes';

interface JobConfig {
    job_name: string;
    job_id: string;
    command: string;
    user_id: string;
    contract_id: string;
}

export default function get_job_template(configs: JobConfig) {
    const { job_id, job_name, user_id, contract_id, command } = configs;

    const job_template: V1Job = {
        apiVersion: 'batch/v1',
        kind: 'Job',
        metadata: {
            name: job_name,
            namespace: env.KUBERNETES_NAMESPACE,
            labels: {
                app: 'northfall-exec',
                'job-id': job_id,
                'contract-id': contract_id,
                'user-id': user_id,
            },
            annotations: {
                'created-at': new Date().toISOString(),
                'anchor-command': command,
            },
        },
        spec: {
            activeDeadlineSeconds: 900,
            backoffLimit: 0,
            ttlSecondsAfterFinished: 100,
            template: {
                metadata: {
                    labels: {
                        app: 'northfall-exec',
                        'job-id': job_id,
                    },
                },
                spec: {
                    restartPolicy: 'Never',
                    volumes: [
                        {
                            name: 'workspace',
                            emptyDir: {},
                        },
                    ],
                    initContainers: [
                        {
                            name: 's3-code-checkout',
                            image: 'amazon/aws-cli:latest',
                            command: ['/bin/sh', '-c'],
                            args: [
                                `
echo "Init: fetching code..."
# You will fill your own S3 copy command here, e.g.:
# aws s3 cp s3://bucket/key /workspace --recursive
echo "Init: done"
                                `,
                            ],
                            workingDir: '/workspace',
                            volumeMounts: [
                                {
                                    name: 'workspace',
                                    mountPath: '/workspace',
                                },
                            ],
                            env: [
                                {
                                    name: 'AWS_ACCESS_KEY_ID',
                                    value: env.SERVER_AWS_ACCESS_KEY_ID,
                                },
                                {
                                    name: 'AWS_SECRET_ACCESS_KEY',
                                    value: env.SERVER_AWS_SECRET_ACCESS_KEY,
                                },
                                {
                                    name: 'AWS_DEFAULT_REGION',
                                    value: env.SERVER_AWS_REGION,
                                },
                                {
                                    name: 'S3_BUCKET',
                                    value: env.SERVER_AWS_BUCKET_NAME || '',
                                },
                            ],
                        },
                    ],
                    containers: [
                        {
                            name: 'anchor-executor',
                            image: 'northfallhub/test:latest',
                            command: ['/bin/sh', '-c'],
                            args: [command],
                            workingDir: '/workspace',
                            volumeMounts: [
                                {
                                    name: 'workspace',
                                    mountPath: '/workspace',
                                },
                            ],
                            resources: pod_resources,
                            env: [
                                {
                                    name: 'RUST_BACKTRACE',
                                    value: '1',
                                },
                                {
                                    name: 'ANCHOR_WALLET',
                                    value: '/workspace/.config/solana/id.json',
                                },
                                {
                                    name: 'JOB_ID',
                                    value: job_id,
                                },
                                {
                                    name: 'CONTRACT_ID',
                                    value: contract_id,
                                },
                            ],
                            imagePullPolicy: 'Always',
                        },
                    ],
                },
            },
        },
    };
    return job_template;
}
