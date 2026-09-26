import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ThuanPhatVisual } from './ThuanPhatVisual';

interface VespertineBackgroundProps {
  shiftLeft?: boolean;
}

export const VespertineBackground = ({ shiftLeft = false }: VespertineBackgroundProps) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [sjLoaded, setSjLoaded] = useState(false);
  
  const isLoaded = bgLoaded && sjLoaded;

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      initial={{ x: 0 }}
      animate={{ x: shiftLeft ? '-25%' : '0%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 1. LỚP BACKGROUND (Nền phía sau) */}
      <img
        src="https://i.ibb.co/JFvk9wzr/vespertine-bg.png"
        alt="Background layer"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover portrait:object-[49%_center] pointer-events-none select-none"
        onLoad={() => setBgLoaded(true)}
      />
      
      {/* 2. LỚP Ở GIỮA: HOẠT ẢNH CHẠY CHỮ (Nằm sau nhân vật, trước nền) */}
      <div className="absolute inset-0 pointer-events-none z-0" id="middle-layer">
        <ThuanPhatVisual />
      </div>

      {/* 3. LỚP CHỦ THỂ (Nhân vật phía trước) */}
      <img
        src="https://i.ibb.co/jPHPJSG7/vespertine-sj.png"
        alt="Subject layer"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover portrait:object-[49%_center] pointer-events-none select-none"
        onLoad={() => setSjLoaded(true)}
      />

      {/* 4. LỚP FALLBACK (Ảnh gốc nguyên bản, ẩn ngay khi 2 lớp trên tải xong) */}
      <motion.img 
        src="https://i.ibb.co/vy4ykmw/vespertine.png" 
        alt="Fallback background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover portrait:object-[49%_center] pointer-events-none select-none z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0 }}
      />
    </motion.div>
  );
};

export default VespertineBackground;
