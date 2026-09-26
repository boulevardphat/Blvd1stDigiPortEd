import React from 'react';
import { AppLanguage } from '../types';

interface OthersForFriendsScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

// 1. Random (私はゲイの男性です)
const RANDOM_GAY_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Random/%E7%A7%81%E3%81%AF%E3%82%B2%E3%82%A4%E3%81%AE%E7%94%B7%E6%80%A7%E3%81%A7%E3%81%99.webp';

// 2. Poster bộ 4 ấn phẩm
const POSTER_KA_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Poster/KA.webp';
const POSTER_MA_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Poster/MA.webp';
const POSTER_MU_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Poster/MU.webp';
const POSTER_DN_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Poster/%C4%90N.webp';

interface PosterItem {
  id: string;
  title: string;
  url: string;
}

const POSTER_KA: PosterItem = { id: 'poster-ka', title: 'KA', url: POSTER_KA_URL };
const POSTER_MA: PosterItem = { id: 'poster-ma', title: 'MA', url: POSTER_MA_URL };
const POSTER_MU: PosterItem = { id: 'poster-mu', title: 'MU', url: POSTER_MU_URL };
const POSTER_DN: PosterItem = { id: 'poster-dn', title: 'ĐN', url: POSTER_DN_URL };

export const OthersForFriendsScreen: React.FC<OthersForFriendsScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  // Card render helper: không hover, không click/modal, không badge tên, không bo góc
  const renderPosterCard = (poster: PosterItem, extraClass: string = '') => (
    <div
      key={poster.id}
      className={`relative overflow-hidden bg-black border border-white/20 shadow-2xl rounded-none aspect-[3611/5000] w-full select-none cursor-default ${extraClass}`}
    >
      <img
        src={poster.url}
        alt={`Poster ${poster.title}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover select-none pointer-events-none rounded-none"
      />
    </div>
  );

  return (
    <div 
      id="scene-others-for-friends"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-for-friends-back-desktop"
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
          id="btn-for-friends-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Others' : 'Trở về danh mục Khác'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 md:px-10 lg:px-12 pt-4 md:pt-16 pb-28 flex flex-col items-center">
        {/* Header tiêu đề chính: CHO BẠN CỦA PHÁT */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-1">
            {isEn ? "FOR PHAT'S FRIENDS" : 'CHO BẠN CỦA PHÁT'}
          </h1>
          <span className="font-archivo font-normal text-xs sm:text-sm text-[#89CC04] uppercase tracking-wider">
            {isEn ? 'FRIENDS ARCHIVE & MEMORIES' : 'KHO ẤN PHẨM & KỶ NIỆM BẠN BÈ'}
          </span>
        </div>

        {/* Danh sách các dự án / ấn phẩm */}
        <div className="w-full flex flex-col gap-16 sm:gap-20 md:gap-24">
          
          {/* ========================================================= */}
          {/* DỰ ÁN 01: RANDOM (私はゲイの男性です) */}
          {/* ========================================================= */}
          <div id="project-random-gay" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 01 */}
            <div className="w-full flex items-baseline pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  01
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  RANDOM - 私はゲイの男性です
                </span>
                {/* Tool icon: Canva */}
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

            {/* Poster / Artwork dàn phẳng */}
            <div className="w-full max-w-[720px] mx-auto overflow-hidden bg-black rounded-none border border-neutral-900 flex items-center justify-center shadow-2xl">
              <img 
                src={RANDOM_GAY_URL}
                alt="Random - 私はゲイの男性です"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* DỰ ÁN 02: POSTER (BỘ 4 ẤN PHẨM KA - MA - MU - ĐN) */}
          {/* Tăng kích thước, thu hẹp khoảng cách gap còn 50%, bỏ badge tên, bỏ hover & bấm */}
          {/* ========================================================= */}
          <div id="project-posters" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 02 */}
            <div className="w-full flex items-baseline pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  02
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  POSTER
                </span>
                {/* Tool icon: Canva */}
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

            {/* 1. MÀN HÌNH MOBILE (< md): 2 Cột so le, khoảng cách gap thu hẹp 50% (gap-1.5 sm:gap-2) */}
            <div className="grid md:hidden grid-cols-2 gap-1.5 sm:gap-2 w-full mx-auto items-start">
              {/* Cột 1 (Trái): KA (trên) và MA (dưới) */}
              <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                {renderPosterCard(POSTER_KA)}
                {renderPosterCard(POSTER_MA)}
              </div>

              {/* Cột 2 (Phải): MU (trên) và ĐN (dưới) - So le trễ xuống */}
              <div className="flex flex-col gap-1.5 sm:gap-2 w-full pt-6 sm:pt-8">
                {renderPosterCard(POSTER_MU)}
                {renderPosterCard(POSTER_DN)}
              </div>
            </div>

            {/* 2. MÀN HÌNH DESKTOP (>= md): 4 Poster dàn hàng ngang so le zic-zắc, kích thước mở rộng, gap thu hẹp 50% (gap-2 lg:gap-3) */}
            <div className="hidden md:grid md:grid-cols-4 gap-2 lg:gap-3 w-full mx-auto items-start">
              {/* Poster 1: KA (Độ cao vừa phải) */}
              {renderPosterCard(POSTER_KA, 'md:mt-6 lg:mt-8')}

              {/* Poster 2: MA (Hạ sâu xuống dưới) */}
              {renderPosterCard(POSTER_MA, 'md:mt-16 lg:mt-22')}

              {/* Poster 3: MU (Đẩy lên cao nhất) */}
              {renderPosterCard(POSTER_MU, 'md:mt-0')}

              {/* Poster 4: ĐN (Hạ mức trung gian) */}
              {renderPosterCard(POSTER_DN, 'md:mt-10 lg:mt-14')}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
