import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppLanguage } from '../types';
import Lanyard from './Lanyard';
import { CHV_MAJOR_BADGES, ChvMajorBadge, REIMAGINED_PROJECTS } from '../data/chvBadges';
import { UsshDocumentViewer } from './UsshDocumentViewer';

interface ReimaginedIntroScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export type ReimaginedZone = 'zone-main' | 'zone-chv' | 'zone-ussh';

export const ReimaginedIntroScreen: React.FC<ReimaginedIntroScreenProps> = ({
  onBack,
  language = 'vi',
}) => {
  const isEn = language === 'en';
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);
  const [selectedMajor, setSelectedMajor] = useState<ChvMajorBadge>(CHV_MAJOR_BADGES[0]);
  const [usshMode, setUsshMode] = useState<'3d' | 'flat'>('3d');

  const REIMAGINED_ZONES: ReimaginedZone[] = ['zone-main', 'zone-chv', 'zone-ussh'];
  const activeZone = REIMAGINED_ZONES[activeZoneIndex];

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

  // Cuộn chuột / trackpad: 1 lần cuộn = sang đúng 1 zone, có debounce chống trượt lố
  useEffect(() => {
    const container = document.getElementById('scene-reimagined-pure-black');
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      // Không can thiệp nếu đang thao tác zoom/scroll bên trong khung dàn phẳng
      const target = e.target as HTMLElement;
      if (target.closest('#ussh-viewer-flat-carousel')) return;

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
    const container = document.getElementById('scene-reimagined-pure-black');
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

  return (
    <div 
      id="scene-reimagined-pure-black"
      className="absolute inset-0 bg-black z-50 select-none overflow-hidden overscroll-none text-white"
    >
      {/* Nút 'trở về' / 'back' tối giản, cố định góc trên bên trái xuyên suốt mọi zone */}
      <button
        type="button"
        id="reimagined-back-to-toc-button"
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-50 font-archivo font-normal normal-case text-xs md:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none pointer-events-auto"
        title={isEn ? 'Back to table of contents' : 'Quay về mục lục'}
      >
        {isEn ? 'back' : 'trở về'}
      </button>

      {/* Nút 'đặt lại thu phóng' (Desktop) ở góc dưới bên phải khi ở Zone USSH dạng dàn phẳng */}
      {activeZone === 'zone-ussh' && usshMode === 'flat' && (
        <button
          type="button"
          id="ussh-reset-zoom-desktop"
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('blvd-reset-zoom'));
          }}
          className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-[60] hidden md:flex items-center font-archivo font-normal normal-case text-xs sm:text-sm md:text-base tracking-normal text-white/40 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none pointer-events-auto"
          title={isEn ? 'Reset zoom' : 'Đặt lại thu phóng'}
        >
          {isEn ? 'reset zoom' : 'đặt lại thu phóng'}
        </button>
      )}

      {/* Thanh chuyển chế độ (mô hình 3d / dàn phẳng) ở cạnh dưới màn hình cho Zone USSH tương tự #BLVD */}
      {activeZone === 'zone-ussh' && (
        <div 
          id="reimagined-ussh-bottom-mode-text"
          className="fixed bottom-6 md:bottom-8 inset-x-0 z-50 flex items-center justify-center gap-6 md:gap-8 select-none pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setUsshMode('3d')}
            className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer ${
              usshMode === '3d' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isEn ? '3d model' : 'mô hình 3d'}
          </button>
          <button
            type="button"
            onClick={() => setUsshMode('flat')}
            className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer ${
              usshMode === 'flat' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isEn ? 'flat layout' : 'dàn phẳng'}
          </button>
        </div>
      )}

      {/* CONTAINER TRƯỢT 3 ZONE DỌC TỪNG ZONE MỘT (chuẩn #blvd) */}
      <div 
        id="reimagined-zones-slider"
        className="w-full h-full will-change-transform transition-transform duration-650 ease-[cubic-bezier(0.2,0.9,0.3,1)] flex flex-col"
        style={{
          transform: `translate3d(0, -${activeZoneIndex * 100}%, 0)`,
        }}
      >
        {/* ========================================================================= */}
        {/* ZONE 1 (Đầu tiên): Chữ [REIMAGINED] kéo dãn to tràn màn hình chuẩn #BLVD */}
        {/* ========================================================================= */}
        <section 
          id="reimagined-zone-main"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => goToZone(1)}
        >
          <svg 
            viewBox="0 0 780 100" 
            className="w-full h-full max-h-[85vh] px-2" 
            preserveAspectRatio="none"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-archivo font-black select-none pointer-events-none"
              fontSize="92"
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="1.2"
            >
              [REIMAGINED]
            </text>
          </svg>
        </section>

        {/* ========================================================================= */}
        {/* ZONE 2: CHV - Mô hình 3D Lanyard xoay ngang đặt ở CHÍNH GIỮA MÀN HÌNH     */}
        {/* ========================================================================= */}
        <section 
          id="reimagined-zone-chv"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Model 3D Lanyard nằm ở vị trí trung tâm màn hình */}
          <div 
            id="chv-3d-lanyard-container"
            className="w-full h-full flex items-center justify-center relative select-none"
          >
            <Lanyard
              key={selectedMajor.id}
              position={[0, 0, 18]}
              gravity={[0, -40, 0]}
              fov={20}
              orientation="landscape"
              aspectRatio={REIMAGINED_PROJECTS.chvBadge.aspectRatio}
              frontImage={selectedMajor.frontUrl}
              backImage={selectedMajor.backUrl}
              lanyardImage="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=1200&q=80"
              imageFit="cover"
              transparent={true}
              className="w-full h-[74vh] sm:h-[78vh] md:h-[82vh] lg:h-[86vh]"
            />
          </div>

          {/* Thanh chuyển đổi 11 môn chuyên nằm ở cạnh dưới */}
          <div 
            id="chv-subject-switcher-bar"
            className="absolute bottom-6 md:bottom-8 inset-x-0 z-40 flex items-center justify-center gap-1 sm:gap-2 px-4 overflow-x-auto no-scrollbar select-none"
          >
            {CHV_MAJOR_BADGES.map((major) => {
              const isSelected = major.id === selectedMajor.id;
              return (
                <button
                  key={major.id}
                  type="button"
                  id={`btn-major-${major.id}`}
                  onClick={() => setSelectedMajor(major)}
                  className={`shrink-0 px-2 sm:px-3 py-1 text-xs font-archivo tracking-normal transition-all duration-150 cursor-pointer rounded-none border-b-2 outline-none select-none ${
                    isSelected
                      ? 'text-white font-medium border-[#89CC04] bg-white/10'
                      : 'text-white/40 hover:text-white/80 border-transparent hover:border-white/20 bg-transparent'
                  }`}
                  title={isEn ? major.nameEn : major.nameVi}
                >
                  <span className="text-[#89CC04] mr-1 font-normal select-none">{major.index}</span>
                  <span>{isEn ? major.shortEn : major.shortVi}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ZONE 3: USSH - Mô hình 3D & Dạng Dàn Phẳng Thư Chúc Mừng (chuẩn #BLVD)   */}
        {/* ========================================================================= */}
        <section 
          id="reimagined-zone-ussh"
          className="relative w-full h-[calc(var(--vh,1vh)*100)] shrink-0 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Nội dung trung tâm: Mô hình 3D xoay 360 độ hoặc Dàn phẳng carousel */}
          <div className="w-full h-full flex items-center justify-center relative select-none px-4">
            <UsshDocumentViewer
              id="ussh-viewer"
              mode={usshMode}
              frontUrl={REIMAGINED_PROJECTS.hcmusshLetter.frontUrl}
              backUrl={REIMAGINED_PROJECTS.hcmusshLetter.backUrl}
            />
          </div>
        </section>

      </div>
    </div>
  );
};
