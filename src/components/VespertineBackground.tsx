import React from 'react';
import { motion } from 'motion/react';

interface VespertineBackgroundProps {
  shiftLeft?: boolean;
  onLoaded?: () => void;
  isReady?: boolean;
}

export const VespertineBackground = ({ 
  shiftLeft = false,
  onLoaded,
  isReady = true,
}: VespertineBackgroundProps) => {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black"
      initial={{ x: 0 }}
      animate={{ x: shiftLeft ? '-25%' : '0%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ảnh Vespertine gốc nguyên bản */}
      <img
        src="/vespertine.webp" 
        alt="Vespertine background"
        referrerPolicy="no-referrer"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={async (e) => {
          try {
            if ('decode' in e.currentTarget) {
              await e.currentTarget.decode();
            }
          } catch {}
          onLoaded?.();
        }}
        className={`absolute inset-0 w-full h-full object-cover portrait:object-[49%_center] pointer-events-none transition-opacity duration-300 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
};
