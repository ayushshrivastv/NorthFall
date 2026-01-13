import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@northfall/database';

export default async function delete_contract_controller(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        ResponseWriter.unauthorized(res, 'User not authenticated');
        return;
    }
    try {
        const contract_id = req.params.contractId;
        console.log('Deleting contract with id:', contract_id);
        if (!contract_id) {
            ResponseWriter.no_content(res);
            return;
        }
        const contract = await prisma.contract.findFirst({
            where: {
                id: contract_id,
                userId: user_id,
            },
        });
        console.log('contract retrieved:', contract?.id);
        if (!contract) {
            ResponseWriter.not_found(res, 'Contract not found');
            return;
        }
        console.log('contract found:', contract.id);
        await prisma.contract.delete({
            where: {
                id: contract_id,
            },
        });
        console.log('contract deleted:', contract.id);
        ResponseWriter.success(
            res,
            { success: true, contractId: contract.id },
            'contract deleted successfully',
        );
        console.log('------------------------------------');
    } catch (err) {
        ResponseWriter.server_error(res, 'Failed to delete contract');
        console.error('error while deleting contract:', err);
    }
}
