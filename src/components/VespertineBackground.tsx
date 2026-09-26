import React from 'react';
import { motion } from 'motion/react';

interface VespertineBackgroundProps {
  shiftLeft?: boolean;
}

export const VespertineBackground = ({ shiftLeft = false }: VespertineBackgroundProps) => {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      initial={{ x: 0 }}
      animate={{ x: shiftLeft ? '-25%' : '0%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ảnh Vespertine gốc nguyên bản */}
      <img
        src="https://i.ibb.co/vy4ykmw/vespertine.png" 
        alt="Vespertine background"
        referrerPolicy="no-referrer"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover portrait:object-[49%_center] pointer-events-none"
      />
    </motion.div>
  );
};
