import { FairScaleDocsSection } from '@/src/types/fairscale-docs-types';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import AppLogo from '../tickers/AppLogo';
import { Input } from '../ui/input';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { useFairScaleDocsStore } from '@/src/store/fairscale-docs/useFairScaleDocsStore';
import { IoMdArrowForward } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import FairScaleModal from '@/src/features/fairscale/components/FairScaleModal';
import {
    HiOutlineInformationCircle,
    HiOutlineRocketLaunch,
    HiOutlineCog6Tooth,
    HiOutlineChartBar,
    HiOutlineLockClosed,
    HiOutlineCodeBracket,
    HiOutlineTrophy,
    HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

interface ClientFairScaleSidebarProps {
    switchSection: (index: number, section: FairScaleDocsSection) => void;
}

const sidebarSections = [
    { title: 'Overview', type: FairScaleDocsSection.OVERVIEW, icon: HiOutlineInformationCircle },
    { title: 'Integration', type: FairScaleDocsSection.INTEGRATION, icon: HiOutlineRocketLaunch },
    { title: 'Configuration', type: FairScaleDocsSection.CONFIGURATION, icon: HiOutlineCog6Tooth },
    { title: 'Reputation Scoring', type: FairScaleDocsSection.REPUTATION_SCORING, icon: HiOutlineChartBar },
    {
        title: 'Market Gating',
        type: FairScaleDocsSection.MARKET_GATING,
        icon: HiOutlineLockClosed,
    },
    {
        title: 'Tiers & Rewards',
        type: FairScaleDocsSection.TIERS_AND_REWARDS,
        icon: HiOutlineTrophy,
    },
    { title: 'API Reference', type: FairScaleDocsSection.API_REFERENCE, icon: HiOutlineCodeBracket },
    {
        title: 'Troubleshooting',
        type: FairScaleDocsSection.TROUBLESHOOTING,
        icon: HiOutlineWrenchScrewdriver,
    },
];

export default function ClientFairScaleSidebar({ switchSection }: ClientFairScaleSidebarProps) {
    const [_activeIndex, setActiveIndex] = useState<number>(0);
    const { activeSection, setActiveSection } = useFairScaleDocsStore();
    const router = useRouter();
    const [isFairScaleOpen, setIsFairScaleOpen] = useState(false);

    function handleSectionSwitch(index: number, section: FairScaleDocsSection): void {
        setActiveIndex(index);
        setActiveSection(section);
        switchSection(index, section);
    }

    return (
        <div className="min-h-screen z-50 bg-dark border-l border-neutral-800 fixed top-0 left-0 w-[20vw] flex flex-col justify-between">
            <div className="px-8 py-6">
                <div className="relative">
                    <AppLogo />
                </div>
                <div className="relative mt-4">
                    <HiMiniMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-light/70" />
                    <Input
                        className="border border-neutral-800 bg-darkest/60 py-4.5 pl-9  focus:border-transparent focus:ring-0 focus:outline-none"
                        placeholder="Search..."
                    />
                </div>
                <div className="flex flex-col gap-y-1 text-left tracking-wide text-light/70 mt-8 w-full relative">
                    {sidebarSections.map((section, index) => {
                        const isActive = activeSection === section.type;
                        const Icon = section.icon;

                        return (
                            <div
                                onClick={() => handleSectionSwitch(index, section.type)}
                                className={cn(
                                    isActive && 'bg-black/20',
                                    'px-4 py-2.5 rounded-lg w-full cursor-pointer relative',
                                )}
                                key={section.type}
                            >
                                {isActive && (
                                    <div className="absolute h-3 w-0.5 flex top-3 left-0 rounded-full bg-[#9945FF] shadow-[0_1px_8px_2px_rgba(153,69,255,0.8)] transition-all duration-500 ease-out" />
                                )}

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        {Icon && (
                                            <Icon
                                                className={cn(
                                                    'transition-colors duration-300',
                                                    isActive ? 'text-[#9945FF]' : 'text-white/50',
                                                )}
                                                size={16}
                                            />
                                        )}
                                        <span
                                            className={`tracking-wider select-none relative transition-colors duration-300 text-[13px] text-light
                                            ${isActive ? 'text-[#9945FF]' : 'hover:text-light'}
                                        `}
                                        >
                                            {section.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3 space-y-1.5">
                <button
                    type="button"
                    className="flex items-center gap-x-2 cursor-pointer group"
                    onClick={() => setIsFairScaleOpen(true)}
                >
                    <span className="text-light group-hover:text-[#9945FF] transition-colors">
                        Try FairScale Demo
                    </span>
                    <IoMdArrowForward className="-rotate-45 text-[#9945FF]" />
                </button>

                <div className="text-[13px] text-light/40 leading-none text-left">
                    northfall.vercel.app
                </div>
            </div>

            <FairScaleModal isOpen={isFairScaleOpen} setIsOpen={setIsFairScaleOpen} />
        </div>
    );
}
