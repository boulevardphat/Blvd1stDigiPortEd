import React, { useState } from 'react';
import { AppLanguage } from '../types';

interface HvkFlipbookScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const HvkFlipbookScreen: React.FC<HvkFlipbookScreenProps> = ({ 
  onBack, 
  language = 'vi' 
}) => {
  const isEn = language === 'en';
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  return (
    <div 
      id="scene-hvk-flipbook"
      className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-hidden select-none animate-fade-in"
    >
      {/* Nút "trở về" / "back" - Desktop: Cố định góc trên bên trái chuẩn tối giản Boulevard1st */}
      <div className="hidden md:block fixed md:top-6 md:left-8 lg:top-8 lg:left-10 z-50 select-none">
        <button
          type="button"
          id="btn-hvk-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/70 hover:text-white transition-colors duration-200 cursor-pointer bg-black/60 hover:bg-black/90 px-3 py-1.5 border border-white/10 hover:border-white/30 outline-none select-none rounded-none backdrop-blur-sm"
          title={isEn ? 'Back to Table of Contents' : 'Trở về Mục lục'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" - Mobile: Cố định góc trên bên trái */}
      <div className="block md:hidden fixed top-3 left-3 z-50 select-none">
        <button
          type="button"
          id="btn-hvk-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs tracking-normal text-white/80 hover:text-white transition-colors duration-200 cursor-pointer bg-black/80 px-3 py-1.5 border border-white/20 outline-none select-none rounded-none backdrop-blur-sm shadow-md"
          title={isEn ? 'Back to Table of Contents' : 'Trở về Mục lục'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Loading placeholder trong lúc nhúng iframe từ Fliplink */}
      {!iframeLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black pointer-events-none">
          <span className="font-archivo text-xs sm:text-sm text-neutral-500 tracking-widest uppercase animate-pulse">
            LOADING FLIPBOOK...
          </span>
        </div>
      )}

      {/* Nhúng trực tiếp Fliplink chính thức vào nền đen hoàn toàn */}
      <div className="relative w-full h-full flex-1 bg-black overflow-hidden rounded-none">
        <iframe
          src="https://go.fliplink.me/view/HOSOCONGTYHVK"
          title="Hồ sơ công ty TNHH TM DV Hải Vân Khánh - Fliplink"
          allow="fullscreen; clipboard-write"
          allowFullScreen
          loading="eager"
          onLoad={() => setIframeLoaded(true)}
          className={`w-full h-full border-0 bg-black rounded-none block transition-opacity duration-500 ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
