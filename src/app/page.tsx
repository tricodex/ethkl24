'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import WorldCoinAuthButton from './_components/auth-button';

const FlashlightEffect = React.memo(() => {
  const [flashPosition, setFlashPosition] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const flashPositions = [
      { x: '20%', y: '30%' },
      { x: '40%', y: '20%' },
      { x: '60%', y: '40%' },
      { x: '80%', y: '60%' },
      { x: '30%', y: '70%' },
      { x: '70%', y: '50%' },
    ];

    const flashInterval = setInterval(() => {
      const randomPosition = flashPositions[Math.floor(Math.random() * flashPositions.length)];
      setFlashPosition(randomPosition);
    }, 2000);

    return () => clearInterval(flashInterval);
  }, []);

  return (
    <div className="hero-flashlight-container">
      <Image
        src="/head-homes.webp"
        alt="HEAD bg"
        layout="fill"
        objectFit="cover"
        className="hero-image"
      />
      <div className="hero-overlay"></div>
      <div
        className="hero-flashlight-mask"
        style={{
          '--mask-position-x': flashPosition.x,
          '--mask-position-y': flashPosition.y,
        } as React.CSSProperties}
      >
        <Image
          src="/head-homes.webp"
          alt="HEAD homes overlay"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
});

FlashlightEffect.displayName = 'FlashlightEffect';

const AuthButton = React.memo(({ children }: { children: React.ReactNode }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="hero-button">{children}</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Authentication Required</AlertDialogTitle>
        <AlertDialogDescription>
          You need to be logged in to access this feature. Would you like to sign in now?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>
          <WorldCoinAuthButton />
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
));

AuthButton.displayName = 'AuthButton';

const LandingPage: React.FC = () => {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  const content = useMemo(() => (
    <>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Label htmlFor="admin-mode" className="text-white">Admin Mode</Label>
        <Switch
          id="admin-mode"
          checked={isAdmin}
          onCheckedChange={setIsAdmin}
        />
      </div>
      <div className="hero-text">
        <h2 className="hero-title">
          <span>Let&apos;s</span>
          <span className="hero-logo">
            HEAD
            <Image src="/head.svg" alt="HEAD logo" width={80} height={40} />
          </span>
        </h2>
        <h3 className="hero-subtitle">Housing Estate Association Decentralized</h3>
        <p className="hero-description">Live in a housing estate where you want to HEAD home. Blockchain-based housing estate budget management, resident finance governance, and Homy powered by ORA Onchain-AI Oracle.</p>
        <div className="flex flex-col items-center space-y-4 mt-6 w-full">
          {session ? (
            <>
              <Link href={isAdmin ? "/dash" : "/dash"} passHref legacyBehavior>
                <Button className="hero-button">My HEAD</Button>
              </Link>
              <Link href="/estate-sign-up" passHref legacyBehavior>
                <Button className="hero-button">Estate Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <AuthButton>{isAdmin ? "Admin Login" : "Login"}</AuthButton>
              <AuthButton>Sign Up Your Estate</AuthButton>
            </>
          )}
        </div>
      </div>
      
      <ul className="hero-social">
        <li>
          <Link href="https://facebook.com" passHref legacyBehavior>
            <Button variant="ghost" className="p-0" aria-label="Facebook">
              <Image src="/facebook.svg" alt="" width={30} height={30} />
            </Button>
          </Link>
        </li>
        <li>
          <Link href="https://instagram.com" passHref legacyBehavior>
            <Button variant="ghost" className="p-0" aria-label="Instagram">
              <Image src="/instagram.svg" alt="" width={30} height={30} />
            </Button>
          </Link>
        </li>
      </ul>
    </>
  ), [session, isAdmin]);

  return (
    <div className="hero-showcase">
      <FlashlightEffect />
      {content}
    </div>
  );
};

export default LandingPage;