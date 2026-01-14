'use client';
import { ForwardedRef, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import City from './City';
import ActionTickers from '../tickers/ActionTickers';
import DashboardTextAreaComponent from './DashboardTextAreaComponent';
import HighlighterTicker from '../tickers/HighlighterTicker';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import Marketplace from '@/src/lib/server/marketplace-server';

interface HeroProps {
    inputRef: ForwardedRef<HTMLTextAreaElement>;
}

export default function Hero({ inputRef }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const controls = useAnimation();
    const router = useRouter();
    const { setTemplates } = useTemplateStore();

    useEffect(() => {
        const get_templates = async () => {
            const response = await Marketplace.getTemplates();
            setTemplates(response);
        };
        get_templates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const { scrollY } = useScroll();
    const fadeOpacity = useTransform(scrollY, [0, 800], [0, 1]);

    return (
        <motion.div className="flex-1 flex justify-center items-center px-4 sticky top-0 md:top-0 z-0">
            <motion.div
                className="absolute inset-0 bg-black pointer-events-none z-30"
                style={{ opacity: fadeOpacity }}
            />
            <City className="absolute inset-0 z-0" />

            <main
                ref={heroRef}
                className="relative flex flex-col justify-center items-center h-screen w-full overflow-visible"
            >
                <motion.div
                    className="relative z-10 w-full max-w-2xl"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.8 } },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-3"
                    >
                        <h1 className="text-[28px] md:text-[60px] font-bold leading-tight bg-gradient-to-t flex flex-col from-neutral-700 via-neutral-300 to-neutral-200 bg-clip-text text-transparent">
                            <span>Operators Know Things</span>
                            <span>Before Investors Do</span>
                        </h1>
                    </motion.div>

                    <HighlighterTicker />
                    <DashboardTextAreaComponent inputRef={inputRef} />
                    <ActionTickers />
                </motion.div>

                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-[10px] md:text-[16px] z-20 max-w-[90%] md:max-w-md">
                    <div className="flex flex-col justify-start items-start text-light font-semibold bg-black/30 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-white/10">
                        <span className="text-xs md:text-sm">Powered by Kalshi Prediction Markets</span>
                        <span className="text-[10px] md:text-xs font-normal text-light/80 mt-1">Turn Expert Insight into Investable Signal</span>
                        <div className="flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-2 mt-3">
                            <Button className="font-semibold text-[10px] md:text-sm !px-3 md:!px-4 !py-1.5 md:!py-2 rounded-[4px]">
                                Explore Markets
                                <RiCodeSSlashFill className="ml-1" />
                            </Button>
                            <span
                                onClick={() => router.push('/docs')}
                                className="font-light text-primary tracking-wide text-[10px] md:text-xs border-b border-primary py-1 cursor-pointer hover:text-primary/80 transition-colors"
                            >
                                Read Our Docs
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
