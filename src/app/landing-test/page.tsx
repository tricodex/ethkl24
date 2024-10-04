'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './style.module.css'; 

const StrobeFlashlight: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });
  const flashlightRef = useRef<HTMLDivElement>(null);
  const [debugInfo ] = useState<string>('');



  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flashlightRef.current) {
      const rect = flashlightRef.current.getBoundingClientRect();
      setMousePosition({
        x: `${e.clientX - rect.left}px`,
        y: `${e.clientY - rect.top}px`,
      });
    }
  };

  return (
    <div className={styles.container}>
      
      <div
        ref={flashlightRef}
        className={styles.flashlightContainer}
        onMouseMove={handleMouseMove}
      >
        <Image
          src="/building-block.webp"
          alt="Building blocks"
          layout="fill"
          objectFit="cover"
          className={styles.image}
        />
        <div 
          className={styles.flashlightMask}
          style={{
            maskImage: `radial-gradient(circle 35vmin at ${mousePosition.x} ${mousePosition.y}, black, transparent)`,
          }}
        >
          <Image
            src="/building-block.webp"
            alt="Building blocks overlay"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <main className={styles.main}>
        <pre className={styles.debugInfo}>{debugInfo}</pre>
      </main>
    </div>
  );
};

export default StrobeFlashlight;
