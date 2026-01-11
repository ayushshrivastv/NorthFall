import {
    ClientDocsPanel,
    DeploymentSubContent,
    ExportingSubContent,
    GettingStartedSubContent,
    OverviewSubContent,
    SandboxSubContent,
    NorthShellSubContent,
} from '../types/docs-types';
import { IconType } from 'react-icons';
import {
    HiOutlineInformationCircle,
    HiOutlineRocketLaunch,
    HiOutlineBeaker,
    HiOutlineCog6Tooth,
    HiOutlineCodeBracket,
    HiOutlinePencilSquare,
    HiOutlineCloudArrowUp,
    HiOutlineArrowDownTray,
} from 'react-icons/hi2';

export interface SidebarContent {
    title: string;
    type: ClientDocsPanel;
    subSections?: {
        id: string;
        label: string;
    }[];
    icon?: IconType;
    children?: SidebarContent[];
}

export const contents: SidebarContent[] = [
    {
        title: 'Overview',
        type: ClientDocsPanel.OVERVIEW,
        subSections: [
            { id: OverviewSubContent.AI_CONTRACTS, label: 'AI Contracts' },
            { id: OverviewSubContent.SMART_EDITOR, label: 'Smart Editor' },
            { id: OverviewSubContent.ONE_CLICK_DEPLOYMENT, label: 'One Click Deployment' },
        ],
        icon: HiOutlineInformationCircle,
    },
    {
        title: 'Getting Started',
        type: ClientDocsPanel.GETTING_STARTED,
        subSections: [
            { id: GettingStartedSubContent.CREATE_ACCOUNT, label: 'Create Account' },
            { id: GettingStartedSubContent.FIRST_PROMPT, label: 'Your first contract' },
            { id: GettingStartedSubContent.PLAYGROUND_OVERVIEW, label: 'Playground Workspace' },
            { id: GettingStartedSubContent.UPDATE_CONTRACT, label: 'Update contract' },
            { id: GettingStartedSubContent.NORTH_SHELL, label: 'Run commands' },
            { id: GettingStartedSubContent.EXPORT_CONTRACT, label: 'Export contract' },
        ],
        icon: HiOutlineRocketLaunch,
    },
    {
        title: 'Sandbox env',
        type: ClientDocsPanel.SANDBOX,
        icon: HiOutlineBeaker,
        subSections: [
            { id: SandboxSubContent.OVERVIEW, label: 'Overview' },
            { id: SandboxSubContent.FEATURES, label: 'Features' },
            { id: SandboxSubContent.SECURITY, label: 'Security' },
            { id: SandboxSubContent.DEPLOY, label: 'Deploy' },
        ],
        children: [
            {
                title: 'Introduction',
                type: ClientDocsPanel.SANDBOX_INTRO,
                icon: HiOutlineInformationCircle,
            },
            {
                title: 'Configuration',
                type: ClientDocsPanel.SANDBOX_CONFIGURATION,
                icon: HiOutlineCog6Tooth,
            },
            {
                title: 'Usage Examples',
                type: ClientDocsPanel.SANDBOX_USAGE,
                icon: HiOutlineCodeBracket,
            },
        ],
    },
    {
        title: 'NorthFall Terminal',
        type: ClientDocsPanel.NORTH_SHELL,
        subSections: [
            { id: NorthShellSubContent.NORTH_SHELL_INFO, label: 'North Shell info' },
            { id: NorthShellSubContent.TEST_CONTRACT, label: 'Test contract' },
            { id: NorthShellSubContent.BUILD_CONTRACT, label: 'Build Contract' },
            { id: NorthShellSubContent.DEPLOY_CONTRACT, label: 'Deploy contract' },
        ],
        icon: HiOutlinePencilSquare,
    },
    {
        title: 'Deployment',
        type: ClientDocsPanel.DEPLOYMENT,
        subSections: [
            { id: DeploymentSubContent.DEPLOYMENT_INFO, label: 'Deployment Info' },
            { id: DeploymentSubContent.DEPLOYMENT_REQUIREMENTS, label: 'Deployment Requirements' },
            { id: DeploymentSubContent.DEPLOYMENT_NETWORKS, label: 'Deployment Networks' },
        ],
        icon: HiOutlineCloudArrowUp,
    },
    {
        title: 'Exporting',
        type: ClientDocsPanel.EXPORTING,
        subSections: [
            { id: ExportingSubContent.EXPORTING_INFO, label: 'Export Info' },
            { id: ExportingSubContent.EXPORTING_OPTIONS, label: 'Export Options' },
            { id: ExportingSubContent.EXPORT_REQUIREMENTS, label: 'Export Requirements' },
            { id: ExportingSubContent.CONNECT_GITHUB, label: 'Export with GitHub' },
        ],
        icon: HiOutlineArrowDownTray,
    },
];
