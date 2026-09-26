import React, { useState } from 'react';
import { AppLanguage } from '../types';

interface GiftCard3DProps {
  frontUrl: string;
  backUrl: string;
  language?: AppLanguage;
  className?: string;
}

export const GiftCard3D: React.FC<GiftCard3DProps> = ({
  frontUrl,
  backUrl,
  language = 'vi',
  className = '',
}) => {
  const isEn = language === 'en';
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center py-4 select-none ${className}`}>
      {/* Vùng không gian 3D Perspective */}
      <div
        onClick={handleCardClick}
        className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] aspect-[3132/4988] cursor-pointer select-none touch-pan-y"
        style={{ perspective: '1600px' }}
        title={isEn ? 'Click to flip card' : 'Bấm để lật thẻ'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={isEn ? 'Gift card' : 'Thẻ quà tặng'}
      >
        {/* Thân thẻ 3D xoay lật (Bo góc mô phỏng thẻ nhựa thực tế) */}
        <div
          className="w-full h-full relative will-change-transform rounded-[14px] sm:rounded-[16px] select-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.65s cubic-bezier(0.2, 0.85, 0.35, 1)',
          }}
        >
          {/* ========================================================= */}
          {/* MẶT TRƯỚC (Front Face) */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden rounded-[14px] sm:rounded-[16px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <img
              src={frontUrl}
              alt="Mặt trước thẻ quà kỉ yếu"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none rounded-[14px] sm:rounded-[16px]"
            />
          </div>

          {/* ========================================================= */}
          {/* MẶT SAU (Back Face) - Xoay 180 độ */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden rounded-[14px] sm:rounded-[16px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <img
              src={backUrl}
              alt="Mặt sau thẻ quà kỉ yếu"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none rounded-[14px] sm:rounded-[16px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
