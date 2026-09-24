import React, { useState, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);

  // Mặc định luôn ở không gian 3D
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Hiệu ứng tương tác vật lý nghiêng thẻ theo toạ độ chuột (Parallax 3D Tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Giới hạn góc nghiêng vật lý tinh tế (tối đa ±12 độ)
    const tiltX = (-y / (rect.height / 2)) * 12;
    const tiltY = (x / (rect.width / 2)) * 14;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  // Tính toán góc xoay tổng hợp (lật 180 độ + góc nghiêng chuột)
  const currentRotateY = isFlipped ? 180 + -tilt.y : tilt.y;
  const currentRotateX = isFlipped ? -tilt.x : tilt.x;

  return (
    <div className={`w-full flex flex-col items-center justify-center py-4 select-none ${className}`}>
      {/* Vùng không gian 3D Perspective */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] aspect-[3132/4988] cursor-pointer group select-none touch-pan-y"
        style={{ perspective: '1600px' }}
        title={isEn ? 'Click or tap card to flip' : 'Bấm hoặc chạm vào thẻ để lật mặt'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={isEn ? 'Interactive 3D gift card' : 'Thẻ quà tặng tương tác 3D'}
      >
        {/* Thân thẻ 3D xoay lật */}
        <div
          className="w-full h-full relative will-change-transform rounded-2xl select-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`,
            transition: isHovering
              ? 'transform 0.12s ease-out'
              : 'transform 0.8s cubic-bezier(0.2, 0.85, 0.35, 1)',
          }}
        >
          {/* ========================================================= */}
          {/* MẶT TRƯỚC (Front Face) - Bo góc mềm mại như thẻ nhựa thật */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden rounded-2xl sm:rounded-[20px] border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_10px_20px_-5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center backface-hidden"
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
              className="w-full h-full object-cover select-none pointer-events-none rounded-2xl sm:rounded-[20px]"
            />

            {/* Lớp phản quang bóng kính (Glossy Sheen) di chuyển theo góc nghiêng */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-[20px] transition-opacity duration-300"
              style={{
                background: `linear-gradient(${125 + tilt.y * 3}deg, rgba(255,255,255,${0.18 + Math.abs(tilt.x + tilt.y) * 0.008}) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)`,
                opacity: isHovering ? 1 : 0.6,
              }}
            />

            {/* Viền vát cạnh giả lập độ dày nhựa thực tế (Card Edge Bevel) */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-[20px] ring-1 ring-inset ring-white/15" />
          </div>

          {/* ========================================================= */}
          {/* MẶT SAU (Back Face) - Xoay 180 độ, bo góc đồng bộ */}
          {/* ========================================================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden rounded-2xl sm:rounded-[20px] border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_10px_20px_-5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center backface-hidden"
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
              className="w-full h-full object-cover select-none pointer-events-none rounded-2xl sm:rounded-[20px]"
            />

            {/* Lớp phản quang bóng kính cho mặt sau */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-[20px] transition-opacity duration-300"
              style={{
                background: `linear-gradient(${125 - tilt.y * 3}deg, rgba(255,255,255,${0.18 + Math.abs(tilt.x + tilt.y) * 0.008}) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)`,
                opacity: isHovering ? 1 : 0.6,
              }}
            />

            {/* Viền vát cạnh */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-[20px] ring-1 ring-inset ring-white/15" />
          </div>
        </div>
      </div>

      {/* Dòng hướng dẫn lật thẻ thanh lịch, tối giản (không thanh chuyển đổi) */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs font-archivo text-white/50 tracking-wide select-none">
        <svg
          className="w-3.5 h-3.5 text-[#89CC04] animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="font-archivo text-xs text-white/50 lowercase tracking-normal">
          {isEn ? '(click or tap card to flip)' : '(bấm hoặc chạm vào thẻ để lật mặt)'}
        </span>
      </div>
    </div>
  );
};
