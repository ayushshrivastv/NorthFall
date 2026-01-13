import { Request, Response } from 'express';
import { CloudfrontFileParser } from '../../services/code_editor_parser';
import ResponseWriter from '../../class/response_writer';

export default async function getFilesController(req: Request, res: Response) {
    const contractId = req.params.contractId;

    if (!contractId) {
        ResponseWriter.error(res, 'contract-id not found', 400, 'MISSING_CONTRACT_ID');
        return;
    }

    const fileList = [
        `${contractId}/programs/counter/src/lib.rs`,
        `${contractId}/programs/counter/src/errors/mod.rs`,
        `${contractId}/tests/counter.ts`,
        `${contractId}/Anchor.toml`,
    ];

    try {
        const getFileContent = async (fileKey: string): Promise<string> => {
            const fileUrl = `${process.env.SERVER_CLOUDFRONT_DOMAIN}/${fileKey}`;
            const response = await fetch(fileUrl);
            return await response.text();
        };

        const parser = new CloudfrontFileParser({
            fileList,
            getFileContent,
            rootName: contractId,
        });

        const tree = await parser.build_tree();

        ResponseWriter.success(res, tree, 'Files retrieved successfully', 200);
        return;
    } catch (error) {
        console.error('Error fetching files', error);
        ResponseWriter.server_error(
            res,
            'Internal Server Error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
