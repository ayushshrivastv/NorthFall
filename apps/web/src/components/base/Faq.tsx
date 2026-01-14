'use client';
import { cn } from '@/src/lib/utils';
import { useState, useRef, memo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { doto } from './FeatureOne';
import { motion, useInView } from 'framer-motion';
import { Button } from '../ui/button';
import { FaLinkedin } from 'react-icons/fa';

/* eslint-disable react/prop-types */
interface FaqData {
    question: string;
    answer: string;
}

interface FaqItemProps {
    faq: FaqData;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

const FaqItem = memo<FaqItemProps>(({ faq, index, isOpen, onToggle }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                'overflow-hidden transition-all duration-300',
                index <= 5 ? 'border-b border-neutral-300' : '',
            )}
        >
            <div
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer hover:opacity-80"
            >
                <span className="text-lg font-semibold text-[#141517] pr-4 hover:text-[#14151795] transition-colors">
                    {faq.question}
                </span>
                <AiOutlinePlus
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''
                        }`}
                />
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <div className="pb-6 pt-1">
                    <p className="text-darkest/70 leading-relaxed text-left">{faq.answer}</p>
                </div>
            </div>
        </motion.div>
    );
});

FaqItem.displayName = 'FaqItem';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FaqData[] = [
        {
            question: 'What is NorthFall?',
            answer: 'NorthFall is a prediction market platform that helps investors discover high-potential startups earlier. We turn expert insight into market-driven signals by letting domain experts trade on early-stage companies through Kalshi-powered prediction markets.',
        },
        {
            question: 'How do prediction markets help find startups?',
            answer: 'Prediction markets let people with real domain knowledge put economic weight behind their views on startup outcomes. Market prices aggregate these positions into clear signals that surface stronger opportunities earlier than traditional sourcing methods.',
        },
        {
            question: 'What is Kalshi integration?',
            answer: 'NorthFall is built on Kalshi\'s regulated prediction market infrastructure and APIs. We programmatically create markets, pull trading data, and aggregate positions to generate investor-ready rankings—all powered by Kalshi\'s platform.',
        },
        {
            question: 'Who can participate in markets?',
            answer: 'Anyone with domain expertise—operators, builders, investors, or industry insiders—can participate. If you have on-the-ground insight about startups, sectors, or trends, you can trade on objective outcomes and contribute to market signals.',
        },
        {
            question: 'How are outcomes determined?',
            answer: 'Markets are tied to objective, time-bound outcomes like funding milestones, revenue targets, or product launches. These outcomes are verifiable and resolve based on publicly available information or official announcements.',
        },
        {
            question: 'What makes this different from traditional VC sourcing?',
            answer: 'Traditional sourcing relies on manual scouting and personal networks. NorthFall captures real-time expert insight through economic signals, making high-quality knowledge visible, scalable, and properly rewarded—similar to how prediction markets surface information in other domains.',
        },
        {
            question: 'How do social trading links work?',
            answer: 'Inspired by Solana blinks, we embed markets directly into social feeds via link previews. When you see a startup discussion on Twitter or elsewhere, you can trade on it instantly without leaving the feed—turning social attention into economic signal.',
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq"
            className="relative min-h-screen bg-light px-6 md:px-12 lg:px-20 py-16 lg:py-20 z-10"
        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        radial-gradient(circle, rgb(108, 68, 252) 2px, transparent 2px)
      `,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0',
                }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="flex flex-col items-start justify-start gap-8 lg:gap-12">
                        <h1
                            className={cn(
                                'text-6xl lg:text-[12rem] font-black text-darkest leading-tight text-left bg-light z-10 select-none',
                                doto.className,
                            )}
                        >
                            FAQs
                        </h1>
                        <div className="absolute bottom-2 left-0 md:bottom-12 md:left-10 text-[10px] md:text-[18px] z-10 bg-light p-3">
                            <div className="md:max-w-2xl max-w-sm flex flex-col justify-start items-start text-dark text-md font-normal">
                                <span>Want to connect?</span>
                                <span>Let&apos;s connect on LinkedIn.</span>
                                <div className="flex items-end justify-center gap-x-2 md:gap-x-3 mt-2">
                                    <Button
                                        onClick={() =>
                                            window.open(
                                                'https://www.linkedin.com/in/ayushshrivastv/',
                                                '_blank',
                                            )
                                        }
                                        className="font-semibold text-xs md:text-base !px-4 md:!px-6 rounded-[4px]"
                                    >
                                        <FaLinkedin className="mr-2" />
                                        LinkedIn
                                    </Button>
                                    <span className="font-light text-primary tracking-wide md:text-xs border-b border-primary py-1 cursor-pointer">
                                        Stay in the loop
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 bg-light z-10 py-6 px-6">
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                onToggle={() => toggleFaq(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
