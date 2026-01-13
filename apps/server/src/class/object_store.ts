import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import env from '../configs/config.env';
import { FileContent } from '../types/content_types';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import axios from 'axios';

export default class ObjectStore {
    private s3: S3Client;
    private bucket: string;
    private cloudfront: CloudFrontClient;
    private distribution_id: string;

    constructor() {
        this.s3 = new S3Client({
            region: env.SERVER_AWS_REGION,
            credentials: {
                accessKeyId: env.SERVER_AWS_ACCESS_KEY_ID,
                secretAccessKey: env.SERVER_AWS_SECRET_ACCESS_KEY,
            },
        });

        // cdn client for cache clean
        this.cloudfront = new CloudFrontClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: env.SERVER_AWS_ACCESS_KEY_ID,
                secretAccessKey: env.SERVER_AWS_SECRET_ACCESS_KEY,
            },
        });

        this.bucket = env.SERVER_AWS_BUCKET_NAME;
        this.distribution_id = env.SERVER_CLOUDFRONT_DISTRIBUTION_ID;
    }

    private async cleanCache(path: string) {
        await this.cloudfront.send(
            new CreateInvalidationCommand({
                DistributionId: this.distribution_id,
                InvalidationBatch: {
                    CallerReference: Date.now().toString(),
                    Paths: {
                        Quantity: 1,
                        Items: [path],
                    },
                },
            }),
        );
    }

    public async updateContractFiles(
        contractId: string,
        updatedFiles: FileContent[],
    ): Promise<void> {
        try {
            const key = `${contractId}/resource`;

            const upload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: key, // Same key = overwrites existing file
                    Body: JSON.stringify(updatedFiles),
                    ContentType: 'application/json',
                },
            });

            await upload.done();
            await this.cleanCache(`/${key}`);
        } catch (error) {
            console.error('Failed to update contract files: ', error);
            return;
        }
    }

    public async updateContractFilesWithRaw(
        contractId: string,
        updatedFiles: FileContent[],
        rawLlmResponse?: string,
    ): Promise<void> {
        try {
            // Update the resource files
            await this.updateContractFiles(contractId, updatedFiles);

            // Optionally update the raw LLM response
            if (rawLlmResponse) {
                const rawKey = `${contractId}/raw/llm-response.txt`;
                const rawUpload = new Upload({
                    client: this.s3,
                    params: {
                        Bucket: this.bucket,
                        Key: rawKey,
                        Body: rawLlmResponse,
                        ContentType: 'text/plain',
                    },
                });
                await rawUpload.done();
                await this.cleanCache(`/${rawKey}`);
            }
        } catch (error) {
            console.error('Failed to update raw contract files: ', error);
            return;
        }
    }

    public async uploadContractFiles(
        contractId: string,
        files: FileContent[],
        rawLlmResponse: string,
    ) {
        try {
            const key = `${contractId}/resource`;
            const upload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: JSON.stringify(files),
                    ContentType: 'application/json',
                },
            });
            await upload.done();
            await this.cleanCache(`/${key}`);

            const rawKey = `${contractId}/raw/llm-response.txt`;
            const rawUpload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: rawKey,
                    Body: rawLlmResponse,
                    ContentType: 'text/plain',
                },
            });
            await rawUpload.done();
            await this.cleanCache(`/${rawKey}`);
        } catch (error) {
            console.error('Failed to upload contract files: ', error);
            return;
        }
    }

    public async uploadFile(contractId: string, path: string, content: string | Buffer) {
        try {
            const key = `${contractId}/${path}`;

            const upload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: content,
                },
            });

            await upload.done();
            return key;
        } catch (error) {
            console.error('Failed to upload files: ', error);
            return;
        }
    }

    public async get_template_files(templateId: string): Promise<FileContent[]> {
        const res = await axios.get(`${this.get_template_files_path(templateId)}`);
        const template_files: FileContent[] = res.data;
        return template_files;
    }

    public async get_resource_files(contractId: string): Promise<FileContent[]> {
        const res = await axios.get(`${this.get_resource_files_path(contractId)}`);
        const contract_files: FileContent[] = res.data;
        return contract_files;
    }

    public get_raw_files(contractId: string) {
        return `${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/raw/llm-response.txt`;
    }

    public get_template_files_path(templateId: string) {
        return `${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${templateId}/resource`;
    }

    public get_resource_files_path(contractId: string) {
        return `${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;
    }
}
