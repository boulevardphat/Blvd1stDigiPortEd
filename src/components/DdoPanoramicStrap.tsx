import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppLanguage } from '../types';

interface DdoPanoramicStrapProps {
  language?: AppLanguage;
}

interface SingleStrapData {
  id: string;
  titleVi: string;
  titleEn: string;
  url: string;
  animationDuration: string;
  animationDelay?: string;
}

const STRAP_ITEMS: SingleStrapData[] = [
  {
    id: 'strap-official',
    titleVi: 'CHÍNH THỨC',
    titleEn: 'OFFICIAL',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/D%C3%A2y%20%C4%91eo%20ch%C3%ADnh%20th%E1%BB%A9c.webp',
    animationDuration: '28s',
  },
  {
    id: 'strap-alternative',
    titleVi: 'BẢN PHỤ',
    titleEn: 'ALTERNATIVE',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/D%C3%A2y%20%C4%91eo%20b%E1%BA%A3n%20ph%E1%BB%A5.webp',
    animationDuration: '25s',
    animationDelay: '-6s',
  },
];

interface StrapRowProps {
  item: SingleStrapData;
  isEn: boolean;
}

const StrapRow: React.FC<StrapRowProps> = ({ item, isEn }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const didDragRef = useRef(false);

  // Drag-to-scroll when expanded
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded || !scrollContainerRef.current) return;
    setIsDragging(true);
    didDragRef.current = false;
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      didDragRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    // Only toggle expand/collapse if user clicked without dragging
    if (!didDragRef.current) {
      setIsExpanded((prev) => !prev);
    }
    didDragRef.current = false;
  };

  return (
    <div className="w-full flex flex-col items-start select-none">
      {/* Label above strap */}
      <div className="w-full flex items-baseline pb-2 text-white border-none">
        <span className="font-archivo font-bold text-xs sm:text-sm tracking-wider uppercase text-white/90">
          {isEn ? item.titleEn : item.titleVi}
        </span>
      </div>

      {/* Strap interactive container */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full relative overflow-hidden bg-black/60 border border-white/10 rounded-none transition-all duration-300 ${
          isExpanded
            ? 'h-[135px] sm:h-[155px] md:h-[175px] overflow-x-auto cursor-grab active:cursor-grabbing no-scrollbar'
            : 'h-[75px] sm:h-[85px] md:h-[95px] cursor-pointer hover:border-white/30'
        }`}
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClick={handleClick}
        title={
          isExpanded
            ? isEn
              ? 'Click to collapse or drag horizontally to scroll'
              : 'Bấm vào để thu vào hoặc kéo ngang để cuộn'
            : isEn
              ? 'Click to expand & scroll'
              : 'Bấm vào để mở ra & cuộn thủ công'
        }
      >
        <div
          className={`h-full flex items-center ${
            isExpanded ? 'w-max px-4' : 'w-max animate-panoramic'
          }`}
          style={
            !isExpanded
              ? {
                  animationDuration: item.animationDuration,
                  animationDelay: item.animationDelay || '0s',
                }
              : undefined
          }
        >
          <img
            src={item.url}
            alt={item.titleVi}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-[75%] sm:h-[80%] w-auto object-contain max-w-none select-none pointer-events-none"
          />
        </div>

        {/* Gradient edge masks when collapsed */}
        {!isExpanded && (
          <>
            <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-black via-black/60 to-transparent pointer-events-none" />
          </>
        )}
      </motion.div>
    </div>
  );
};

export const DdoPanoramicStrap: React.FC<DdoPanoramicStrapProps> = ({ language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div className="w-full flex flex-col items-start select-none">
      <style>{`
        @keyframes panoramicGlide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(calc(-100% + 100vw - 80px));
          }
        }
        .animate-panoramic {
          animation-name: panoramicGlide;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          will-change: transform;
        }
      `}</style>

      {/* Both straps stacked: Official on top, Alter below */}
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        {STRAP_ITEMS.map((item) => (
          <StrapRow key={item.id} item={item} isEn={isEn} />
        ))}
      </div>
    </div>
  );
};
