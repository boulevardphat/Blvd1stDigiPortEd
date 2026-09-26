import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const TEXT = "THUANPHAT";
const MAX_OPACITY = 0.12;

export const ThuanPhatVisual = () => {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true
  );
  const [mode, setMode] = useState<'thuanphat' | 'blvd'>('thuanphat');
  const [phase, setPhase] = useState<'appearing' | 'disappearing' | 'hidden'>('hidden');

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop (Landscape): 7 hàng | Mobile (Portrait): 22 hàng phủ kín màn hình
  const numRows = isLandscape ? 7 : 22;

  useEffect(() => {
    let active = true;
    let t: NodeJS.Timeout;

    const runSequence = () => {
      if (!active) return;
      
      // Bước 1: THUANPHAT bắt đầu xuất hiện nối tiếp từ dưới lên trên
      setMode('thuanphat');
      setPhase('appearing');
      
      t = setTimeout(() => {
        if (!active) return;
        // Bước 2: THUANPHAT bắt đầu biến mất nối tiếp từ trên xuống dưới
        setPhase('disappearing');
        
        t = setTimeout(() => {
          if (!active) return;
          // Bước 3: THUANPHAT ẩn hoàn toàn
          setPhase('hidden');
          
          t = setTimeout(() => {
            if (!active) return;
            // Bước 4: Chữ BLVD dạng SVG kéo dãn xuất hiện tức thì (không fade)
            setMode('blvd');
            setPhase('appearing');
            
            t = setTimeout(() => {
              if (!active) return;
              // Bước 5: BLVD biến mất tức thì
              setPhase('hidden');
              
              t = setTimeout(() => {
                if (!active) return;
                // Bước 6: Vòng lặp quay trở lại bước 1
                runSequence();
              }, 150);
            }, 500); // Hiển thị BLVD trong 500ms
          }, 150); // Khoảng nghỉ trước khi BLVD xuất hiện
        }, numRows * 20 + 50); // Thời gian fade biến mất của các dòng THUANPHAT
      }, numRows * 20 + 300); // Thời gian dừng hiển thị của THUANPHAT
    };

    runSequence();

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [numRows]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      
      {/* CHU KỲ 1: DẢI CHỮ THUANPHAT */}
      {mode === 'thuanphat' && (
        <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden gap-[calc(var(--vh,1vh)*1.8)] landscape:gap-[calc(var(--vh,1vh)*4.5)]">
          {Array.from({ length: numRows }).map((_, index) => {
            let opacity = 0;
            let delay = 0;
            
            if (phase === 'appearing') {
              opacity = MAX_OPACITY;
              // Xuất hiện từ dưới lên trên: hàng index lớn nhất xuất hiện trước
              delay = (numRows - 1 - index) * 0.02;
            } else if (phase === 'disappearing') {
              opacity = 0;
              // Biến mất từ trên xuống dưới: hàng index 0 biến mất trước
              delay = index * 0.02;
            } else {
              opacity = 0;
              delay = 0;
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.03, delay: delay }}
                className="font-archivo text-[12.5vw] landscape:text-[clamp(4.5rem,10.5vw,8rem)] leading-[0.7] text-[#111111] uppercase whitespace-nowrap scale-y-[0.95] origin-center tracking-[-0.04em]"
                style={{ fontVariationSettings: '"wdth" 100, "wght" 500' }}
              >
                {TEXT}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CHU KỲ 2: CHỮ BLVD KÉO DÃN KHỚP HOÀN TOÀN VỚI KHỐI CHỮ */}
      {mode === 'blvd' && (
        <div className="absolute inset-0 flex justify-center items-center py-[calc(var(--vh,1vh)*8)] landscape:py-[calc(var(--vh,1vh)*4.5)]">
          <div className="relative flex justify-center items-center h-full w-fit">
            {/* Lớp chữ tàng hình dùng để lấy đúng width tự nhiên của chuỗi chữ THUANPHAT */}
            <div 
              className="invisible font-archivo text-[12.5vw] landscape:text-[clamp(4.5rem,10.5vw,8rem)] leading-[0.7] uppercase whitespace-nowrap scale-y-[0.95] tracking-[-0.04em]"
              style={{ fontVariationSettings: '"wdth" 100, "wght" 500' }}
            >
              {TEXT}
            </div>
            
            {phase === 'appearing' && (
              <svg 
                viewBox="0 0 400 100" 
                className="absolute inset-0 w-full h-full" 
                preserveAspectRatio="none"
              >
                <text 
                  x="50%" 
                  y="54%" 
                  textLength="400"
                  lengthAdjust="spacingAndGlyphs"
                  style={{ fontFamily: 'Archivo, sans-serif', fontVariationSettings: '"wdth" 100, "wght" 500' }}
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fontSize="110" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.95)" 
                  strokeWidth="3.2"
                >
                  BLVD
                </text>
              </svg>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ThuanPhatVisual;
