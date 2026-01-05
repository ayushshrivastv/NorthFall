const helpResponse = `
WINTER COMMANDS:
clear              Clear the terminal
--help             Show available commands
--commands         Show northfall commands
--platform         Show platform details
--hotkeys          Show hot keys/ shortcuts
`;

const hotKeysResponse = `
HOT KEYS:
Ctrl + Shift + ~           Switch Terminal Tabs
Ctrl + Shift + d           Toggle shell
`;

const platformResponse = `
PLATFORM DETAILS:
portal              Northfall
version             1.0.0
shell               winter
`;

const commandsResponse = `
SHELL COMMANDS:
winter build                to build the contract
winter test                 to run the test file


PREMIUM(+) SHELL COMMANDS:
winter deploy --devnet      to deploy the contract on devnet
winter deploy --mainnet     to deploy the contract on mainnet
`;

// instead of using winter deploy cmds like this use them like this
// winter deploy --network devnet
// winter deploy --network mainnet
// winter deploy --network <custom-network>

// const northfallBuildResponse = ``;

export enum COMMAND_WRITER {
    CLEAR = 'clear',
    HELP = '--help',
    HOT_KEYS = '--hotkeys',
    PLATFORM = '--platform',
    COMMANDS = '--commands',
    NORTHFALL_BUILD = 'winter build',
    NORTHFALL_TEST = 'winter test',
    NORTHFALL_DEPLOY_DEVNET = 'winter deploy --devnet',
    NORTHFALL_DEPLOY_MAINNET = 'winter deploy --mainnet',
}

export const CommandResponse: Record<COMMAND_WRITER, string> = {
    [COMMAND_WRITER.CLEAR]: '',
    [COMMAND_WRITER.HELP]: helpResponse,
    [COMMAND_WRITER.HOT_KEYS]: hotKeysResponse,
    [COMMAND_WRITER.PLATFORM]: platformResponse,
    [COMMAND_WRITER.COMMANDS]: commandsResponse,
    [COMMAND_WRITER.NORTHFALL_BUILD]: `this feature is forging in the Northfall labs, arriving in an upcoming release...`,
    [COMMAND_WRITER.NORTHFALL_TEST]: `this feature is forging in the Northfall labs, arriving in an upcoming release...`,
    [COMMAND_WRITER.NORTHFALL_DEPLOY_DEVNET]: `this feature is forging in the Northfall labs, arriving in an upcoming release...`,
    [COMMAND_WRITER.NORTHFALL_DEPLOY_MAINNET]: `this feature is forging in the Northfall labs, arriving in an upcoming release...`,
};
