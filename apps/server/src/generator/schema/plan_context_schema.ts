import z from 'zod';

export const plan_context_schema = z.object({
    contract_name: z.string().describe('snake case contract name'),
    contract_title: z
        .string()
        .describe(
            'choose a name for the plan related to the contract each word starting with uppercase',
        ),
    short_description: z
        .string()
        .describe(
            'contains a short description in about 20 words about the plan of the contract which the user has asked for',
        ),
    long_description: z
        .string()
        .describe(
            'contains a brief description in about 60 words about the plan of the contract which the user has asked for',
        ),
    contract_instructions: z.array(
        z.object({
            title: z.string().describe('max two words insruction title of the contract'),
            short_description: z
                .string()
                .describe(
                    'contains a short description about the respective title of the contract instruction',
                ),
            long_description: z
                .string()
                .describe(
                    'contains a brief description which properly describes what the instruction is about and how it will be executed',
                ),
        }),
    ),
});
