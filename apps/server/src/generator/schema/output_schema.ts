import z from 'zod';

export const new_planner_output_schema = z.object({
    should_continue: z.boolean(),
    plan: z.string(),
    contract_name: z.string().describe('the contract name should be in snake case'),
    context: z.string(),
    files_likely_affected: z.array(
        z.object({
            do: z.enum(['create', 'update', 'delete']),
            file_path: z.string(),
            what_to_do: z.string(),
        }),
    ),
});

export const old_planner_output_schema = z.object({
    should_continue: z.boolean(),
    plan: z.string(),
    context: z.string(),
    files_likely_affected: z.array(
        z.object({
            do: z.enum(['create', 'update', 'delete']),
            file_path: z.string(),
            what_to_do: z.string(),
        }),
    ),
});
