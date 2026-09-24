import React from 'react';
import { AppLanguage } from '../types';

interface OthersFor12A2ScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

const POSTER_20_10_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/%5BA2K28%5D%2020_10_2025/%5BA2K28%5D%2020_10_2025.webp';

export const OthersFor12A2Screen: React.FC<OthersFor12A2ScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div 
      id="scene-others-for-12a2"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-for-12a2-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Others' : 'Trở về danh mục Khác'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" cho Mobile: Đặt trong luồng nội dung đầu trang */}
      <div className="block md:hidden w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <button
          type="button"
          id="btn-for-12a2-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Others' : 'Trở về danh mục Khác'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-24 flex flex-col items-center">
        
        {/* Header tiêu đề chính: CHO LỚP 12A2 */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-1">
            {isEn ? 'FOR CLASS 12A2' : 'CHO LỚP 12A2'}
          </h1>
          <span className="font-archivo font-normal text-xs sm:text-sm text-[#89CC04] uppercase tracking-wider">
            {isEn ? 'CLASS 12A2 MEMORIES (K28 CHUYEN HUNG VUONG)' : 'KỶ NIỆM TẬP THỂ 12A2 - K28 CHUYÊN HÙNG VƯƠNG'}
          </span>
        </div>

        {/* Danh sách các dự án tập thể của lớp 12A2 */}
        <div className="w-full flex flex-col gap-16 sm:gap-20 md:gap-24">

          {/* ========================================================= */}
          {/* MỤC 01: [A2K28] 20_10_2025 */}
          {/* ========================================================= */}
          <div id="project-20-10" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  01
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  [A2K28] 20_10_2025
                </span>
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

            {/* Poster dàn phẳng */}
            <div className="w-full max-w-[640px] mx-auto overflow-hidden bg-black rounded-none border border-neutral-900 flex items-center justify-center">
              <img 
                src={POSTER_20_10_URL}
                alt="[A2K28] 20_10_2025"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
