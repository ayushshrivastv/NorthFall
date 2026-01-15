import { ClientDocsPanel } from '@/src/types/docs-types';
import ClientGettingStarted from './ClientGettingStarted';
import ClientOverview from './ClientOverview';
import ClientE2B from './ClientE2B';
import ClientDocsExporting from './ClientDocsExporting';
import ClientDocsDeployments from './ClientDocsDeployments';
import ClientDocsNorthShell from './ClientDocsNorthShell';
import ClientLazorKit from './ClientLazorKit';

interface ClientDocsPanelRendererProps {
    clientPanel: ClientDocsPanel;
}

export default function ClientDocsPanelRenderer({ clientPanel }: ClientDocsPanelRendererProps) {
    function renderPanels() {
        switch (clientPanel) {
            case ClientDocsPanel.OVERVIEW:
                return <ClientOverview />;
            case ClientDocsPanel.GETTING_STARTED:
                return <ClientGettingStarted />;
            case ClientDocsPanel.SANDBOX:
                return <ClientE2B />;
            case ClientDocsPanel.NORTH_SHELL:
                return <ClientDocsNorthShell />;
            case ClientDocsPanel.EXPORTING:
                return <ClientDocsExporting />;
            case ClientDocsPanel.DEPLOYMENT:
                return <ClientDocsDeployments />;
            case ClientDocsPanel.LAZORKIT:
                return <ClientLazorKit />;
        }
    }

    return <>{renderPanels()}</>;
}
