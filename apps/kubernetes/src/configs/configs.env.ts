import z from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
});

const envSchema = z.object({
    KUBERNETES_NODE_ENV: z.enum(['development', 'production']),
    KUBERNETES_PORT: z.string().transform((val) => parseInt(val, 10)),
    KUBERNETES_NAMESPACE: z.string().default('default'),
    KUBERNETES_REDIS_URL: z.url(),
    SERVER_CLOUDFRONT_DOMAIN: z.url(),
    SERVER_AWS_ACCESS_KEY_ID: z.string().transform((val) => val.trim()),
    SERVER_AWS_SECRET_ACCESS_KEY: z.string().transform((val) => val.trim()),
    SERVER_AWS_REGION: z.string().transform((val) => val.trim()),
    SERVER_AWS_BUCKET_NAME: z.string().transform((val) => val.trim()),
});

function parseEnv() {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        console.error('error while parsing envs at kubernetes : ', error);
        process.exit(1);
    }
}

export const env = parseEnv();
