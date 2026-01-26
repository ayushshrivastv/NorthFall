import { cn } from '@/src/lib/utils';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface OpacityBackgroundProps {
    children: React.ReactNode;
    className?: string;
    onBackgroundClick?: () => void;
}

export default function OpacityBackground({
    children,
    className,
    onBackgroundClick,
}: OpacityBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Prevent background scroll with overflow hidden (works with touchpad)
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Prevent wheel events on the background (for touchpad)
        const preventScroll = (e: WheelEvent | TouchEvent) => {
            // Only prevent if the event is on the background, not inside modal content
            const target = e.target as HTMLElement;
            const modalContent = document.querySelector('.modal-scroll-container');

            if (modalContent && !modalContent.contains(target)) {
                e.preventDefault();
            }
        };

        // Add passive: false to allow preventDefault
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            setMounted(false);
            // Restore original overflow
            document.body.style.overflow = originalOverflow;
            // Remove event listeners
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onBackgroundClick) {
            onBackgroundClick();
        }
    };

    const backgroundElement = (
        <div
            className={cn(
                'fixed w-screen h-screen inset-0 flex items-center justify-center z-10 bg-dark/70',
                className,
            )}
            onClick={handleBackgroundClick}
        >
            {children}
        </div>
    );

    if (!mounted) return null;
    return createPortal(backgroundElement, document.body);
}
