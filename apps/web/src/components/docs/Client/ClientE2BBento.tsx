import React from 'react';
import {
    RiShieldFill,
    RiFlightLandFill,
    RiCodeSSlashFill,
    RiTerminalBoxFill,
    RiBox3Fill,
    RiRocketFill,
} from 'react-icons/ri';
import { IconType } from 'react-icons';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    accent: string;
    span: string;
    delay: number;
}

interface BentoCardProps {
    feature: Feature;
    index: number;
}

const features: Feature[] = [
    {
        id: 'secure',
        title: 'Kalshi Integration',
        description:
            'Built on Kalshi\'s regulated prediction market infrastructure. All market creation, trading, and settlement powered by Kalshi\'s APIs.',
        icon: RiShieldFill,
        accent: '#E50914',
        span: 'col-span-2 row-span-2',
        delay: 0.1,
    },
    {
        id: 'instant',
        title: 'Real-time Signals',
        description: 'Watch market prices update live. Programmatically aggregated data from expert trades.',
        icon: RiFlightLandFill,
        accent: '#ff4757',
        span: 'col-span-2 row-span-1',
        delay: 0.2,
    },
    {
        id: 'anchor',
        title: 'Social Trading',
        description:
            'Embedded link previews inspired by Solana blinks. Trade on startups directly from your social feed.',
        icon: RiCodeSSlashFill,
        accent: '#1c1d20',
        span: 'col-span-2 row-span-1',
        delay: 0.3,
    },
    {
        id: 'terminal',
        title: 'Market Dashboard',
        description:
            'View aggregated positions, prices, and rankings—everything you need to spot opportunities.',
        icon: RiTerminalBoxFill,
        accent: '#E50914',
        span: 'col-span-1 row-span-1',
        delay: 0.4,
    },
    {
        id: 'deps',
        title: 'Expert Insight',
        description: 'Domain experts, operators, and builders putting economic weight behind their views.',
        icon: RiBox3Fill,
        accent: '#ff4757',
        span: 'col-span-1 row-span-1',
        delay: 0.5,
    },
    {
        id: 'deploy',
        title: 'Objective Outcomes',
        description: 'Markets tied to verifiable milestones. Funding rounds, revenue targets, product launches.',
        icon: RiRocketFill,
        accent: '#E50914',
        span: 'col-span-2 row-span-1',
        delay: 0.6,
    },
];

function BentoCard({ feature }: BentoCardProps) {
    const Icon = feature.icon;
    const isLarge = feature.span.includes('row-span-2');
    const isDark = feature.accent === '#1c1d20';

    return (
        <div className={`${feature.span} group`}>
            <div
                className="h-full rounded-[4px] p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                style={{
                    backgroundColor: isDark ? feature.accent : '#fdf9f0',
                    border: isDark ? 'none' : '1px solid rgba(229, 9, 20, 0.1)',
                }}
            >
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at top right, ${feature.accent}15, transparent 70%)`,
                    }}
                />

                <div className="relative z-10 h-full flex flex-col">
                    <div
                        className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: isDark
                                ? 'rgba(255, 71, 87, 0.15)'
                                : 'rgba(229, 9, 20, 0.08)',
                        }}
                    >
                        <Icon size={24} style={{ color: isDark ? '#ff4757' : feature.accent }} />
                    </div>

                    <div className="flex-1 text-left">
                        <h3
                            className={`font-semibold mb-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}
                            style={{ color: isDark ? '#fdf9f0' : '#1c1d20' }}
                        >
                            {feature.title}
                        </h3>
                        <p
                            className={`leading-relaxed ${isLarge ? 'text-[15px]' : 'text-[14px]'}`}
                            style={{
                                color: isDark ? 'rgba(253, 249, 240, 0.75)' : '#141517',
                                opacity: isDark ? 1 : 0.8,
                            }}
                        >
                            {feature.description}
                        </p>
                    </div>

                    {isLarge && (
                        <div
                            className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: isDark ? '#ff4757' : feature.accent }}
                        >
                            <span>Explore</span>
                            <span className="group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ClientE2BBento() {
    return (
        <div className="w-full rounded-[4px]">
            <div className="mb-4 text-left bg-primary p-6 rounded-[4px]">
                <h2 className="text-5xl font-bold mb-4 tracking-tight">NorthFall Platform</h2>
                <p className="text-lg max-w-2xl">
                    A prediction market platform built for startup discovery. Browse markets, trade on outcomes, and surface high-potential opportunities through expert signals.
                </p>
            </div>

            <div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
                {features.map((feature, index) => (
                    <BentoCard key={feature.id} feature={feature} index={index} />
                ))}
            </div>
        </div>
    );
}
