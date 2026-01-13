import ObjectStore from '../class/object_store';
import Generator from '../generator/generator';
import RazorpayGateway from '../payments/razorpay';
import { GithubWorkerQueue } from '../queue/github_worker_queue';
import { seedTemplates } from './seed_templates';
import GithubServices from './services.github';

export let objectStore: ObjectStore;
export let razorpay: RazorpayGateway;
export let github_worker_queue: GithubWorkerQueue;
export let generator: Generator;
export let github_services: GithubServices;

export default async function init_services() {
    objectStore = new ObjectStore();
    razorpay = new RazorpayGateway();
    github_worker_queue = new GithubWorkerQueue('github-push');
    generator = new Generator();
    github_services = new GithubServices();

    try {
        await seedTemplates();
    } catch (error) {
        console.error('templates', error);
    }
}
