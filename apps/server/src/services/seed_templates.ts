import { Prisma, prisma } from '@northfall/database';

export async function seedTemplates() {
    const templates: Prisma.TemplateCreateInput[] = [
        // template 1: escrow contract
        {
            id: 'b50ed015-44ad-4573-a760-075d3ffaa929',
            title: 'Escrow Contract',
            description: 'A simple Anchor-based escrow program using PDA accounts.',
            category: 'defi',
            tags: ['escrow', 'anchor', 'solana', 'pda', 'defi'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-1.jpg',
            summarisedObject: JSON.stringify([
                [
                    {
                        id: 'programs/escrow_contract/src/lib.rs',
                        path: 'programs/escrow_contract/src/lib.rs',
                        type: 'module',
                        content: {
                            description: 'Anchor Solana Escrow Contract',
                        },
                    },
                    {
                        id: 'programs/escrow_contract/src/instructions/initialize.rs',
                        path: 'programs/escrow_contract/src/instructions/initialize.rs',
                        type: 'function',
                        content: {
                            description:
                                'Initialize a new escrow account, depositing tokens for exchange.',
                        },
                    },
                    {
                        id: 'programs/escrow_contract/src/instructions/cancel.rs',
                        path: 'programs/escrow_contract/src/instructions/cancel.rs',
                        type: 'function',
                        content: {
                            description: 'Cancel an existing escrow and reclaim tokens.',
                        },
                    },
                    {
                        id: 'programs/escrow_contract/src/instructions/exchange.rs',
                        path: 'programs/escrow_contract/src/instructions/exchange.rs',
                        type: 'function',
                        content: {
                            description:
                                'Execute the token exchange between initializer and taker.',
                        },
                    },
                    {
                        id: 'programs/escrow_contract/src/state/escrow_account.rs',
                        path: 'programs/escrow_contract/src/state/escrow_account.rs',
                        type: 'struct',
                        content: {
                            description: 'State of the escrow account holding necessary details.',
                        },
                    },
                    {
                        id: 'programs/escrow_contract/src/errors/error_codes.rs',
                        path: 'programs/escrow_contract/src/errors/error_codes.rs',
                        type: 'enum',
                        content: {
                            description: 'Error codes for the escrow contract.',
                        },
                    },
                    {
                        id: 'tests/escrow_contract.ts',
                        path: 'tests/escrow_contract.ts',
                        type: 'test',
                        content: {
                            description: 'Tests for the escrow contract functionalities.',
                        },
                    },
                ],
            ]),
        },
        // template 2: counter contract
        {
            id: 'ec8a6034-8832-44f9-82c2-c8e07fd64cf9',
            title: 'Counter Contract',
            description: 'A simple Anchor-based counter program using PDA accounts.',
            category: 'utility',
            tags: ['counter', 'anchor', 'solana', 'pda', 'utility'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-2.jpg',
            summarisedObject: JSON.stringify([
                {
                    id: '/programs/counter_contract/src/lib.rs',
                    path: '/programs/counter_contract/src/lib.rs',
                    type: 'program',
                    content: {
                        description: 'Main program module for the counter contract.',
                    },
                },
                {
                    id: '/programs/counter_contract/src/instructions/initialize_counter.rs',
                    path: '/programs/counter_contract/src/instructions/initialize_counter.rs',
                    type: 'instruction',
                    content: {
                        description:
                            'Initializes the counter state with authority and initial count value.',
                    },
                },
                {
                    id: '/programs/counter_contract/src/instructions/increment_counter.rs',
                    path: '/programs/counter_contract/src/instructions/increment_counter.rs',
                    type: 'instruction',
                    content: {
                        description: 'Increments the counter value by 1.',
                    },
                },
                {
                    id: '/programs/counter_contract/src/instructions/decrement_counter.rs',
                    path: '/programs/counter_contract/src/instructions/decrement_counter.rs',
                    type: 'instruction',
                    content: {
                        description: 'Decrements the counter value by 1.',
                    },
                },
                {
                    id: '/programs/counter_contract/src/state/counter_state.rs',
                    path: '/programs/counter_contract/src/state/counter_state.rs',
                    type: 'state',
                    content: {
                        description: 'State structure for the counter contract.',
                    },
                },
            ]),
        },
        // template 3: staking contract
        {
            id: '913a8e59-de95-4e97-b236-b236a757e2bb',
            title: 'Staking Contract',
            description: 'A lightweight Anchor-based staking program using PDA accounts.',
            category: 'defi',
            tags: ['staking', 'anchor', 'solana', 'pda', 'defi'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-3.jpg',
            summarisedObject: JSON.stringify([
                {
                    id: 'programs/staking_contract/src/lib.rs',
                    path: 'programs/staking_contract/src/lib.rs',
                    type: 'module',
                    content: {
                        mod_name: 'staking_contract',
                        public_key: 'Stake1111111111111111111111111111111111111111',
                        instructions: [
                            { name: 'initialize_staking_pool' },
                            { name: 'stake' },
                            { name: 'unstake' },
                            { name: 'claim_rewards' },
                            { name: 'update_staking_pool' },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/instructions/initialize_staking_pool.rs',
                    path: 'programs/staking_contract/src/instructions/initialize_staking_pool.rs',
                    type: 'function',
                    content: {
                        instructions: [
                            {
                                name: 'initialize_staking_pool',
                                params: [
                                    { name: 'reward_rate', type: 'u64' },
                                    { name: 'lock_period', type: 'i64' },
                                ],
                                returns: [{ type: 'Result' }],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/instructions/stake.rs',
                    path: 'programs/staking_contract/src/instructions/stake.rs',
                    type: 'function',
                    content: {
                        instructions: [
                            {
                                name: 'stake',
                                params: [{ name: 'amount', type: 'u64' }],
                                returns: [{ type: 'Result' }],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/instructions/unstake.rs',
                    path: 'programs/staking_contract/src/instructions/unstake.rs',
                    type: 'function',
                    content: {
                        instructions: [
                            {
                                name: 'unstake',
                                params: [{ name: 'amount', type: 'u64' }],
                                returns: [{ type: 'Result' }],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/instructions/claim_rewards.rs',
                    path: 'programs/staking_contract/src/instructions/claim_rewards.rs',
                    type: 'function',
                    content: {
                        instructions: [
                            {
                                name: 'claim_rewards',
                                params: [],
                                returns: [{ type: 'Result' }],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/instructions/update_staking_pool.rs',
                    path: 'programs/staking_contract/src/instructions/update_staking_pool.rs',
                    type: 'function',
                    content: {
                        instructions: [
                            {
                                name: 'update_staking_pool',
                                params: [
                                    { name: 'new_reward_rate', type: 'Option<u64>' },
                                    { name: 'new_lock_period', type: 'Option<i64>' },
                                    { name: 'paused', type: 'Option<bool>' },
                                ],
                                returns: [{ type: 'Result' }],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/state/staking_pool_account.rs',
                    path: 'programs/staking_contract/src/state/staking_pool_account.rs',
                    type: 'struct',
                    content: {
                        structs: [
                            {
                                name: 'StakingPoolAccount',
                                type: 'struct',
                                instruction_macro: [
                                    { name: 'authority', type: 'Pubkey' },
                                    { name: 'stake_mint', type: 'Pubkey' },
                                    { name: 'reward_mint', type: 'Pubkey' },
                                    { name: 'stake_vault', type: 'Pubkey' },
                                    { name: 'reward_vault', type: 'Pubkey' },
                                    { name: 'total_staked', type: 'u64' },
                                    { name: 'reward_rate', type: 'u64' },
                                    { name: 'lock_period', type: 'i64' },
                                    { name: 'paused', type: 'bool' },
                                    { name: 'bump', type: 'u8' },
                                    { name: 'stake_vault_bump', type: 'u8' },
                                    { name: 'reward_vault_bump', type: 'u8' },
                                    { name: 'created_at', type: 'i64' },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/state/stake_account.rs',
                    path: 'programs/staking_contract/src/state/stake_account.rs',
                    type: 'struct',
                    content: {
                        structs: [
                            {
                                name: 'StakeAccount',
                                type: 'struct',
                                instruction_macro: [
                                    { name: 'staking_pool', type: 'Pubkey' },
                                    { name: 'staker', type: 'Pubkey' },
                                    { name: 'amount_staked', type: 'u64' },
                                    { name: 'stake_start_time', type: 'i64' },
                                    { name: 'last_claim_time', type: 'i64' },
                                    { name: 'total_rewards_claimed', type: 'u64' },
                                    { name: 'bump', type: 'u8' },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/staking_contract/src/errors/error_codes.rs',
                    path: 'programs/staking_contract/src/errors/error_codes.rs',
                    type: 'enum',
                    content: {
                        structs: [
                            {
                                name: 'StakingError',
                                type: 'enum',
                                instruction_macro: [
                                    { name: 'Unauthorized', type: 'error' },
                                    { name: 'InvalidStakingPool', type: 'error' },
                                    { name: 'InvalidMint', type: 'error' },
                                    { name: 'InvalidTokenAccountOwner', type: 'error' },
                                    { name: 'InvalidAmount', type: 'error' },
                                    { name: 'InsufficientFunds', type: 'error' },
                                    { name: 'InsufficientStake', type: 'error' },
                                    { name: 'InsufficientRewardFunds', type: 'error' },
                                    { name: 'LockPeriodNotMet', type: 'error' },
                                    { name: 'NoActiveStake', type: 'error' },
                                    { name: 'NoRewardsToClaim', type: 'error' },
                                    { name: 'PoolPaused', type: 'error' },
                                    { name: 'MathOverflow', type: 'error' },
                                    { name: 'InvalidLockPeriod', type: 'error' },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'tests/staking_contract.ts',
                    path: 'tests/staking_contract.ts',
                    type: 'test',
                    content: { structs: [] },
                },
                {
                    id: 'migrations/deploy.ts',
                    path: 'migrations/deploy.ts',
                    type: 'script',
                    content: { structs: [] },
                },
                { id: 'Cargo.toml', path: 'Cargo.toml', type: 'toml', content: { structs: [] } },
                {
                    id: 'package.json',
                    path: 'package.json',
                    type: 'json',
                    content: { structs: [] },
                },
                {
                    id: 'tsconfig.json',
                    path: 'tsconfig.json',
                    type: 'json',
                    content: { structs: [] },
                },
                {
                    id: 'rust-toolchain.toml',
                    path: 'rust-toolchain.toml',
                    type: 'toml',
                    content: { structs: [] },
                },
                { id: '.gitignore', path: '.gitignore', type: 'ignore', content: { structs: [] } },
                {
                    id: '.prettierignore',
                    path: '.prettierignore',
                    type: 'ignore',
                    content: { structs: [] },
                },
                {
                    id: 'programs/staking_contract/Cargo.toml',
                    path: 'programs/staking_contract/Cargo.toml',
                    type: 'toml',
                    content: { structs: [] },
                },
                { id: 'Anchor.toml', path: 'Anchor.toml', type: 'toml', content: { structs: [] } },
            ]),
        },
        // template 4: todo contract
        {
            id: 'db05e856-e527-4f7a-b303-da9f6e13641c',
            title: 'Todo Contract',
            description: 'A simple Anchor-powered todo manager.',
            category: 'productivity',
            tags: ['todo', 'anchor', 'solana', 'pda', 'task-management'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-4.jpg',
            summarisedObject: JSON.stringify([
                [
                    {
                        id: 'programs/todo_contract/src/constants.rs',
                        path: 'programs/todo_contract/src/constants.rs',
                        type: 'constants',
                        content: {
                            description:
                                'Contains constant values used throughout the todo contract.',
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/errors/error_codes.rs',
                        path: 'programs/todo_contract/src/errors/error_codes.rs',
                        type: 'error_codes',
                        content: {
                            structs: [
                                {
                                    name: 'TodoError',
                                    type: 'enum',
                                    instruction_macro: [
                                        { name: 'Unauthorized', type: 'error' },
                                        { name: 'TodoNotFound', type: 'error' },
                                        { name: 'ContentTooLong', type: 'error' },
                                        { name: 'ContentEmpty', type: 'error' },
                                        { name: 'AlreadyCompleted', type: 'error' },
                                        { name: 'ArithmeticOverflow', type: 'error' },
                                    ],
                                    struct_vars: [],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/state/todo_account.rs',
                        path: 'programs/todo_contract/src/state/todo_account.rs',
                        type: 'state',
                        content: {
                            structs: [
                                {
                                    name: 'TodoAccount',
                                    type: 'struct',
                                    instruction_macro: [],
                                    struct_vars: [
                                        { name: 'owner', type: 'Pubkey', macro: '' },
                                        { name: 'todo_idx', type: 'u64', macro: '' },
                                        { name: 'content', type: 'String', macro: '' },
                                        { name: 'is_completed', type: 'bool', macro: '' },
                                        { name: 'bump', type: 'u8', macro: '' },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/state/user_stats.rs',
                        path: 'programs/todo_contract/src/state/user_stats.rs',
                        type: 'state',
                        content: {
                            structs: [
                                {
                                    name: 'UserStats',
                                    type: 'struct',
                                    instruction_macro: [],
                                    struct_vars: [
                                        { name: 'last_todo_idx', type: 'u64', macro: '' },
                                        { name: 'todo_count', type: 'u64', macro: '' },
                                        { name: 'bump', type: 'u8', macro: '' },
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/instructions/initialize_todo.rs',
                        path: 'programs/todo_contract/src/instructions/initialize_todo.rs',
                        type: 'instruction',
                        content: {
                            instructions: [
                                {
                                    name: 'initialize_todo',
                                    params: [{ name: 'content', type: 'String' }],
                                    returns: [{ type: 'Result' }],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/instructions/mark_todo_complete.rs',
                        path: 'programs/todo_contract/src/instructions/mark_todo_complete.rs',
                        type: 'instruction',
                        content: {
                            instructions: [
                                {
                                    name: 'mark_todo_complete',
                                    params: [{ name: 'todo_idx', type: 'u64' }],
                                    returns: [{ type: 'Result' }],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/instructions/update_todo.rs',
                        path: 'programs/todo_contract/src/instructions/update_todo.rs',
                        type: 'instruction',
                        content: {
                            instructions: [
                                {
                                    name: 'update_todo',
                                    params: [
                                        { name: 'todo_idx', type: 'u64' },
                                        { name: 'new_content', type: 'String' },
                                    ],
                                    returns: [{ type: 'Result' }],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/instructions/delete_todo.rs',
                        path: 'programs/todo_contract/src/instructions/delete_todo.rs',
                        type: 'instruction',
                        content: {
                            instructions: [
                                {
                                    name: 'delete_todo',
                                    params: [{ name: 'todo_idx', type: 'u64' }],
                                    returns: [{ type: 'Result' }],
                                },
                            ],
                        },
                    },
                    {
                        id: 'programs/todo_contract/src/lib.rs',
                        path: 'programs/todo_contract/src/lib.rs',
                        type: 'lib',
                        content: {
                            description:
                                'Main entry point for the todo contract, containing program declarations.',
                        },
                    },
                ],
            ]),
        },
        // template 5: vault contract
        {
            id: 'a2aba581-9376-4a7e-b872-635508e8a14f',
            title: 'Vault Contract',
            description: 'A secure Anchor-based vault program using PDA accounts.',
            category: 'defi',
            tags: ['vault', 'anchor', 'solana', 'pda', 'defi'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-5.jpg',
            summarisedObject: JSON.stringify([
                {
                    id: 'Cargo.toml',
                    path: 'Cargo.toml',
                    type: 'config_file',
                    content: {
                        name: 'Cargo.toml',
                        description: 'Workspace and build configuration for Rust projects.',
                    },
                },
                {
                    id: 'rust-toolchain.toml',
                    path: 'rust-toolchain.toml',
                    type: 'config_file',
                    content: {
                        name: 'rust-toolchain.toml',
                        description: 'Defines the Rust toolchain version and components.',
                    },
                },
                {
                    id: '.gitignore',
                    path: '.gitignore',
                    type: 'config_file',
                    content: {
                        name: '.gitignore',
                        description: 'Specifies intentionally untracked files to ignore.',
                    },
                },
                {
                    id: '.prettierignore',
                    path: '.prettierignore',
                    type: 'config_file',
                    content: {
                        name: '.prettierignore',
                        description:
                            'Specifies files and folders to ignore for Prettier formatting.',
                    },
                },
                {
                    id: 'migrations/deploy.ts',
                    path: 'migrations/deploy.ts',
                    type: 'config_file',
                    content: {
                        name: 'deploy.ts',
                        description: 'Anchor migration script for deploying the program.',
                    },
                },
                {
                    id: 'Anchor.toml',
                    path: 'Anchor.toml',
                    type: 'config_file',
                    content: {
                        name: 'Anchor.toml',
                        description:
                            'Anchor workspace configuration, including program ID and provider settings.',
                    },
                },
                {
                    id: 'package.json',
                    path: 'package.json',
                    type: 'config_file',
                    content: {
                        name: 'package.json',
                        description: 'Node.js package manifest with dependencies and scripts.',
                    },
                },
                {
                    id: 'tsconfig.json',
                    path: 'tsconfig.json',
                    type: 'config_file',
                    content: {
                        name: 'tsconfig.json',
                        description: 'TypeScript compiler configuration for the project.',
                    },
                },
                {
                    id: 'programs/vault/Cargo.toml',
                    path: 'programs/vault/Cargo.toml',
                    type: 'config_file',
                    content: {
                        name: 'Cargo.toml',
                        description: "Package configuration for the 'vault' Solana program.",
                    },
                },
                {
                    id: 'programs/vault/src/lib.rs',
                    path: 'programs/vault/src/lib.rs',
                    type: 'program_entry',
                    content: {
                        mod_name: 'vault',
                        public_key: 'Fg6PaFprADpQdcMDGM9sWb2y582V232N82222222222',
                        instructions: [
                            { name: 'initialize_vault' },
                            { name: 'deposit' },
                            { name: 'withdraw' },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/state/mod.rs',
                    path: 'programs/vault/src/state/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [{ name: 'vault' }],
                    },
                },
                {
                    id: 'programs/vault/src/state/vault.rs',
                    path: 'programs/vault/src/state/vault.rs',
                    type: 'account_struct',
                    content: {
                        structs: [
                            {
                                name: 'Vault',
                                type: 'account',
                                instruction_macro: [{ name: 'Vault', type: 'PDA' }],
                                struct_vars: [
                                    { name: 'owner', type: 'Pubkey', macro: 'pubkey' },
                                    { name: 'total_deposited_amount', type: 'u64', macro: 'u64' },
                                    { name: 'bump', type: 'u8', macro: 'u8' },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/mod.rs',
                    path: 'programs/vault/src/instructions/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [
                            { name: 'initialize_vault' },
                            { name: 'deposit' },
                            { name: 'withdraw' },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/initialize_vault.rs',
                    path: 'programs/vault/src/instructions/initialize_vault.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'initialize_vault',
                                params: [],
                                returns: [{ type: 'Result<()> ' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'InitializeVault',
                                type: 'Accounts',
                                instruction_macro: [
                                    { name: 'vault', type: "Account<'info, Vault>" },
                                    { name: 'signer', type: "Signer<'info>" },
                                    { name: 'system_program', type: "Program<'info, System>" },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/deposit.rs',
                    path: 'programs/vault/src/instructions/deposit.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'deposit',
                                params: [{ name: 'amount', type: 'u64' }],
                                returns: [{ type: 'Result<()> ' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'Deposit',
                                type: 'Accounts',
                                instruction_macro: [
                                    { name: 'vault', type: "PDA Account<'info, Vault>" },
                                    { name: 'depositor', type: "Signer<'info>" },
                                    { name: 'system_program', type: "Program<'info, System>" },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/withdraw.rs',
                    path: 'programs/vault/src/instructions/withdraw.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'withdraw',
                                params: [{ name: 'amount', type: 'u64' }],
                                returns: [{ type: 'Result<()> ' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'Withdraw',
                                type: 'Accounts',
                                instruction_macro: [
                                    { name: 'vault', type: "PDA Account<'info, Vault>" },
                                    { name: 'owner', type: "Signer<'info>" },
                                    { name: 'system_program', type: "Program<'info, System>" },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/errors/mod.rs',
                    path: 'programs/vault/src/errors/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [{ name: 'error_codes' }],
                    },
                },
                {
                    id: 'programs/vault/src/errors/error_codes.rs',
                    path: 'programs/vault/src/errors/error_codes.rs',
                    type: 'error_definition',
                    content: {
                        description: 'Custom error codes for the Vault program.',
                    },
                },
                {
                    id: 'tests/vault.ts',
                    path: 'tests/vault.ts',
                    type: 'test_file',
                    content: {
                        name: 'vault.ts',
                        description: 'Tests for the Vault program functionality.',
                    },
                },
            ]),
        },
    ];

    for (const template of templates) {
        await prisma.template.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        });
    }

    console.log('templates updated');
}
