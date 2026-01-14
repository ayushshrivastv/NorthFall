import KubernetesClient from '../k8s/client.kubernetes';
import KubernetesManager from '../k8s/manager.kubernetes';
import RedisPubSub from '../queue/redis.publisher';
import RedisQueue from '../queue/redis.kubernetes.queue';
import RedisLockService from './redis.locker';
import JobProcessors from '../jobs/job.processor';
import PodCleanupManager from './pod_cleanup.kubernetes';

export default class Services {
    public kubernetes_client: KubernetesClient;
    public kubernetes_manager: KubernetesManager;
    public redis_lock_service: RedisLockService;
    public redis_queue: RedisQueue;
    public redis_publisher: RedisPubSub;
    public job_processor: JobProcessors;
    private pod_cleanup: PodCleanupManager;

    constructor() {
        this.kubernetes_client = new KubernetesClient();
        this.kubernetes_manager = new KubernetesManager(this.kubernetes_client);
        this.redis_lock_service = new RedisLockService();
        this.redis_queue = new RedisQueue('socket-to-orchestrator');
        this.redis_publisher = new RedisPubSub();
        this.job_processor = new JobProcessors();
        this.pod_cleanup = new PodCleanupManager(this.kubernetes_client, {
            maxCompletedAge: 5,
            maxFailedAge: 10,
            maxRunningAge: 20,
            cleanupInterval: 2,
        });
        this.pod_cleanup.start();
    }
    public stop_pod_cleanup() {
        this.pod_cleanup.stop();
    }
}
