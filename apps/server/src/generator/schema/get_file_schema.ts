import z from 'zod';

export const get_file_schema = z.object({
    file_path: z.string().describe('Path of the file to fetch'),
    contract_id: z.string().describe('contract id whose files should be fetched'),
});

export const get_template_file_schema = z.object({
    file_path: z.string().describe('Path of the template file to fetch'),
    template_id: z.string().describe('template id whose files should be fetched'),
});
