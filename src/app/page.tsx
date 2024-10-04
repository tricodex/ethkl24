'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const LandingPage: React.FC = () => {
  const [flashPosition, setFlashPosition] = useState({ x: '50%', y: '50%' });
  const { data: session } = useSession();

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
    <div className="hero-showcase">
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
            maskImage: `radial-gradient(circle 15vmin at ${flashPosition.x} ${flashPosition.y}, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 15vmin at ${flashPosition.x} ${flashPosition.y}, black, transparent)`,
          }}
        >
          <Image
            src="/head-homes.webp"
            alt="HEAD homes overlay"
            layout="fill"
            objectFit="cover"
          />
        </div>
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
        <p className="hero-description">Live in a housing estate where you want to HEAD home. Blockchain-based housing estate budget management, resident finance governace, and Homy powered by ORA Onchain-AI Oracle.</p>
        {session ? (
          <Link href="/dashboard" passHref>
            <Button className="hero-button">Housing Estate Dashboard</Button>
          </Link>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="hero-button">Housing Estate Dashboard</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Authentication Required</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to be logged in to access your estate dashboard. Would you like to sign in now?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Link href="/world-id">Sign In with World ID</Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <ul className="hero-social">
        <li><a href="#"><Image src="/facebook.svg" alt="Facebook" width={30} height={30} /></a></li>
        <li><a href="#"><Image src="/instagram.svg" alt="Instagram" width={30} height={30} /></a></li>
      </ul>
    </div>
  );
};

export default LandingPage;