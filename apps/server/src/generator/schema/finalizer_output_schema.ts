import z from 'zod';

const instruction_schema = z.object({
    name: z.string(),
    params: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
        }),
    ),
    returns: z.array(
        z.object({
            type: z.string(),
        }),
    ),
});

const struct_schema = z.object({
    name: z.string(),
    type: z.string(),
    instruction_macro: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
        }),
    ),
    struct_vars: z.array(
        z.object({
            name: z.string(),
            type: z.string(),
            macro: z.string(),
        }),
    ),
});

const entrypoint_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        mod_name: z.string(),
        public_key: z.string(),
        instructions: z.array(
            z.object({
                name: z.string(),
            }),
        ),
    }),
});

const instruction_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        instructions: z.array(instruction_schema),
    }),
});

const struct_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        structs: z.array(struct_schema),
    }),
});

const instruction_and_struct_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        instructions: z.array(instruction_schema),
        structs: z.array(struct_schema),
    }),
});

const test_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        description: z.string(),
    }),
});

const mod_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        mods: z.array(
            z.object({
                name: z.string(),
            }),
        ),
    }),
});

const packages_file_schema = z.object({
    id: z.string(),
    path: z.string(),
    type: z.string(),
    content: z.object({
        name: z.string(),
        description: z.string(),
    }),
});

const finalizer_schema = z.union([
    entrypoint_file_schema,
    instruction_file_schema,
    struct_file_schema,
    instruction_and_struct_schema,
    test_file_schema,
    mod_file_schema,
    packages_file_schema,
]);

export const finalizer_output_schema = z.object({
    idl: z.array(finalizer_schema),
    context: z.string(),
});
