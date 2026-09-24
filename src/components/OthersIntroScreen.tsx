import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { OthersForPhatScreen } from './OthersForPhatScreen';
import { OthersFor12A2Screen } from './OthersFor12A2Screen';

interface OthersIntroScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const OthersIntroScreen: React.FC<OthersIntroScreenProps> = ({ onBack, language = 'vi' }) => {
  const [activeProject, setActiveProject] = useState<'FOR_PHAT' | 'FOR_12A2' | null>(null);
  const isEn = language === 'en';

  if (activeProject === 'FOR_PHAT') {
    return (
      <OthersForPhatScreen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  if (activeProject === 'FOR_12A2') {
    return (
      <OthersFor12A2Screen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  return (
    <div 
      id="scene-others-intro"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-40 select-none no-scrollbar flex flex-col justify-between"
    >
      {/* Nút "trở về" / "back" cho Desktop: Cố định góc trên bên trái giống HVOC */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-others-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Table of Contents' : 'Trở về mục lục'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" cho Mobile: Đặt ở đầu trang */}
      <div className="block md:hidden w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <button
          type="button"
          id="btn-others-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Table of Contents' : 'Trở về mục lục'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Vùng nội dung chính: Bố cục dạng list giống HVOC nhưng KHÔNG chia 2 cột trái phải */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-10 md:py-24 flex flex-col items-start justify-center">
        
        {/* Tiêu đề mục: KHÁC / OTHERS */}
        <div className="w-full mb-10 sm:mb-14 flex flex-col items-start select-none">
          <h1 
            id="others-main-title"
            className="w-fit font-archivo font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.1] text-white mb-2 select-none"
          >
            {isEn ? 'OTHERS' : 'KHÁC'}
          </h1>
          <p className="font-archivo font-normal text-xs sm:text-sm text-neutral-400 uppercase tracking-widest">
            {isEn ? 'INDIVIDUAL PORTFOLIO ARCHIVE' : 'KHO ẤN PHẨM CÁ NHÂN & KỶ NIỆM'}
          </p>
        </div>

        {/* Danh sách 2 option học theo định dạng typography của HVOC */}
        <div className="w-full flex flex-col space-y-5 sm:space-y-6 md:space-y-8 text-[clamp(1.25rem,3vw,2.25rem)] text-white/95 font-archivo font-medium tracking-tight leading-snug select-none uppercase">
          
          {/* Option 01: CHO PHÁT */}
          <div 
            id="others-option-for-phat"
            onClick={() => setActiveProject('FOR_PHAT')}
            className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
          >
            <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
              01
            </span>
            <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
              {isEn ? 'FOR PHAT' : 'CHO PHÁT'}
            </span>
          </div>

          {/* Option 02: CHO LỚP 12A2 */}
          <div 
            id="others-option-for-12a2"
            onClick={() => setActiveProject('FOR_12A2')}
            className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
          >
            <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
              02
            </span>
            <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
              {isEn ? 'FOR CLASS 12A2' : 'CHO LỚP 12A2'}
            </span>
          </div>

        </div>

      </div>

      {/* Khoảng đệm chân trang */}
      <div className="h-6 md:h-10 shrink-0" />
    </div>
  );
};
