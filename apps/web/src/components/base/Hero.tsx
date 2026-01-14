'use client';
import { ForwardedRef, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import City from './City';
import HighlighterTicker from '../tickers/HighlighterTicker';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Marketplace from '@/src/lib/server/marketplace-server';
import LoginModal from '../utility/LoginModal';

interface HeroProps {
    inputRef: ForwardedRef<HTMLTextAreaElement>;
}

export default function Hero({ inputRef }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const controls = useAnimation();
    const router = useRouter();
    const { setTemplates } = useTemplateStore();
    const { session } = useUserSessionStore();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

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

                    {/* Get for Mac Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="mt-8 flex flex-col items-center gap-4"
                    >
                        <Button
                            onClick={() => {
                                if (!session?.user.id) {
                                    setOpenLoginModal(true);
                                } else {
                                    router.push('/home');
                                }
                            }}
                            className="group relative px-8 py-6 text-lg font-semibold rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-primary/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-3 text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                Get for Mac
                            </span>
                        </Button>
                        <p className="text-xs text-neutral-400">
                            Available for macOS 11.0 or later
                        </p>
                    </motion.div>

                    {/* Powered by Kalshi */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-400"
                    >
                        <span className="font-light">Powered by</span>
                        <span className="font-semibold text-primary">Kalshi</span>
                    </motion.div>
                </motion.div>

                <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />

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
