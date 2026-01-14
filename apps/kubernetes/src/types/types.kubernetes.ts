export interface PodConfig {
    pod_name: string;
    job_id: string;
    contract_id: string;
    user_id: string;
    command: string;
}

export enum PodStatus {
    Pending = 'Pending',
    Running = 'Running',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
    Unknown = 'Unknown',
    Terminating = 'Terminating',
}
