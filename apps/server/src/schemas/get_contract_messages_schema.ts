import z from 'zod';

export const getContractMessagesSchema = z.object({
    contractId: z.uuid(),
});
