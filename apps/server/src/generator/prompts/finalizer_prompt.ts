import { PromptTemplate } from '@langchain/core/prompts';

export const finalizer_prompt = new PromptTemplate({
    template: `
        You're a senior anchor solana contract finalizer agent, which checks for any errors

        this is the generated files:
        {generated_files}

        now from this generate a idl like structure for every file in an array
        the following a basic layout:
        <idl>
        [
            {{
                id: "programs/todo_contract/src/instructions/add_todo.rs",
                path: "programs/todo_contract/src/instructions/add_todo.rs",
                function_name: "add_todo",
                params: [
                    {{ name: todo, type: string }},
                ],
                return: [
                    {{ return: value, type: string }},
                ],
                does_contain_any_struct: boolean,
                struct_values: [
                    {{ name: todo, type: PDA }},
                ],
            }}
        ]
        </idl>

        <context>context at the end of contract of what this contract is about in near about 20 words</context>
    `,
    inputVariables: ['generated_files'],
});

export const reviewer_prompt = new PromptTemplate({
    template: `

    this is the generated files:
    {generated_files}
    
    you need to verify all the file structures from this and only generate or update the changable ones
    
    /migrations
        └── deploy.ts
    /programs
        └── [program_name]
            └── src
                ├── lib.rs
                ├── constants.rs (if needed)
                ├── errors
                    ├── mod.rs
                    └── error_codes.rs
                ├── state
                    ├── mod.rs
                    └── [state_name].rs
                ├── instructions
                    ├── mod.rs
                    └── [instruction_name].rs
                └── utils (if needed)
                    ├── mod.rs
                    └──[utility_name].rs
    /tests
        └── [program_name].ts
    .gitignore
    .prettierignore
    Anchor.toml
    Cargo.toml
    package.json
    tsconfig.json
    `,
    inputVariables: ['generated_files'],
});
