import { MODEL } from '@northfall/types';
import z from 'zod';

export const generate_contract_schema = z.object({
    contract_id: z.string(),
    instruction: z.string().min(1).max(200),
    model: z.enum([MODEL.CLAUDE, MODEL.GEMINI]).optional(),
});

export const generate_contract = z.object({
    contract_id: z.string(),
    instruction: z.string().max(200).optional(),
    template_id: z.string().optional(),
    model: z.enum([MODEL.CLAUDE, MODEL.GEMINI]).optional(),
});
