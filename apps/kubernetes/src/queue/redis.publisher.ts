import { IncomingPayload, WSServerIncomingPayload } from '@northfall/types';
import Redis from 'ioredis';

export default class RedisPubSub {
    private publisher: Redis;

    constructor() {
        this.publisher = new Redis('');
    }

    public async publish(topic: string, message: WSServerIncomingPayload<IncomingPayload>) {
        try {
            const stringified_message = JSON.stringify(message);
            await this.publisher.publish(topic, stringified_message);
            console.log('publishing the msg to socket server', message);
        } catch (error) {
            console.error('Failed to publish redis evetn', error);
        }
    }
}
