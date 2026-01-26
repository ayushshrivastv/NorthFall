import './globals.css';
import type { Metadata } from 'next';
// Temporarily disabled - uncomment when environment variables are configured
// import { getServerSession } from 'next-auth';
// import { authOption } from './api/auth/[...nextauth]/options';
// import SessionSetter from '@/src/lib/SessionSeter';
import WalletProviders from '@/src/providers/WalletProviders';
import { Toaster } from 'sonner';
import BufferPolyfill from '@/src/components/utility/BufferPolyfill';
import { FairScaleProvider } from '@/src/features/fairscale/providers/FairScaleProvider';

export const metadata: Metadata = {
    metadataBase: new URL('https://northfall.vercel.app'),
    title: 'NorthFall | Prediction Markets for Startup Discovery',
    description:
        'NorthFall turns expert insight into market-driven startup discovery. Trade on early-stage companies through prediction markets and surface high-quality investment opportunities.',
    keywords: [
        'prediction markets',
        'startup discovery',
        'venture capital',
        'market signals',
        'Kalshi',
    ],
    openGraph: {
        title: 'NorthFall | Prediction Markets for Startup Discovery',
        description:
            'Turn expert insight into investable signal. Discover high-potential startups through prediction markets powered by domain experts.',
        url: 'https://northfall.vercel.app',
        siteName: 'NorthFall',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NorthFall | Prediction Markets for Startup Discovery',
        description:
            'Turn expert insight into investable signal. Discover high-potential startups through prediction markets powered by domain experts.',
        images: ['/og-image.png'],
    },
    other: {
        'base:app_id': '6960ceaf8a6eeb04b568d92f',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Temporarily disabled - uncomment when environment variables are configured
    // const session = await getServerSession(authOption);

    return (
        <html lang="en">
            <body className={`antialiased bg-darkest`} suppressHydrationWarning>
                <BufferPolyfill />
                <Toaster
                    theme="dark"
                    closeButton
                    visibleToasts={4}
                    toastOptions={{
                        style: {
                            background: '#121314',
                            color: '#ababab',
                            border: '1px solid #2C2C2E',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                        },
                        classNames: {
                            title: 'text-white font-semibold',
                            description: 'text-gray-300',
                            actionButton: 'bg-indigo-600 text-white hover:bg-indigo-700',
                            cancelButton: 'bg-[#121314] text-light/70 hover:bg-gray-800',
                        },
                    }}
                />
                <WalletProviders>
                    <FairScaleProvider>{children}</FairScaleProvider>
                </WalletProviders>
                {/* Temporarily disabled - uncomment when environment variables are configured */}
                {/* <SessionSetter session={session} /> */}
            </body>
        </html>
    );
}
