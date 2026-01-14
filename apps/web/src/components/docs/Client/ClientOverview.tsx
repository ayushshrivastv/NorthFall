import { Button } from '../../ui/button';
import { FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import SafariBrowser from '../../ui/SafariBrowser';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DocsHeading from '../../ui/DocsHeading';
import { OverviewSubContent } from '@/src/types/docs-types';
import ClientE2BBento from './ClientE2BBento';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

const overviewPoints = [
    {
        id: OverviewSubContent.AI_CONTRACTS,
        title: 'Market Discovery',
        description: 'Browse prediction markets on early-stage startups.',
        image: '/images/demo-1.jpg',
    },
    {
        id: OverviewSubContent.SMART_EDITOR,
        title: 'Social Trading',
        description: 'Trade directly from social feeds via embedded previews.',
        image: '/images/demo-2.jpg',
    },
    {
        id: OverviewSubContent.ONE_CLICK_DEPLOYMENT,
        title: 'Signal Dashboard',
        description: 'View aggregated market data and investor rankings.',
        image: '/images/demo-3.jpg',
    },
];

export default function ClientOverview() {
    const [activeImage, setActiveImage] = useState<string | null>('/images/demo-2.jpg');
    const router = useRouter();

    return (
        <div className="w-full h-full flex flex-col gap-y-10 items-start text-left tracking-wide text-light/90 max-w-[80%] mx-auto">
            <div className="flex flex-col items-start w-full">
                <div className="grid grid-cols-[60%_40%] w-full ">
                    <div className="">
                        <div className="text-6xl text-left flex flex-col items-start justify-center">
                            <DocsHeading firstText="NorthFall" secondText="Docs" />
                        </div>

                        <div className="text-md text-light/70 tracking-wider max-w-[600px] mt-6">
                            NorthFall is a prediction market platform that turns expert insight into
                            market-driven startup discovery. Built on Kalshi's regulated infrastructure,
                            we help investors surface high-potential opportunities earlier through
                            real-time market signals from domain experts.
                        </div>
                    </div>
                    <div className="relative flex-1 w-full h-full">
                        <Image
                            src="/images/svgs/monkey.svg"
                            fill
                            unoptimized
                            alt="overview-image"
                            className="rounded-2 object-cover invert scale-125 sepia-[0.3] hue-rotate-20 saturate-[10]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-x-5 mt-6">
                    <Button size={'lg'} onClick={() => router.push(`/playground/${uuid()}`)}>
                        <span className="font-semibold">Explore Markets</span>
                    </Button>
                    <Button
                        size={'lg'}
                        className="flex items-center justify-center gap-x-2 bg-light hover:bg-light/70 text-dark"
                        onClick={() => router.push('/')}
                    >
                        <span className="font-semibold">Sign in</span>
                        <FaChevronRight strokeWidth={0.1} />
                    </Button>
                </div>

                <div className="w-full flex gap-x-5 mt-6">
                    {overviewPoints.map((overview, index) => (
                        <StartCards
                            id={overview.id}
                            key={overview.title}
                            delay={index / 10}
                            heading={overview.title}
                            description={overview.description}
                            onMouseEnter={() => setActiveImage(overview.image)}
                        />
                    ))}
                </div>
            </div>

            <SafariBrowser className="" url="northfall.dev/docs" imageSrc={activeImage!} />
            <ClientE2BBento />
        </div>
    );
}

interface StartCardsProps {
    heading: string;
    description: string;
    icon?: React.ReactElement;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    id?: string | undefined;
    delay: number;
}

function StartCards({
    heading,
    description,
    icon,
    id,
    delay = 0,
    onMouseEnter,
    onMouseLeave,
}: StartCardsProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex flex-col max-w-60 items-start gap-y-1 rounded-md border border-neutral-700 bg-dark 
                 px-3 py-2 text-left text-light/80 select-none scroll-mt-24
                 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.1)]"
        >
            <div className="flex items-center gap-x-1.5">
                {icon}
                <span className="font-semibold tracking-wide text-md">{heading}</span>
            </div>
            <p className="text-sm text-light/60 tracking-wide">{description}</p>
        </motion.section>
    );
}
