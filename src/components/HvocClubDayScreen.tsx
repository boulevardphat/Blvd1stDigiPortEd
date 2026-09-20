import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { AppLanguage } from '../types';

interface HvocClubDayScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

interface PhotoboothItem {
  id: string;
  number: string;
  titleVi: string;
  titleEn: string;
  url: string;
}

const CLUB_DAY_IMAGES: PhotoboothItem[] = [
  {
    id: 'emp-hvoc-clubday-bien',
    number: '01',
    titleVi: 'KHUNG PTB BIỂN',
    titleEn: 'SEA PHOTOBOOTH FRAME',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20Club%20Day/Khung%20ptb%20bi%E1%BB%83n.webp',
  },
  {
    id: 'emp-hvoc-clubday-nui',
    number: '02',
    titleVi: 'KHUNG PTB NÚI',
    titleEn: 'MOUNTAIN PHOTOBOOTH FRAME',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20Club%20Day/Khung%20ptb%20n%C3%BAi.webp',
  },
];

export const HvocClubDayScreen: React.FC<HvocClubDayScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollNext = () => {
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div 
      id="scene-hvoc-club-day"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-club-day-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" cho Mobile: Đặt trong luồng nội dung đầu trang */}
      <div className="block md:hidden w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <button
          type="button"
          id="btn-club-day-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        
        {/* Tiêu đề dự án */}
        <div className="w-full mb-8 md:mb-12 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white">
            {isEn ? 'CLUB DAY (2025)' : 'NGÀY HỘI CLB - ĐỘI - NHÓM (2025)'}
          </h1>
        </div>

        {/* 1. GIAO DIỆN DESKTOP (md trở lên): 2 khung photobooth đặt cạnh nhau */}
        <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 w-full max-w-4xl mx-auto items-start justify-items-center">
          {CLUB_DAY_IMAGES.map((item) => (
            <div 
              key={item.id}
              id={`clubday-item-desktop-${item.id}`}
              className="w-full max-w-[340px] flex flex-col items-start bg-transparent select-none"
            >
              {/* Tiêu đề từng khung */}
              <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                    {item.number}
                  </span>
                  <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                    {isEn ? item.titleEn : item.titleVi}
                  </span>
                  {/* Tool icon: Canva bé */}
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <img 
                      src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                      alt="Canva"
                      title="Canva"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Khung ảnh photobooth: không viền, không bo góc, không hover scale */}
              <div className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-default">
                <img
                  src={item.url}
                  alt={item.titleVi}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
                  style={{
                    aspectRatio: '880 / 2650',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 2. GIAO DIỆN MOBILE (< md): Vuốt trái phải mượt mà (Snap horizontal) */}
        <div className="block md:hidden w-full overflow-hidden">
          <div 
            ref={mobileScrollRef}
            className="w-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 px-1 pb-4 pt-1 no-scrollbar"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {CLUB_DAY_IMAGES.map((item) => (
              <div 
                key={item.id}
                id={`clubday-item-mobile-${item.id}`}
                className="w-[82vw] max-w-[310px] shrink-0 snap-center flex flex-col items-start bg-transparent select-none"
              >
                {/* Tiêu đề từng khung */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 text-white border-none">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-archivo font-normal text-[#89CC04] text-xs">
                      {item.number}
                    </span>
                    <span className="font-archivo font-bold text-sm tracking-wide uppercase text-white">
                      {isEn ? item.titleEn : item.titleVi}
                    </span>
                    {/* Tool icon: Canva bé */}
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      <img 
                        src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                        alt="Canva"
                        title="Canva"
                        className="w-3.5 h-3.5 object-contain rounded-none select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Biểu tượng mũi tên không khung ở góc trên bên phải khung ảnh, ngang hàng với dòng tiêu đề để ra hiệu */}
                  {item.id === 'emp-hvoc-clubday-bien' && (
                    <button
                      type="button"
                      id="btn-clubday-mobile-swipe-arrow"
                      onClick={handleScrollNext}
                      className="p-0 m-0 bg-transparent border-none outline-none cursor-pointer text-white/75 hover:text-white transition-colors duration-200 flex items-center justify-center shrink-0 select-none rounded-none"
                      title={isEn ? 'Swipe to view next' : 'Vuốt để xem tiếp'}
                      aria-label={isEn ? 'Swipe to view next' : 'Vuốt để xem tiếp'}
                    >
                      <ArrowRight className="w-4 h-4 text-white/75 hover:text-white transition-colors" strokeWidth={1.8} />
                    </button>
                  )}
                </div>

                {/* Khung ảnh photobooth */}
                <div className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.titleVi}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
                    style={{
                      aspectRatio: '880 / 2650',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
