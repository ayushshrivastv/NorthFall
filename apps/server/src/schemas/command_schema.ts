import { COMMAND } from '@northfall/types';
import z from 'zod';

export const command_schema = z.enum([
    COMMAND.NORTHFALL_BUILD,
    COMMAND.NORTHFALL_TEST,
    COMMAND.NORTHFALL_DEPLOY_DEVNET,
    COMMAND.NORTHFALL_DEPLOY_MAINNET,
]);
