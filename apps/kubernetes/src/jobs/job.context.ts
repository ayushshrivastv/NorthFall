import { IncomingPayload, TerminalSocketData, WSServerIncomingPayload } from '@northfall/types';
import { kubernetes_services } from '..';
import RedisPubSub from '../queue/redis.publisher';

export class JobContext {
    public topic: string;
    private redis: RedisPubSub;
    public userId: string;
    public contractId: string;

    constructor(userId: string, contractId: string) {
        this.topic = `${userId}_${contractId}`;
        this.redis = kubernetes_services.redis_publisher;
        this.userId = userId;
        this.contractId = contractId;
    }

    private create_payload_structure(
        type: TerminalSocketData,
        line: string,
    ): WSServerIncomingPayload<IncomingPayload> {
        return {
            type,
            payload: {
                userId: this.userId,
                contractId: this.contractId,
                line,
                timestamp: Date.now(),
            },
        };
    }

    public send_info(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.INFO, line),
        );
    }

    public send_logs(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.LOGS, line),
        );
    }

    public send_command_exectuion(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.EXECUTING_COMMAND, line),
        );
    }

    public send_build_error(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.BUILD_ERROR, line),
        );
    }

    public send_error_message(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.ERROR_MESSAGE, line),
        );
    }

    public send_validation_error(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.VALIDATION_ERROR, line),
        );
    }

    public send_server_message(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.SERVER_MESSAGE, line),
        );
    }

    public send_completion(line: string) {
        return this.redis.publish(
            this.topic,
            this.create_payload_structure(TerminalSocketData.COMPLETED, line),
        );
    }
}
