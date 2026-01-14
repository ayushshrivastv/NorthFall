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

                    {/* Kalshi API Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                        className="mb-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/30 backdrop-blur-md shadow-lg shadow-primary/10"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs text-light/60 font-medium tracking-wider uppercase">
                                    Powered by
                                </span>
                                <span className="text-sm md:text-base font-bold text-light tracking-wide">
                                    Kalshi API
                                </span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />
                        <span className="text-xs text-light/70 font-medium hidden md:block">
                            Regulated Prediction Markets
                        </span>
                    </motion.div>

                    <DashboardTextAreaComponent inputRef={inputRef} />
                    <ActionTickers />
                </motion.div>

                <div className="absolute bottom-2 left-0 md:bottom-12 md:left-10 text-[10px] md:text-[18px]">
                    <div className="md:max-w-2xl max-w-sm flex flex-col justify-start items-start text-light font-semibold">
                        <span>Powered by Kalshi Prediction Markets</span>
                        <span className="">Turn Expert Insight into Investable Signal</span>
                        <div className="flex items-end justify-center gap-x-2 md:gap-x-3 mt-2">
                            <Button className="font-semibold text-xs md:text-base !px-4 md:!px-6 rounded-[4px]">
                                Explore Markets
                                <RiCodeSSlashFill />
                            </Button>
                            <span
                                onClick={() => router.push('/docs')}
                                className="font-light text-primary tracking-wide md:text-xs border-b border-primary py-1 cursor-pointer"
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
