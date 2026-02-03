'use client';
import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';
import Faq from '@/src/components/base/Faq';
import ReviewsSection from '@/src/components/utility/ReviewsSection';
import { useRef } from 'react';

export default function Page() {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative select-none">
                <Navbar />
                <Hero inputRef={inputRef} />
                <Features />
                <WhoWeAre />
                <ReviewsSection />
                <Faq />
                <Footer />
            </div>
        </LenisProvider>
    );
}
