'use client';

import Link from 'next/link';
import Image from 'next/image';
import WorldCoinAuthButton from './auth-button';



function TopNav() {
    return (
        <nav className="flex justify-between items-center px-2 py-3 bg-gradient-to-r from-[#101010] to-[#15162c] text-white">
            <div className="flex space-x-4">
            <Link href="/" className="text-xl font-bold flex items-center gap-1">
            <span className='logo-text'>HEAD</span>
                    <span>          <Image src="/head.svg" alt="HEAD logo" width={34} height={34} />
                    </span></Link>
                
            </div>
            <div className="flex items-center">
                <WorldCoinAuthButton />
            </div>
        </nav>
    );
}

export default TopNav;
