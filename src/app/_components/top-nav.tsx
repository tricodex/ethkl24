// src/app/_components/top-nav.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import WorldCoinAuthButton from './auth-button';
import { WalletConnect } from '@/components/WalletConnect';

function TopNav() {
    const { data: session } = useSession();



    return (
        <nav className="flex justify-between items-center px-2 py-3 bg-gradient-to-r from-[#101010] to-[#15162c] text-white">
            <div className="flex space-x-4">
                <Link href="/" className="text-xl font-bold flex items-center gap-1">
                    <span className='logo-text'>HEAD</span>
                    <span>
                        <Image src="/head.svg" alt="HEAD logo" width={34} height={34} />
                    </span>
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                {session && <WalletConnect />}
                <WorldCoinAuthButton />
            </div>
        </nav>
    );
}

export default TopNav;