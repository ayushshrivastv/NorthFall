import { V1Pod } from '@kubernetes/client-node';
import { env } from '../configs/configs.env';
import { pod_resources } from './resources.kubernetes';
import { PodConfig } from '../types/types.kubernetes';

export default function podTemplate(configs: PodConfig) {
    const { pod_name, job_id, contract_id, user_id, command } = configs;

    const podTemplate: V1Pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
            name: pod_name,
            namespace: env.KUBERNETES_NAMESPACE,
            labels: {
                app: 'anchor-executor',
                'job-id': job_id,
                'contract-id': contract_id,
                'user-id': user_id,
            },
            annotations: {
                'created-at': new Date().toISOString(),
                'anchor-command': command,
                'pod.kubernetes.io/ttl': '300',
            },
        },
        spec: {
            activeDeadlineSeconds: 1800,
            restartPolicy: 'Never',
            containers: [
                {
                    name: 'anchor-executor',
                    image: 'northfallhub/test:latest',
                    // Keep container alive - you'll run commands via exec
                    command: ['/bin/sh', '-c'],
                    args: ['tail -f /dev/null'],
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
            volumes: [
                {
                    name: 'workspace',
                    emptyDir: {},
                },
            ],
        },
    };
    return podTemplate;
}
