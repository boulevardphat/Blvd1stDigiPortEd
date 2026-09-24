import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage } from '../types';
import { GiftCard3D } from './GiftCard3D';

interface OthersForPhatScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

// ============================================================================
// DỮ LIỆU HÌNH ẢNH CỦA CÁC DỰ ÁN CÁ NHÂN (CHO PHÁT)
// ============================================================================

// 1. Đà Lạt #BLVD16 (8 ảnh vuông 1:1)
const DALAT_BLVD16_IMAGES = [
  { id: 'dalat-16-1', num: '01', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/1.webp' },
  { id: 'dalat-16-2', num: '02', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/2.webp' },
  { id: 'dalat-16-3', num: '03', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/3.webp' },
  { id: 'dalat-16-4', num: '04', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/4.webp' },
  { id: 'dalat-16-5', num: '05', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/5.webp' },
  { id: 'dalat-16-6', num: '06', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/6.webp' },
  { id: 'dalat-16-7', num: '07', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/7.webp' },
  { id: 'dalat-16-8', num: '08', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD16/8.webp' },
];

// 2. Đà Lạt #BLVD17 (5 ảnh nguyên bản, mỗi ảnh là 1 cụm gồm 2 ảnh vuông, tỉ lệ chuẩn 6685/3500)
const DALAT_BLVD17_IMAGES = [
  { id: 'dalat-17-1', num: '01', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD17/1.webp' },
  { id: 'dalat-17-2', num: '02', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD17/2.webp' },
  { id: 'dalat-17-3', num: '03', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD17/3.webp' },
  { id: 'dalat-17-4', num: '04', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD17/4.webp' },
  { id: 'dalat-17-5', num: '05', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Thuan%20Phat%2C%20Boulevard%20et%20ville%20de%20Da%20Lat/%23BLVD17/5.webp' },
];

// 3. Museum of Fine Arts (6 ảnh vuông 1:1)
const MFA_IMAGES = [
  { id: 'mfa-1', num: '01', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/1.webp' },
  { id: 'mfa-2', num: '02', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/2.webp' },
  { id: 'mfa-3', num: '03', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/3.webp' },
  { id: 'mfa-4', num: '04', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/4.webp' },
  { id: 'mfa-5', num: '05', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/5.webp' },
  { id: 'mfa-6', num: '06', url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/6.webp', fallback: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/Museum%20of%20Fine%20Arts/5.webp' },
];

// 4. Kỉ yếu 12A2 (Thẻ quà tặng & Thư mời)
const YEARBOOK_BADGE_FRONT = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/K%E1%BB%89%20y%E1%BA%BFu/M%E1%BA%B7t%20tr%C6%B0%E1%BB%9Bc%20th%E1%BA%BB%20qu%C3%A0.webp';
const YEARBOOK_BADGE_BACK = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/K%E1%BB%89%20y%E1%BA%BFu/M%E1%BA%B7t%20sau%20th%E1%BA%BB%20qua.webp';
const YEARBOOK_INVITATION_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/K%E1%BB%89%20y%E1%BA%BFu/Th%C6%B0%20m%E1%BB%9Di.webp';

// 5. Bảo vệ môi trường
const BVMT_POSTER_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/B%E1%BA%A3o%20v%E1%BB%87%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng/b%E1%BA%A3o%20v%E1%BB%87%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng.webp';

export const OthersForPhatScreen: React.FC<OthersForPhatScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  // --- STATE DỰ ÁN 01: ĐÀ LẠT #BLVD16 ---
  const [blvd16ViewMode, setBlvd16ViewMode] = useState<'instagram' | 'linear'>('instagram');
  const [blvd16SlideIndex, setBlvd16SlideIndex] = useState(0);
  const blvd16CarouselRef = useRef<HTMLDivElement>(null);
  const blvd16LinearRef = useRef<HTMLDivElement>(null);

  // --- STATE DỰ ÁN 02: ĐÀ LẠT #BLVD17 ---
  const [blvd17ViewMode, setBlvd17ViewMode] = useState<'instagram' | 'linear'>('instagram');
  const [blvd17SlideIndex, setBlvd17SlideIndex] = useState(0);
  const blvd17CarouselRef = useRef<HTMLDivElement>(null);
  const blvd17LinearRef = useRef<HTMLDivElement>(null);

  // --- STATE DỰ ÁN 03: MUSEUM OF FINE ARTS ---
  const [mfaViewMode, setMfaViewMode] = useState<'instagram' | 'linear'>('instagram');
  const [mfaSlideIndex, setMfaSlideIndex] = useState(0);
  const mfaCarouselRef = useRef<HTMLDivElement>(null);
  const mfaLinearRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // XỬ LÝ ĐIỀU HƯỚNG CAROUSEL BLVD16
  // ============================================================================
  const handleBlvd16Scroll = () => {
    if (!blvd16CarouselRef.current) return;
    const { scrollLeft, clientWidth } = blvd16CarouselRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setBlvd16SlideIndex(Math.max(0, Math.min(idx, DALAT_BLVD16_IMAGES.length - 1)));
    }
  };

  const scrollBlvd16To = (index: number) => {
    if (!blvd16CarouselRef.current) return;
    const target = Math.max(0, Math.min(index, DALAT_BLVD16_IMAGES.length - 1));
    blvd16CarouselRef.current.scrollTo({
      left: target * blvd16CarouselRef.current.clientWidth,
      behavior: 'smooth',
    });
    setBlvd16SlideIndex(target);
  };

  // ============================================================================
  // XỬ LÝ ĐIỀU HƯỚNG CAROUSEL BLVD17 (5 ảnh nguyên bản)
  // ============================================================================
  const handleBlvd17Scroll = () => {
    if (!blvd17CarouselRef.current) return;
    const { scrollLeft, clientWidth } = blvd17CarouselRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setBlvd17SlideIndex(Math.max(0, Math.min(idx, DALAT_BLVD17_IMAGES.length - 1)));
    }
  };

  const scrollBlvd17To = (index: number) => {
    if (!blvd17CarouselRef.current) return;
    const target = Math.max(0, Math.min(index, DALAT_BLVD17_IMAGES.length - 1));
    blvd17CarouselRef.current.scrollTo({
      left: target * blvd17CarouselRef.current.clientWidth,
      behavior: 'smooth',
    });
    setBlvd17SlideIndex(target);
  };

  // ============================================================================
  // XỬ LÝ ĐIỀU HƯỚNG CAROUSEL MFA
  // ============================================================================
  const handleMfaScroll = () => {
    if (!mfaCarouselRef.current) return;
    const { scrollLeft, clientWidth } = mfaCarouselRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setMfaSlideIndex(Math.max(0, Math.min(idx, MFA_IMAGES.length - 1)));
    }
  };

  const scrollMfaTo = (index: number) => {
    if (!mfaCarouselRef.current) return;
    const target = Math.max(0, Math.min(index, MFA_IMAGES.length - 1));
    mfaCarouselRef.current.scrollTo({
      left: target * mfaCarouselRef.current.clientWidth,
      behavior: 'smooth',
    });
    setMfaSlideIndex(target);
  };

  // Hỗ trợ cuộn ngang bằng con lăn chuột cho dải linear
  const setupWheelScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  };

  useEffect(() => {
    const clean16 = setupWheelScroll(blvd16LinearRef);
    const clean17 = setupWheelScroll(blvd17LinearRef);
    const cleanMfa = setupWheelScroll(mfaLinearRef);
    return () => {
      clean16?.();
      clean17?.();
      cleanMfa?.();
    };
  }, [blvd16ViewMode, blvd17ViewMode, mfaViewMode]);

  return (
    <div 
      id="scene-others-for-phat"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-for-phat-back-desktop"
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
          id="btn-for-phat-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Others' : 'Trở về danh mục Khác'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-28 flex flex-col items-center">
        
        {/* Header tiêu đề chính: CHO PHÁT */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-1">
            {isEn ? 'FOR PHAT' : 'CHO PHÁT'}
          </h1>
          <span className="font-archivo font-normal text-xs sm:text-sm text-[#89CC04] uppercase tracking-wider">
            {isEn ? 'INDIVIDUAL PROJECTS & VISUAL SERIES' : 'DỰ ÁN CÁ NHÂN & ẤN PHẨM HÌNH ẢNH'}
          </span>
        </div>

        {/* Danh sách các dự án học theo phong cách từng sự kiện trong HVOC */}
        <div className="w-full flex flex-col gap-16 sm:gap-20 md:gap-24">

          {/* ========================================================= */}
          {/* DỰ ÁN 01: THUẬN PHÁT, BOULEVARD VÀ ĐÀ LẠT (#BLVD16) */}
          {/* ========================================================= */}
          <div id="project-dalat-16" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 01 */}
            <div className="w-full flex items-baseline justify-between pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  01
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? 'THUAN PHAT, BOULEVARD ET VILLE DE DA LAT (#BLVD16)' : 'THUẬN PHÁT, BOULEVARD VÀ ĐÀ LẠT (#BLVD16)'}
                </span>
                {/* Tool icons */}
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <img 
                    src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                    alt="Canva"
                    title="Canva"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://i.ibb.co/pBXrq6cf/affinity.jpg"
                    alt="Affinity"
                    title="Affinity"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Nội dung ảnh Đà Lạt #BLVD16 */}
            <div className="w-full flex flex-col items-center">
              {blvd16ViewMode === 'instagram' ? (
                /* CHẾ ĐỘ 1: INSTAGRAM (Khung vuông 1:1, chuẩn thị giác #BLVD) */
                <div className="w-full flex flex-col items-center">
                  <div className="relative overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 rounded-none group w-[min(88vw,440px)] aspect-square">
                    {/* Track cuộn ngang snap mượt mà */}
                    <div
                      ref={blvd16CarouselRef}
                      onScroll={handleBlvd16Scroll}
                      className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
                      style={{
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      {DALAT_BLVD16_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="w-full h-full min-w-full shrink-0 snap-start snap-always relative bg-black flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt={`Đà Lạt 16 - ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Nút điều hướng Trái (<) xuất hiện khi hover theo chuẩn #BLVD */}
                    <button
                      type="button"
                      onClick={() => scrollBlvd16To(blvd16SlideIndex - 1)}
                      disabled={blvd16SlideIndex === 0}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        blvd16SlideIndex === 0 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Previous' : 'Trước'}
                    >
                      ‹
                    </button>

                    {/* Nút điều hướng Phải (>) xuất hiện khi hover theo chuẩn #BLVD */}
                    <button
                      type="button"
                      onClick={() => scrollBlvd16To(blvd16SlideIndex + 1)}
                      disabled={blvd16SlideIndex === DALAT_BLVD16_IMAGES.length - 1}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        blvd16SlideIndex === DALAT_BLVD16_IMAGES.length - 1 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Next' : 'Tiếp'}
                    >
                      ›
                    </button>

                    {/* Chỉ số trang góc trên bên phải */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[11px] font-archivo font-medium text-white/90 rounded-none z-10 border border-white/10 select-none">
                      {blvd16SlideIndex + 1} / {DALAT_BLVD16_IMAGES.length}
                    </div>
                  </div>

                  {/* Thanh gạch định vị (Dash lines) dưới ảnh chuẩn #BLVD */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 select-none">
                    {DALAT_BLVD16_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollBlvd16To(idx)}
                        className={`h-[2px] transition-all duration-200 rounded-none cursor-pointer border-none p-0 outline-none ${
                          idx === blvd16SlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ 2: TUYẾN TÍNH (Dải trượt ngang không khoảng cách chuẩn #BLVD) */
                <div className="w-full flex flex-col items-center">
                  <div
                    ref={blvd16LinearRef}
                    className="w-full flex items-center overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing border-y border-white/20 bg-[#111] py-2 px-4 select-none"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div className="flex items-center gap-0 w-max shrink-0">
                      {DALAT_BLVD16_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="shrink-0 relative overflow-hidden bg-black border-r border-white/10"
                          style={{
                            width: 'clamp(140px, 22vw, 220px)',
                            aspectRatio: '1 / 1',
                          }}
                        >
                          <img
                            src={img.url}
                            alt={`Đà Lạt 16 - ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="font-archivo text-[11px] text-white/40 mt-2 lowercase select-none">
                    {isEn ? '(drag or scroll horizontally to view)' : '(kéo chuột hoặc vuốt ngang để xem)'}
                  </span>
                </div>
              )}

              {/* THANH CHUYỂN ĐỔI TUYẾN TÍNH / INSTAGRAM NẰM Ở DƯỚI ẢNH THEO CHUẨN #BLVD */}
              <div className="flex items-center justify-center gap-4 mt-5 select-none">
                <button
                  type="button"
                  onClick={() => setBlvd16ViewMode('linear')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    blvd16ViewMode === 'linear' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {isEn ? 'linear' : 'tuyến tính'}
                </button>
                <button
                  type="button"
                  onClick={() => setBlvd16ViewMode('instagram')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    blvd16ViewMode === 'instagram' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  Instagram
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DỰ ÁN 02: THUẬN PHÁT, BOULEVARD VÀ ĐÀ LẠT (#BLVD17) */}
          {/* ========================================================= */}
          <div id="project-dalat-17" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 02 */}
            <div className="w-full flex items-baseline justify-between pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  02
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? 'THUAN PHAT, BOULEVARD ET VILLE DE DA LAT (#BLVD17)' : 'THUẬN PHÁT, BOULEVARD VÀ ĐÀ LẠT (#BLVD17)'}
                </span>
                {/* Tool icons */}
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <img 
                    src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                    alt="Canva"
                    title="Canva"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://i.ibb.co/pBXrq6cf/affinity.jpg"
                    alt="Affinity"
                    title="Affinity"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Nội dung ảnh Đà Lạt #BLVD17 */}
            <div className="w-full flex flex-col items-center">
              {blvd17ViewMode === 'instagram' ? (
                /* CHẾ ĐỘ 1: INSTAGRAM (Hiển thị đầy đủ nguyên vẹn cả cụm ảnh đôi, không bị cắt đôi, tỉ lệ chuẩn 6685/3500) */
                <div className="w-full flex flex-col items-center">
                  <div className="relative overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 rounded-none group w-[min(94vw,620px)] aspect-[6685/3500]">
                    {/* Track cuộn ngang snap */}
                    <div
                      ref={blvd17CarouselRef}
                      onScroll={handleBlvd17Scroll}
                      className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
                      style={{
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      {DALAT_BLVD17_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="w-full h-full min-w-full shrink-0 snap-start snap-always relative bg-black flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt={`Đà Lạt 17 - ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Nút điều hướng Trái (<) */}
                    <button
                      type="button"
                      onClick={() => scrollBlvd17To(blvd17SlideIndex - 1)}
                      disabled={blvd17SlideIndex === 0}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        blvd17SlideIndex === 0 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Previous' : 'Trước'}
                    >
                      ‹
                    </button>

                    {/* Nút điều hướng Phải (>) */}
                    <button
                      type="button"
                      onClick={() => scrollBlvd17To(blvd17SlideIndex + 1)}
                      disabled={blvd17SlideIndex === DALAT_BLVD17_IMAGES.length - 1}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        blvd17SlideIndex === DALAT_BLVD17_IMAGES.length - 1 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Next' : 'Tiếp'}
                    >
                      ›
                    </button>

                    {/* Chỉ số trang góc trên bên phải */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[11px] font-archivo font-medium text-white/90 rounded-none z-10 border border-white/10 select-none">
                      {blvd17SlideIndex + 1} / {DALAT_BLVD17_IMAGES.length}
                    </div>
                  </div>

                  {/* Thanh gạch định vị (Dash lines) dưới ảnh */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 select-none">
                    {DALAT_BLVD17_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollBlvd17To(idx)}
                        className={`h-[2px] transition-all duration-200 rounded-none cursor-pointer border-none p-0 outline-none ${
                          idx === blvd17SlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ 2: TUYẾN TÍNH (Hiển thị dải phẳng nguyên vẹn các cụm ảnh đôi chuẩn #BLVD) */
                <div className="w-full flex flex-col items-center">
                  <div
                    ref={blvd17LinearRef}
                    className="w-full flex items-center overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing border-y border-white/20 bg-[#111] py-2 px-4 select-none"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div className="flex items-center gap-0 w-max shrink-0">
                      {DALAT_BLVD17_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="shrink-0 relative overflow-hidden bg-black border-r border-white/10"
                          style={{
                            width: 'clamp(260px, 40vw, 380px)',
                            aspectRatio: '6685 / 3500',
                          }}
                        >
                          <img
                            src={img.url}
                            alt={`Đà Lạt 17 - ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="font-archivo text-[11px] text-white/40 mt-2 lowercase select-none">
                    {isEn ? '(drag or scroll horizontally to view)' : '(kéo chuột hoặc vuốt ngang để xem)'}
                  </span>
                </div>
              )}

              {/* THANH CHUYỂN ĐỔI TUYẾN TÍNH / INSTAGRAM NẰM Ở DƯỚI ẢNH THEO CHUẨN #BLVD */}
              <div className="flex items-center justify-center gap-4 mt-5 select-none">
                <button
                  type="button"
                  onClick={() => setBlvd17ViewMode('linear')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    blvd17ViewMode === 'linear' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {isEn ? 'linear' : 'tuyến tính'}
                </button>
                <button
                  type="button"
                  onClick={() => setBlvd17ViewMode('instagram')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    blvd17ViewMode === 'instagram' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  Instagram
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DỰ ÁN 03: MUSEUM OF FINE ARTS (BẢO TÀNG NGHỆ THUẬT) */}
          {/* ========================================================= */}
          <div id="project-mfa" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 03 */}
            <div className="w-full flex items-baseline justify-between pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  03
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? 'MUSEUM OF FINE ARTS' : 'BẢO TÀNG NGHỆ THUẬT (MUSEUM OF FINE ARTS)'}
                </span>
                {/* Tool icons */}
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <img 
                    src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                    alt="Canva"
                    title="Canva"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://i.ibb.co/N66hJX5h/ibispaint.png"
                    alt="ibisPaint"
                    title="ibisPaint"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Nội dung ảnh Museum of Fine Arts */}
            <div className="w-full flex flex-col items-center">
              {mfaViewMode === 'instagram' ? (
                /* CHẾ ĐỘ 1: INSTAGRAM (Khung vuông 1:1 chuẩn #BLVD) */
                <div className="w-full flex flex-col items-center">
                  <div className="relative overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 rounded-none group w-[min(88vw,440px)] aspect-square">
                    <div
                      ref={mfaCarouselRef}
                      onScroll={handleMfaScroll}
                      className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
                      style={{
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      {MFA_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="w-full h-full min-w-full shrink-0 snap-start snap-always relative bg-black flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt={`MFA ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              if (img.fallback) {
                                (e.currentTarget as HTMLImageElement).src = img.fallback;
                              }
                            }}
                            className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Nút điều hướng Trái (<) */}
                    <button
                      type="button"
                      onClick={() => scrollMfaTo(mfaSlideIndex - 1)}
                      disabled={mfaSlideIndex === 0}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        mfaSlideIndex === 0 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Previous' : 'Trước'}
                    >
                      ‹
                    </button>

                    {/* Nút điều hướng Phải (>) */}
                    <button
                      type="button"
                      onClick={() => scrollMfaTo(mfaSlideIndex + 1)}
                      disabled={mfaSlideIndex === MFA_IMAGES.length - 1}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 bg-black/75 border border-white/30 text-white flex items-center justify-center font-archivo text-base md:text-lg transition-all duration-200 rounded-none cursor-pointer opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
                        mfaSlideIndex === MFA_IMAGES.length - 1 ? 'pointer-events-none !opacity-0' : 'hover:bg-white hover:text-black active:scale-95'
                      }`}
                      title={isEn ? 'Next' : 'Tiếp'}
                    >
                      ›
                    </button>

                    {/* Chỉ số trang góc trên bên phải */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[11px] font-archivo font-medium text-white/90 rounded-none z-10 border border-white/10 select-none">
                      {mfaSlideIndex + 1} / {MFA_IMAGES.length}
                    </div>
                  </div>

                  {/* Thanh gạch định vị (Dash lines) dưới ảnh */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 select-none">
                    {MFA_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollMfaTo(idx)}
                        className={`h-[2px] transition-all duration-200 rounded-none cursor-pointer border-none p-0 outline-none ${
                          idx === mfaSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ 2: TUYẾN TÍNH (Dải trượt ngang liền mạch chuẩn #BLVD) */
                <div className="w-full flex flex-col items-center">
                  <div
                    ref={mfaLinearRef}
                    className="w-full flex items-center overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing border-y border-white/20 bg-[#111] py-2 px-4 select-none"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div className="flex items-center gap-0 w-max shrink-0">
                      {MFA_IMAGES.map((img) => (
                        <div
                          key={img.id}
                          className="shrink-0 relative overflow-hidden bg-black border-r border-white/10"
                          style={{
                            width: 'clamp(140px, 22vw, 220px)',
                            aspectRatio: '1 / 1',
                          }}
                        >
                          <img
                            src={img.url}
                            alt={`MFA ${img.num}`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              if (img.fallback) {
                                (e.currentTarget as HTMLImageElement).src = img.fallback;
                              }
                            }}
                            className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="font-archivo text-[11px] text-white/40 mt-2 lowercase select-none">
                    {isEn ? '(drag or scroll horizontally to view)' : '(kéo chuột hoặc vuốt ngang để xem)'}
                  </span>
                </div>
              )}

              {/* THANH CHUYỂN ĐỔI TUYẾN TÍNH / INSTAGRAM NẰM Ở DƯỚI ẢNH THEO CHUẨN #BLVD */}
              <div className="flex items-center justify-center gap-4 mt-5 select-none">
                <button
                  type="button"
                  onClick={() => setMfaViewMode('linear')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    mfaViewMode === 'linear' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {isEn ? 'linear' : 'tuyến tính'}
                </button>
                <button
                  type="button"
                  onClick={() => setMfaViewMode('instagram')}
                  className={`font-archivo font-normal normal-case text-sm md:text-base tracking-normal transition-colors duration-200 cursor-pointer pointer-events-auto rounded-none ${
                    mfaViewMode === 'instagram' ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  Instagram
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DỰ ÁN 04: KỈ YẾU 12A2 (CHUYỂN TỪ 12A2 SANG CÁ NHÂN THEO LỆNH) */}
          {/* ========================================================= */}
          <div id="project-kyeu" className="w-full flex flex-col items-start bg-transparent select-none">
            {/* Header Mục 04 */}
            <div className="w-full flex items-baseline justify-between pb-3 mb-6 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  04
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? '12A2 YEARBOOK' : 'KỈ YẾU 12A2'}
                </span>
                {/* Tool icons */}
                <div className="flex items-center gap-1.5 shrink-0 select-none">
                  <img 
                    src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                    alt="Canva"
                    title="Canva"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <img 
                    src="https://i.ibb.co/N66hJX5h/ibispaint.png"
                    alt="ibisPaint"
                    title="ibisPaint"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Sub-item A: THẺ QUÀ TẶNG KỈ YẾU (Mặc định 3D thật hơn, có bo góc, không thanh chuyển đổi) */}
            <div className="w-full mb-12 flex flex-col items-start">
              <div className="w-full flex items-baseline pb-2 mb-2 text-white">
                <span className="font-archivo font-semibold text-xs sm:text-sm uppercase text-neutral-300">
                  {isEn ? 'YEARBOOK GIFT CARD' : 'THẺ QUÀ TẶNG KỈ YẾU'}
                </span>
              </div>

              {/* Thẻ quà tặng 3D chân thực, bo góc, hiệu ứng bóng kính và tương tác lật mặt trực tiếp */}
              <GiftCard3D
                frontUrl={YEARBOOK_BADGE_FRONT}
                backUrl={YEARBOOK_BADGE_BACK}
                language={language}
              />
            </div>

            {/* Sub-item B: THƯ MỜI KỈ YẾU */}
            <div className="w-full flex flex-col items-start pt-6 border-t border-neutral-900">
              <div className="w-full flex items-baseline pb-2 mb-3 text-white">
                <span className="font-archivo font-semibold text-xs sm:text-sm uppercase text-neutral-300">
                  {isEn ? 'YEARBOOK INVITATION LETTER' : 'THƯ MỜI KỈ YẾU'}
                </span>
              </div>

              <div className="w-full max-w-[640px] mx-auto overflow-hidden bg-black rounded-none border border-neutral-900 flex items-center justify-center">
                <img 
                  src={YEARBOOK_INVITATION_URL}
                  alt="Thư mời kỉ yếu 12A2"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DỰ ÁN 05: BẢO VỆ MÔI TRƯỜNG */}
          {/* ========================================================= */}
          <div id="project-bvmt" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-3 mb-4 text-white border-none flex-wrap gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  05
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? 'ENVIRONMENTAL PROTECTION POSTER' : 'BẢO VỆ MÔI TRƯỜNG'}
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
                src={BVMT_POSTER_URL}
                alt="Bảo vệ môi trường"
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
