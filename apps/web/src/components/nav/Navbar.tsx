'use client';
import { LiaServicestack } from 'react-icons/lia';
import { IoIosCreate } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import NavbarSigninAction from './NavSigninAction';
import { cn } from '@/src/lib/utils';
import { v4 as uuid } from 'uuid';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useEffect, useState } from 'react';
import LoginModal from '../utility/LoginModal';
import { MdHomeFilled } from 'react-icons/md';
import AppLogo from '../tickers/AppLogo';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import LazorKitDemoModal from '@/src/features/lazorkit-demo/components/LazorKitDemoModal';

const navItems = [
    { name: 'Features', link: '#feature' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'Faq', link: '#faq' },
    { name: 'About', link: '#about' },
    { name: 'LazorKit', link: '#lazorkit-demo', isDemo: true },
];

export default function Navbar() {
    const router = useRouter();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [openLazorKitDemo, setOpenLazorKitDemo] = useState<boolean>(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const { session } = useUserSessionStore();

    function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        const newContractId = uuid();
        router.push(`/playground/${newContractId}`);
    }

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                // Scrolling up - show navbar
                setIsNavbarVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar (only after 100px)
                setIsNavbarVisible(false);
            }

            setLastScrollY(currentScrollY);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <div
                className={cn(
                    'fixed w-full z-[100] flex items-center justify-between px-3 md:px-6 top-4 transition-all duration-500 ease-in-out',
                    isNavbarVisible
                        ? 'translate-y-0'
                        : '-translate-y-[calc(100%+2rem)] pointer-events-none',
                )}
            >
                <AppLogo size={30} />
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500">
                    <Tabs defaultValue="features" className="w-auto">
                        <TabsList className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 no-visible-scrollbar">
                            {navItems.map((item) => (
                                <TabsTrigger
                                    key={item.name}
                                    value={item.name.toLowerCase()}
                                    onClick={() => {
                                        if (item.isDemo) {
                                            setOpenLazorKitDemo(true);
                                        } else {
                                            const element = document.querySelector(item.link);
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white text-light/70 hover:text-light transition-colors"
                                >
                                    {item.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex items-center gap-x-4">
                    <MdHomeFilled
                        onClick={() => {
                            if (!session?.user.token) {
                                setOpenLoginModal(true);
                                return;
                            }
                            router.push('/home');
                        }}
                        className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                    />
                    <IoIosCreate
                        onClick={handleSubmit}
                        className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5"
                    />
                    <NavbarSigninAction />
                </div>
            </div>
            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
            <LazorKitDemoModal isOpen={openLazorKitDemo} setIsOpen={setOpenLazorKitDemo} />
        </>
    );
}
