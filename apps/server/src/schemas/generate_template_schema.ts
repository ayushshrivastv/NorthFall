import z from 'zod';

export const generate_template_schema = z.object({
    contract_id: z.string(),
    template_id: z.string(),
    instruction: z.string().min(1).max(200),
});
