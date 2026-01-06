import { cn } from '@/src/lib/utils';
import { LiaServicestack } from 'react-icons/lia';
import { doto } from '../base/FeatureOne';

interface AppLogoProps {
    className?: string;
    size?: number;
    showLogoText?: boolean;
}

export default function AppLogo({ className, size = 20, showLogoText = true }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-x-2', doto.className, className)}>
            <LiaServicestack size={size} className="text-primary transition-all duration-500" />
            {showLogoText && <span className="tracking-[0.1rem] font-black">NORTHFALL</span>}
        </div>
    );
}
