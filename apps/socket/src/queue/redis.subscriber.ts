import Redis from 'ioredis';
import { wsserver } from '../services/services.init';

export default class RedisPubSub {
    private subscriber: Redis;

    constructor() {
        this.subscriber = new Redis('');
        this.pubsub_processor();
    }

    private pubsub_processor() {
        this.subscriber.on('message', (channel: string, message: string) => {
            const socket = wsserver.connection_mapping.get(channel);
            if (!socket) return;
            console.log(JSON.parse(message));
            wsserver.send_message(socket, JSON.parse(message));
        });
    }

    public async subscribe(channel: string) {
        console.log(`subbed to: ${channel}`);
        await this.subscriber.subscribe(channel);
    }

    public async unsubscribe(channel: string) {
        await this.subscriber.unsubscribe(channel);
    }
}
