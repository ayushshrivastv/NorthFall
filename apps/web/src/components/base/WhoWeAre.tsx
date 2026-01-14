'use client';

import React from 'react';
import ArchitectureTitleComponent from './ArchitectureTitleComponent';
import FeatureOne from './FeatureOne';
import DonutComponent from '../ui/DonutComponent';

const productMetaOptions = [
    {
        title: 'Market Discovery',
        subtitle: 'Browse prediction markets',
        description:
            'Explore prediction markets tied to early-stage startups with objective, time-bound outcomes. See what domain experts are trading on and where the strongest signals are emerging across different sectors and stages.',
    },
    {
        title: 'Social Trading',
        subtitle: 'Trade from your feed',
        description:
            'Participate in markets directly from social feeds through embedded link previews inspired by Solana blinks. When you see a startup discussion, trade on it instantly without leaving the conversation—turning social attention into economic signal.',
    },
    {
        title: 'Signal Dashboard',
        subtitle: 'Market-driven rankings',
        description:
            'View aggregated market positions and prices programmatically pulled via Kalshi\'s APIs. Get clear, investor-ready rankings that surface high-potential opportunities earlier, powered by real economic weight from domain experts.',
    },
];

export default function WhoWeAre() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <ArchitectureTitleComponent firstText="NORTHFALL's" secondText="MARKET FLOW" />
            <section ref={containerRef} className="bg-[#0a0c0d] w-screen">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="h-screen hidden md:sticky top-0 md:flex items-center justify-center bg-[#0a0c0d]">
                        <DonutComponent />
                    </div>

                    <div className="min-h-[300vh] flex flex-col justify-between z-10 bg-[#0a0c0d]">
                        {productMetaOptions.map((option, index) => (
                            <FeatureOne
                                key={index}
                                title={option.title}
                                subTitle={option.subtitle}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
