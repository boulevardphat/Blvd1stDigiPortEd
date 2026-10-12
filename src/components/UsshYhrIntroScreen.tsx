import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppLanguage } from '../types';

interface UsshYhrIntroScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const USSH_YHR_LOGO_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/logo%20ussh%20yhr.png';
const LOGO_CHIET_TU_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/logo%20chi%E1%BA%BFt%20t%E1%BB%B1%20cho%20yhr.webp';
const ICON_AFFINITY = 'https://i.ibb.co/pBXrq6cf/affinity.jpg';
const ICON_CANVA = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp';
const ICON_IBISPAINT = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/ibispaint.webp';

export const UsshYhrIntroScreen: React.FC<UsshYhrIntroScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToZone = useCallback((targetIndex: number) => {
    const nextIdx = Math.max(0, Math.min(2, targetIndex));
    setActiveZoneIndex(nextIdx);
    isTransitioningRef.current = true;
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, 650);
  }, []);

  // Cuộn chuột / trackpad: 1 lần cuộn = sang đúng 1 zone, tương tự chuẩn #BLVD
  useEffect(() => {
    const container = document.getElementById('scene-ussh-yhr-zones');
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 18) return;

      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        if (e.deltaY > 0) {
          if (activeZoneIndex < 2) {
            e.preventDefault();
            goToZone(activeZoneIndex + 1);
          }
        } else {
          if (activeZoneIndex > 0) {
            e.preventDefault();
            goToZone(activeZoneIndex - 1);
          }
        }
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [activeZoneIndex, goToZone]);

  // Vuốt cảm ứng trên mobile / tablet: 1 lần vuốt = sang đúng 1 zone
  useEffect(() => {
    const container = document.getElementById('scene-ussh-yhr-zones');
    if (!container) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isTransitioningRef.current) return;
      if (e.changedTouches.length === 0) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const diffY = touchStartY - endY;
      const diffX = touchStartX - endX;
      const duration = Date.now() - touchStartTime;

      const isQuickFlick = duration < 350 && Math.abs(diffY) > 25;
      const isIntentionalSwipe = Math.abs(diffY) > 40;

      if ((isIntentionalSwipe || isQuickFlick) && Math.abs(diffY) > Math.abs(diffX) * 1.1) {
        if (diffY > 0) {
          if (activeZoneIndex < 2) {
            goToZone(activeZoneIndex + 1);
          }
        } else {
          if (activeZoneIndex > 0) {
            goToZone(activeZoneIndex - 1);
          }
        }
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeZoneIndex, goToZone]);

  // Phím mũi tên lên/xuống hoặc PageUp/PageDown chuyển zone
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (activeZoneIndex < 2) {
          e.preventDefault();
          goToZone(activeZoneIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeZoneIndex > 0) {
          e.preventDefault();
          goToZone(activeZoneIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZoneIndex, goToZone]);

  const isZone2 = activeZoneIndex === 1;

  return (
    <div 
      id="scene-ussh-yhr-zones"
      className="absolute inset-0 bg-black z-50 select-none overflow-hidden overscroll-none text-white"
    >
      {/* ========================================================================= */}
      {/* GÓC TRÊN BÊN TRÁI: ĐẢM BẢO NÚT TRỞ VỀ Ở CẢ 3 ZONE CÙNG VỊ TRÍ TUYỆT ĐỐI      */}
      {/* (Zone 1 & Zone 3 chỉ có nút trở về; Zone 2 trong khung đen cùng vị trí)    */}
      {/* ========================================================================= */}
      {activeZoneIndex !== 1 ? (
        /* Zone 1 và Zone 3: Nút trở về độc lập ở cùng vị trí cố định giống các phần khác */
        <button
          type="button"
          id="yhr-back-to-toc-button-standalone"
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="fixed top-6 left-6 md:top-8 md:left-8 z-50 font-archivo font-normal normal-case text-xs md:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none pointer-events-auto"
          title={isEn ? 'Back to table of contents' : 'Quay về mục lục'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      ) : (
        <>
          {/* ===================================================================== */}
          {/* A. MOBILE FRAME (sm:hidden): THANH NGANG THU GỌN THEO CHIỀU NGANG     */}
          {/*    Lấy size nút trở về làm gốc, không chiếm diện tích moodboard       */}
          {/* ===================================================================== */}
          <div 
            id="yhr-sublogo-mobile-frame"
            className="flex sm:hidden fixed top-6 left-6 z-50 bg-black/95 border border-white/20 p-2 items-center gap-2.5 max-w-[calc(100vw-3rem)] rounded-none pointer-events-auto select-none"
          >
            {/* 1. Nút trở về */}
            <button
              type="button"
              id="yhr-back-button-mobile"
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="font-archivo font-normal normal-case text-xs tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none shrink-0"
              title={isEn ? 'Back to table of contents' : 'Quay về mục lục'}
            >
              {isEn ? 'back' : 'trở về'}
            </button>

            {/* Vạch ngăn mỏng */}
            <div className="w-px h-3 bg-white/20 shrink-0" />

            {/* 2. Logo Chiết Tự nhỏ cho mobile bar */}
            <div className="w-5 h-5 aspect-square flex items-center justify-center overflow-hidden bg-black/40 shrink-0">
              <img
                src={LOGO_CHIET_TU_URL}
                alt="Logo Chiết Tự"
                className="w-full h-full object-contain rounded-none select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 3. Tên CHIẾT TỰ + icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-archivo font-bold text-xs tracking-wide uppercase text-white leading-none whitespace-nowrap">
                CHIẾT TỰ
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-0.5">
                <img
                  src={ICON_AFFINITY}
                  alt="Affinity"
                  title="Affinity"
                  className="w-3.5 h-3.5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={ICON_CANVA}
                  alt="Canva"
                  title="Canva"
                  className="w-3.5 h-3.5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/RTw2phXD/canva.jpg";
                  }}
                />
                <img
                  src={ICON_IBISPAINT}
                  alt="ibisPaint"
                  title="ibisPaint"
                  className="w-3.5 h-3.5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/N66hJX5h/ibispaint.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* B. DESKTOP FRAME (hidden sm:flex): KHUNG DỌC BẢNG LỚN RIÊNG BIỆT      */}
          {/*    Logo scale ngang các element xung quanh (w-full aspect-square)      */}
          {/* ===================================================================== */}
          <div 
            id="yhr-sublogo-desktop-frame"
            className="hidden sm:flex fixed top-6 left-6 md:top-8 md:left-8 z-50 bg-black/95 border border-white/20 p-4 md:p-5 flex-col items-start gap-3.5 w-56 md:w-64 rounded-none pointer-events-auto select-none"
          >
            {/* 1. Nút trở về */}
            <button
              type="button"
              id="yhr-back-button-desktop"
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="font-archivo font-normal normal-case text-xs md:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
              title={isEn ? 'Back to table of contents' : 'Quay về mục lục'}
            >
              {isEn ? 'back' : 'trở về'}
            </button>

            {/* 2. Logo Chiết Tự: Scale ngang các element xung quanh (w-full aspect-square) */}
            <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-black/50 border border-white/10 shrink-0">
              <img
                src={LOGO_CHIET_TU_URL}
                alt="Logo Chiết Tự"
                className="w-full h-full object-contain p-2 rounded-none select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 3. Tên chương trình CHIẾT TỰ và các công cụ dàn đều hai bên */}
            <div className="w-full flex items-center justify-between gap-2 shrink-0 pt-0.5">
              <span className="font-archivo font-bold text-sm md:text-base tracking-wider uppercase text-white leading-none whitespace-nowrap">
                CHIẾT TỰ
              </span>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <img
                  src={ICON_AFFINITY}
                  alt="Affinity"
                  title="Affinity"
                  className="w-4 h-4 md:w-5 md:h-5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={ICON_CANVA}
                  alt="Canva"
                  title="Canva"
                  className="w-4 h-4 md:w-5 md:h-5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/RTw2phXD/canva.jpg";
                  }}
                />
                <img
                  src={ICON_IBISPAINT}
                  alt="ibisPaint"
                  title="ibisPaint"
                  className="w-4 h-4 md:w-5 md:h-5 object-contain rounded-none select-none pointer-events-none shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://i.ibb.co/N66hJX5h/ibispaint.png";
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* THANH ĐIỀU HƯỚNG CẠNH DƯỚI: KHÔNG SHADOW KHI HOVER Ở ZONE 2                */}
      {/* ========================================================================= */}
      <div 
        id="yhr-bottom-zone-switcher"
        className="fixed bottom-6 md:bottom-8 inset-x-0 z-[60] flex items-center justify-center gap-6 md:gap-8 select-none pointer-events-auto !shadow-none !drop-shadow-none !filter-none"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToZone(0);
          }}
          className={`font-archivo font-normal normal-case text-xs md:text-sm tracking-normal transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none !shadow-none hover:!shadow-none focus:!shadow-none !drop-shadow-none hover:!drop-shadow-none [text-shadow:none] hover:[text-shadow:none] focus:outline-none focus:ring-0 ${
            isZone2
              ? 'text-black/50 hover:text-black/90'
              : activeZoneIndex === 0
              ? 'text-white font-medium'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          {isEn ? 'introduction' : 'giới thiệu'}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToZone(1);
          }}
          className={`font-archivo font-normal normal-case text-xs md:text-sm tracking-normal transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none !shadow-none hover:!shadow-none focus:!shadow-none !drop-shadow-none hover:!drop-shadow-none [text-shadow:none] hover:[text-shadow:none] focus:outline-none focus:ring-0 ${
            isZone2
              ? 'text-black font-medium'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          moodboard
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToZone(2);
          }}
          className={`font-archivo font-normal normal-case text-xs md:text-sm tracking-normal transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none !shadow-none hover:!shadow-none focus:!shadow-none !drop-shadow-none hover:!drop-shadow-none [text-shadow:none] hover:[text-shadow:none] focus:outline-none focus:ring-0 ${
            isZone2
              ? 'text-black/50 hover:text-black/90'
              : activeZoneIndex === 2
              ? 'text-white font-medium'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          {isEn ? 'finished products' : 'thành phẩm'}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CONTAINER SLIDER TRƯỢT TỪNG ZONE (DURATION 650MS, CHỐNG TRƯỢT LỐ)        */}
      {/* ========================================================================= */}
      <div 
        id="yhr-zones-slider"
        className="w-full h-full will-change-transform transition-transform duration-650 ease-[cubic-bezier(0.2,0.9,0.3,1)] flex flex-col"
        style={{
          transform: `translate3d(0, -${activeZoneIndex * 100}%, 0)`,
        }}
      >
        {/* ----------------------------------------------------------------------- */}
        {/* ZONE 1: GIỚI THIỆU                                                     */}
        {/* ----------------------------------------------------------------------- */}
        <section 
          id="yhr-zone-intro"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => goToZone(1)}
        >
          <div className="relative z-10 flex flex-col items-center justify-center max-w-3xl sm:max-w-4xl px-6 sm:px-10 md:px-14 text-center pointer-events-none select-none">
            {/* Logo CLB */}
            <img
              src={USSH_YHR_LOGO_URL}
              alt="Logo CLB Nguồn Nhân Lực Trẻ USSH"
              referrerPolicy="no-referrer"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain select-none pointer-events-none rounded-none mb-6 sm:mb-8"
            />

            {/* Tiêu đề */}
            <h1 className="font-archivo font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight text-white mb-5 sm:mb-6 leading-tight">
              {isEn ? (
                <>
                  YOUNG HUMAN RESOURCES CLUB
                  <br />
                  <span className="text-white/90">HCMUSSH</span>
                </>
              ) : (
                <>
                  CLB NGUỒN NHÂN LỰC TRẺ
                  <br />
                  <span className="text-white/90">TRƯỜNG ĐH KHXH&NV, ĐHQG-HCM</span>
                </>
              )}
            </h1>

            {/* Lời giới thiệu */}
            <p 
              className="font-archivo font-normal text-xs sm:text-sm md:text-base lg:text-lg text-white/85 leading-relaxed sm:leading-loose text-justify sm:text-center max-w-2xl sm:max-w-3xl"
            >
              {isEn
                ? 'As an organization operating under the Center for Student Services and Entrepreneurship (CSSE), the Young Human Resources Club has made substantial contributions to career orientation and student support at the University of Social Sciences and Humanities, Vietnam National University Ho Chi Minh City (HCMUSSH), as well as numerous other universities and colleges across Ho Chi Minh City since 2010.'
                : 'Là tổ chức trực thuộc Trung tâm Hỗ trợ người học và Khởi nghiệp (CSSE), Câu lạc bộ Nguồn Nhân Lực Trẻ đã có nhiều đóng góp trong công tác định hướng nghề nghiệp và hỗ trợ người học tại trường ĐH KHXH&NV, ĐHQG-HCM và các trường đại học, cao đẳng khác trên địa bàn TP.HCM từ năm 2010.'}
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* ZONE 2: MOODBOARD FULL MÀN HÌNH (CANVA EMBED)                          */}
        {/* ----------------------------------------------------------------------- */}
        <section 
          id="yhr-zone-moodboard"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex items-center justify-center overflow-hidden bg-black"
        >
          <div className="w-full h-full relative">
            <iframe 
              loading="lazy" 
              className="w-full h-full border-none p-0 m-0 rounded-none bg-black block"
              src="https://www.canva.com/design/DAHXaVDlX6w/tUW8-UvnWPbu5Fd5Fv_PrQ/view?embed" 
              allowFullScreen
              allow="fullscreen"
              title="[YHR] MOODBOARD CHO POSTER CHIẾT TỰ"
            />
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* ZONE 3: THÀNH PHẨM                                                      */}
        {/* - Desktop: Chiều rộng 2 ảnh ngang + gap = chiều rộng của ảnh dọc        */}
        {/* - Mobile: Cả 4 ảnh trình bày theo chiều dọc, scale chiều rộng bằng nhau */}
        {/* ----------------------------------------------------------------------- */}
        <section 
          id="yhr-zone-products"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex items-center justify-center overflow-hidden px-3 sm:px-6 md:px-10 bg-black select-none pointer-events-none"
        >
          {/* ===================================================================== */}
          {/* 1. DESKTOP / TABLET LAYOUT (sm:flex):                                 */}
          {/*    3 cột có cùng chiều rộng bằng nhau:                                */}
          {/*    - Cột 1: 2 ảnh ngang (Bìa chính + Khung nội dung) nằm TRÊN - DƯỚI, */}
          {/*      chiều rộng 2 ảnh ngang = chiều rộng của ảnh dọc.                 */}
          {/*    - Cột 2: Poster bổ trợ (dọc, aspect 3:4).                         */}
          {/*    - Cột 3: Poster chính (dọc, aspect 3:4).                          */}
          {/* ===================================================================== */}
          {/* ===================================================================== */}
          {/* 1. DESKTOP / TABLET LAYOUT (sm:flex):                                 */}
          {/*    TẤT CẢ CÁC GAP GIỮA CÁC ẢNH ĐỀU HOÀN TOÀN BẰNG NHAU:                */}
          {/*    - Gap giữa Cột 1 và Cột 2 = Gap giữa Cột 2 và Cột 3                 */}
          {/*    - Gap giữa 2 ảnh ngang trong Cột 1 = đúng bằng gap giữa các cột     */}
          {/* ===================================================================== */}
          <div 
            id="yhr-products-desktop-layout"
            style={{ ['--product-gap' as any]: 'clamp(14px, 1.6vw, 24px)' }}
            className="hidden sm:flex items-center justify-center gap-[var(--product-gap)] w-full max-w-[min(94vw,calc((var(--vh,1vh)*100-8.5rem)*2.25))] h-[min(calc(var(--vh,1vh)*100-8.5rem),calc(94vw/2.25))] select-none overflow-hidden mx-auto my-auto pointer-events-auto"
          >
            {/* Cột 1: Chứa 2 ảnh ngang nằm TRÊN - DƯỚI, gap bằng đúng var(--product-gap) */}
            <div className="flex-1 min-w-0 max-w-[calc((var(--vh,1vh)*100-8.5rem)*0.75)] flex flex-col items-center justify-center gap-[var(--product-gap)] overflow-hidden shrink-0">
              {/* Ảnh ngang 1: Bìa chính booklet slide (nằm trên) */}
              <div className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
                <img
                  src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20B%C3%8CA%20CH%C3%8DNH%20BOOKLET_SLIDE.webp"
                  alt="[YHR] Bìa chính booklet slide"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-contain rounded-none select-none pointer-events-none"
                />
              </div>

              {/* Ảnh ngang 2: Khung nội dung booklet slide (nằm dưới) */}
              <div className="w-full aspect-[16/9] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
                <img
                  src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20KHUNG%20N%E1%BB%98I%20DUNG%20BOOKLET_SLIDE.webp"
                  alt="[YHR] Khung nội dung booklet slide"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-contain rounded-none select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Cột 2: Poster bổ trợ (dọc, 3:4, chiều rộng bằng đúng Cột 1) */}
            <div className="flex-1 min-w-0 max-w-[calc((var(--vh,1vh)*100-8.5rem)*0.75)] flex flex-col items-center justify-center overflow-hidden shrink-0">
              <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden bg-neutral-950 shrink-0">
                <img
                  src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20POSTER%20B%E1%BB%94%20TR%E1%BB%A2.webp"
                  alt="[YHR] Poster bổ trợ"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-contain rounded-none select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Cột 3: Poster chính (dọc, 3:4, chiều rộng bằng đúng Cột 1) */}
            <div className="flex-1 min-w-0 max-w-[calc((var(--vh,1vh)*100-8.5rem)*0.75)] flex flex-col items-center justify-center overflow-hidden shrink-0">
              <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden bg-neutral-950 shrink-0">
                <img
                  src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20POSTER%20CH%C3%8DNH.webp"
                  alt="[YHR] Poster chính"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-contain rounded-none select-none pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. MOBILE LAYOUT (sm:hidden):                                         */}
          {/*    Cả 4 ảnh trình bày theo chiều dọc, chiều rộng cả 4 cái bằng nhau,  */}
          {/*    tất cả các khoảng cách giữa các ảnh đều bằng nhau (16px).          */}
          {/* ===================================================================== */}
          <div 
            id="yhr-products-mobile-layout"
            style={{ ['--product-gap-mobile' as any]: '16px' }}
            className="flex sm:hidden flex-col items-center justify-start gap-[var(--product-gap-mobile)] w-full h-full pt-16 pb-20 px-4 overflow-y-auto overflow-x-hidden no-scrollbar pointer-events-auto select-none"
          >
            {/* Ảnh 1: Bìa chính booklet slide (ngang, scale full width) */}
            <div className="w-full max-w-[310px] aspect-[16/9] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20B%C3%8CA%20CH%C3%8DNH%20BOOKLET_SLIDE.webp"
                alt="[YHR] Bìa chính booklet slide"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain rounded-none select-none pointer-events-none"
              />
            </div>

            {/* Ảnh 2: Khung nội dung booklet slide (ngang, scale full width) */}
            <div className="w-full max-w-[310px] aspect-[16/9] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20KHUNG%20N%E1%BB%98I%20DUNG%20BOOKLET_SLIDE.webp"
                alt="[YHR] Khung nội dung booklet slide"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain rounded-none select-none pointer-events-none"
              />
            </div>

            {/* Ảnh 3: Poster bổ trợ (dọc, scale cùng width với các ảnh ngang) */}
            <div className="w-full max-w-[310px] aspect-[3/4] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20POSTER%20B%E1%BB%94%20TR%E1%BB%A2.webp"
                alt="[YHR] Poster bổ trợ"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain rounded-none select-none pointer-events-none"
              />
            </div>

            {/* Ảnh 4: Poster chính (dọc, scale cùng width với các ảnh ngang) */}
            <div className="w-full max-w-[310px] aspect-[3/4] flex items-center justify-center overflow-hidden shrink-0 bg-neutral-950">
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BYHR%5D%20CHI%E1%BA%BET%20T%E1%BB%B0/%5BYHR%5D%20POSTER%20CH%C3%8DNH.webp"
                alt="[YHR] Poster chính"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain rounded-none select-none pointer-events-none"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
