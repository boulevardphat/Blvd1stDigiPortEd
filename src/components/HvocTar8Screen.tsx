import React from 'react';
import { AppLanguage } from '../types';
import Lanyard from './Lanyard';

interface HvocTar8ScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const HvocTar8Screen: React.FC<HvocTar8ScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div 
      id="scene-hvoc-tar8"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-tar8-back-desktop"
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
          id="btn-tar8-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính: Trình bày thẻ đeo 3D Lanyard của THE AMAZING RACE 8 */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        
        {/* Tiêu đề dự án */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white">
            THE AMAZING RACE 8 (TAR)
          </h1>
        </div>

        {/* Danh sách các phần tử theo chuẩn Boulevard1st */}
        <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
          
          {/* 01. THẺ ĐEO (React Bits Lanyard tương tác vật lý rapier) */}
          <div id="gallery-item-tar8-thedeo" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-2.5 mb-1 text-white border-none">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">01</span>
                <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                  {isEn ? 'EVENT BADGE' : 'THẺ ĐEO'}
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
                <span className="font-archivo font-light text-xs sm:text-sm text-white/50 normal-case tracking-normal">
                  {isEn ? 'drag card, scroll wheel or pinch to zoom' : 'kéo lắc thẻ, cuộn chuột hoặc chụm tay để zoom'}
                </span>
              </div>
            </div>
            <div className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center">
              <Lanyard
                position={[0, 0, 18]}
                gravity={[0, -40, 0]}
                fov={20}
                frontImage="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20TAR%208/Th%E1%BA%BB%20%C4%91eo.webp"
                aspectRatio={1650 / 2580}
                imageFit="cover"
                transparent={true}
                lanyardWidth={1}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
