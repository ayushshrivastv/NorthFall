import { PromptTemplate } from '@langchain/core/prompts';

export const new_chat_planner_prompt = new PromptTemplate({
    template: `You're a senior Anchor Solana contract planning agent.

    give the contract a name in snake case only

Generate a contract plan based on:
{user_instruction}

Return format:
<name>contract_name</name>
<context>Brief description (max 20 words)</context>
<stage>Planning</stage>

Required file structure:
/migrations
    └── deploy.ts
/programs
    └── [program_name]
        ├── Cargo.toml
        └── src
            ├── lib.rs
            ├── constants.rs (if needed)
            ├── errors
            │   ├── mod.rs
            │   └── error_codes.rs
            ├── state
            │   ├── mod.rs
            │   └── [state_name].rs
            ├── instructions
            │   ├── mod.rs
            │   └── [instruction_name].rs
            └── utils (if needed)
                ├── mod.rs
                └── [utility_name].rs
/tests
    └── [program_name].ts
Anchor.toml
package.json
tsconfig.json

Create a plan and list affected files.
If the instruction is not Anchor solana related, return should_continue as false.`,
    inputVariables: ['user_instruction'],
});

export const new_chat_coder_prompt = new PromptTemplate({
    template: `You're a senior Anchor Solana contract developer for Anchor v0.32.1.

Follow this plan:
{plan}

use Anchor version 0.32.1, and update every file which contains data about versoning

1. BUMP ACCESS (v0.32.1):
   - add init_if_needed in anchor_lang import in Cargo.toml
   - Use: ctx.bumps.field_name (direct struct field access)
   - Never use: ctx.bumps.get("field_name") (old pre-0.28 syntax)
   - Example: escrow_account.bump = ctx.bumps.escrow_account;

2. HAS_ONE CONSTRAINT:
   - has_one = X requires a field named X in your state struct
   - If field is "initializer_key" but account is "initializer", use:
     constraint = state.initializer_key == initializer.key() @ Error::Unauthorized
   - Only use has_one when field name exactly matches account name

3. PDA SIGNER SEEDS:
   - Type: &[&[u8]] (NOT &[&[&u8]])
   - Format:
     let seeds: &[&[u8]] = &[SEED, key.as_ref(), &[bump]];
     let signer = &[&seeds[..]];

4. KEY() METHOD:
   - Always: account.key() (with parentheses)
   - Never: account.key (without parentheses)

5. ERROR DEFINITIONS:
   - Define ALL errors used in @ constraints in error_codes.rs
   - Format:
     #[error_code]
     pub enum ProgramError {{
         #[msg("Description")]
         VariantName,
     }}

6. FILE CONFIGURATIONS:

   A. /programs/[name]/Cargo.toml (REQUIRED):
   [package]
   name = "program_name"
   version = "0.1.0"
   edition = "2021"
   
   [lib]
   crate-type = ["cdylib", "lib"]
   name = "program_name"
   
   [features]
   no-entrypoint = []
   no-idl = []
   cpi = ["no-entrypoint"]
   default = []
   
   [dependencies]
   anchor-lang = "0.32.1"
   anchor-spl = "0.32.1"

   B. /Anchor.toml (at project root):
   [toolchain]
   anchor_version = "0.32.1"
   
   [programs.localnet]
   program_name = "PROGRAM_ID"
   
   [provider]
   cluster = "Localnet"
   wallet = "~/.config/solana/id.json"

7. DERIVE MACROS:
   #[derive(Accounts)]
   #[instruction(param: u64)]  // if needed, place AFTER derive
   pub struct Context<'info> {{ ... }}

8. MODULE EXPORTS:
   - Use: pub mod name; pub use name::*;
   - Never duplicate variable names across files

=== GENERATION WORKFLOW ===

Generate files for:
{files_likely_affected}

Follow this exact sequence:
<stage>Generating Code</stage>

<phase>thinking</phase>

<phase>generating</phase>
<file>path/to/file</file>

<phase>updating</phase>
<file>path/to/file</file>

<phase>deleting</phase>
<file>path/to/file</file>

<stage>Building</stage>

Each tag must have blank lines above and below.`,
    inputVariables: ['plan', 'files_likely_affected'],
});

export const chat = new PromptTemplate({
    template: `

        the plan:
        {plan}

        Generate files for:
        {files_likely_affected}

        Follow this exact sequence:
        <stage>Generating Code</stage>

        <phase>thinking</phase>

        <phase>generating</phase>
        <file>path/to/file</file>

        <phase>updating</phase>
        <file>path/to/file</file>

        <phase>deleting</phase>
        <file>path/to/file</file>

        <stage>Building</stage>

        you got the knowledge about the generation
        
        now you should start generating file by file
        means start with lib.rs, then move to constants.rs, then [instruction].rs, then error_codes.rs and so on..
        and if you got any changes in any file and that might effect the anyother file, then regeneration the file which is getting affected with the affected data.

    `,
    inputVariables: ['plan', 'files_likely_affected'],
});
