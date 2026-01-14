import { Highlighter } from '@/src/components/ui/highlighter';

export default function HighlighterTicker() {
    return (
        <div className="text-[10px] md:text-[14px] text-neutral-400 font-normal tracking-wide mb-4">
            NorthFall eats{' '}
            <span className="text-white">
                <Highlighter action="highlight" padding={5} iterations={1} color="#E50914">
                    information asymmetry
                </Highlighter>
            </span>{' '}
            for breakfast
        </div>
    );
}
