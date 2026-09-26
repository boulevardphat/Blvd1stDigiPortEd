import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppLanguage } from '../types';

declare global {
  interface Window {
    FB?: {
      init: (options: { xfbml: boolean; version: string; appId?: string }) => void;
      XFBML: {
        parse: (element?: HTMLElement | null) => void;
      };
    };
    fbAsyncInit?: () => void;
  }
}

interface OthersFor12A2ScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

// ============================================================================
// DỮ LIỆU ĐƯỜNG DẪN DỰ ÁN & TÀI NGUYÊN
// ============================================================================
// 1. Hậu Tốt nghiệp 2026: Facebook Reel (16:9)
const FB_REEL_HAU_TOT_NGHIEP_URL = 'https://www.facebook.com/reel/1364142485827244';

// 2. 19_11_2025: Poster kỷ niệm
const POSTER_19_11_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/%5BA2K28%5D%2020_10_2025/%5BA2K28%5D%2020_10_2025.webp';

// 3. Icon pack công cụ thực hiện
const ICON_CANVA = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp';
const ICON_IBISPAINT = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/ibispaint.webp';
const ICON_EDITS = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/edits.webp';

// 4. Ảnh minh họa quy trình từ GitHub
const WORKFLOW_STEP_0_IMG = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026%20%28B%C6%B0%E1%BB%9Bc%200%29.webp';
const WORKFLOW_STEP_1_IMG = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026%20(B%C6%B0%E1%BB%9Bc%201).webp';
const WORKFLOW_STEP_2_IMG = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Individual/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026/%5BA2K28%5D%20H%E1%BA%ADu%20T%E1%BB%91t%20nghi%E1%BB%87p%202026%20(B%C6%B0%E1%BB%9Bc%202).webp';

// ============================================================================
// SVG DỮ LIỆU SỐ KÉO DÃN (CHUẨN THEO MỤC LỤC - TOC_DIGIT_DATA)
// ============================================================================
const STEP_DIGIT_DATA: Record<number, { viewBox: string; d: string }> = {
  0: {
    viewBox: "50 0 475 710",
    d: "M288 710Q232 710 188 694Q144 677 113 637Q82 597 66 529Q50 460 50 355Q50 250 66 182Q82 113 113 73Q144 33 188 17Q232 0 288 0Q344 0 388 17Q431 33 462 73Q493 113 509 182Q525 250 525 355Q525 460 509 529Q493 597 462 637Q431 677 388 694Q344 710 288 710ZM288 610Q335 610 359 585Q382 559 391 509Q399 458 399 383L399 331Q399 254 391 203Q382 151 359 126Q335 100 288 100Q242 100 218 126Q193 151 185 202Q176 252 176 328L176 380Q176 456 185 508Q193 559 218 585Q242 610 288 610Z"
  },
  1: {
    viewBox: "105 0 519 689",
    d: "M624 689L105 689L105 535L268 535L268 224L105 224L105 108Q152 105 205.50 89Q259 73 310 49Q361 25 400 0L467 0L467 535L624 535"
  },
  2: {
    viewBox: "49 0 570 700",
    d: "M619 700L49 700L49 652Q49 610 67 572.50Q85 535 115.50 501.50Q146 468 183 437.50Q220 407 259 378Q299 348 334 323Q369 298 391 272Q413 246 413 214Q413 195 404 178.50Q395 162 376.50 151.50Q358 141 327 141Q296 141 274.50 153Q253 165 241.50 186.50Q230 208 230 235L230 255L52 255Q51 249 51 243.50Q51 238 51 233Q51 162 83.50 110Q116 58 181.50 29Q247 0 346 0Q407 0 456 14.50Q505 29 539.50 56.50Q574 84 592.50 122Q611 160 611 207Q611 253 594 290Q577 327 546 359Q515 391 475 421Q435 451 388 482Q364 498 349 508.50Q334 519 327 524Q320 529 318 531L619 531"
  },
  3: {
    viewBox: "42 0 583 712",
    d: "M335 712Q235 712 170 685Q105 658 73.50 613Q42 568 42 514L42 493L218 493L218 512Q218 538 243.50 556.50Q269 575 322 575Q380 575 403 549Q426 523 426 483Q426 458 416.50 442.50Q407 427 391.50 419Q376 411 356 411L283 411L283 288L340 288Q360 288 375.50 280Q391 272 400.50 256Q410 240 410 216Q410 195 400 177Q390 159 370.50 148Q351 137 322 137Q297 137 276 146.50Q255 156 243 171Q231 186 231 203L231 213L64 213L64 188Q64 136 96 93.50Q128 51 189.50 25.50Q251 0 339 0Q424 0 483.50 25.50Q543 51 574 93.50Q605 136 605 187Q605 221 592.50 252Q580 283 557.50 305.50Q535 328 505 339L505 343Q562 361 593.50 405.50Q625 450 625 513Q623 568 591.50 613Q560 658 497 685Q434 712 335 712"
  },
};

/**
 * Component trình chiếu Facebook Reel 16:9 qua Facebook SDK với khả năng co giãn responsive
 */
interface FacebookReelPlayerProps {
  reelUrl: string;
}

const FacebookReelPlayer: React.FC<FacebookReelPlayerProps> = ({ reelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  useEffect(() => {
    // 1. Đảm bảo phần tử fb-root tồn tại
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.prepend(fbRoot);
    }

    // 2. Phân giải XFBML bằng Facebook SDK
    const parseXfbml = () => {
      if (window.FB && containerRef.current) {
        try {
          window.FB.XFBML.parse(containerRef.current);
        } catch {
          setUseIframeFallback(true);
        }
      }
    };

    if (window.FB) {
      parseXfbml();
    } else {
      window.fbAsyncInit = () => {
        window.FB?.init({
          xfbml: true,
          version: 'v20.0',
        });
        parseXfbml();
      };

      if (!document.getElementById('facebook-jssdk')) {
        const js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v20.0';
        js.async = true;
        js.defer = true;
        js.crossOrigin = 'anonymous';
        js.onerror = () => {
          setUseIframeFallback(true);
        };
        document.body.appendChild(js);
      }
    }

    // Dự phòng an toàn nếu SDK bị chặn bởi adblock/trình duyệt
    const timer = setTimeout(() => {
      if (!window.FB) {
        setUseIframeFallback(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [reelUrl]);

  const encodedUrl = encodeURIComponent(reelUrl);
  const iframeSrc = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=1280&height=720&allowfullscreen=true&quality=hd`;

  return (
    <div className="w-full max-w-[850px] mx-auto aspect-video bg-black border border-white/10 rounded-none overflow-hidden relative shadow-2xl flex items-center justify-center">
      {useIframeFallback ? (
        <iframe
          src={iframeSrc}
          title="Hậu Tốt nghiệp 2026 Reel"
          className="w-full h-full border-0 rounded-none"
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      ) : (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
          <div
            className="fb-video w-full h-full"
            data-href={reelUrl}
            data-width="1280"
            data-show-text="false"
            data-allowfullscreen="true"
            data-autoplay="false"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Mục từng bước thực hiện với số kéo dãn responsive theo chiều cao text giống Mục lục
 */
interface WorkflowStepItemProps {
  digit: 0 | 1 | 2 | 3;
  text: string;
  icons?: { src: string; alt: string }[];
  imageSrc?: string;
  imageAlt?: string;
}

const WorkflowStepItem: React.FC<WorkflowStepItemProps> = ({
  digit,
  text,
  icons,
  imageSrc,
  imageAlt,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [metrics, setMetrics] = useState<{ height: number; marginTop: number } | null>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const update = () => {
      const computed = window.getComputedStyle(el);
      const fs = parseFloat(computed.fontSize) || 14;
      const lh = parseFloat(computed.lineHeight) || (fs * 1.4);
      const h = el.offsetHeight;
      const lines = Math.max(1, Math.round(h / lh));

      // Chuẩn typographic chính xác cho font Archivo:
      // capHeight: chiều cao chữ hoa ~ 0.70 của font-size
      // topOffset: khoảng cách từ đỉnh dòng (line box) đến đỉnh chữ hoa = (lineHeight - capHeight) / 2
      // height: tổng khoảng cách từ đỉnh chữ hoa dòng đầu đến baseline dòng cuối = (lines - 1) * lh + capHeight
      const capHeight = 0.70 * fs;
      const topOffset = (lh - capHeight) / 2;
      const height = (lines - 1) * lh + capHeight;

      setMetrics({
        height,
        marginTop: topOffset,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-row items-start gap-3 sm:gap-4.5 text-xs sm:text-sm md:text-base">
        {/* Số kéo dãn responsive theo số dòng text */}
        <span
          className="shrink-0 w-[1.1em] sm:w-[1.25em] flex items-center select-none"
          style={
            metrics
              ? { marginTop: `${metrics.marginTop}px`, height: `${metrics.height}px` }
              : { marginTop: '0.22em', height: '0.7em' }
          }
        >
          <svg
            viewBox={STEP_DIGIT_DATA[digit].viewBox}
            preserveAspectRatio="none"
            className="w-full h-full block fill-[#89CC04] select-none pointer-events-none"
          >
            <path d={STEP_DIGIT_DATA[digit].d} />
          </svg>
        </span>

        {/* Khối văn bản và icon công cụ */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p
              ref={textRef}
              className="font-archivo font-normal text-xs sm:text-sm md:text-base text-neutral-200 leading-[1.4] text-justify select-text"
            >
              {text}
            </p>
            {/* Tool icons tương ứng (nếu có) */}
            {icons && icons.length > 0 && (
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5 select-none">
                {icons.map((ic, idx) => (
                  <img
                    key={idx}
                    src={ic.src}
                    alt={ic.alt}
                    title={ic.alt}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain rounded-none select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ảnh minh họa từ GitHub (nếu có) */}
      {imageSrc && (
        <div className="w-full pl-[calc(1.1em+0.75rem)] sm:pl-[calc(1.25em+1.125rem)] pt-1 text-xs sm:text-sm md:text-base">
          <div className="w-full max-w-[540px] overflow-hidden bg-black border border-neutral-800 rounded-none shadow-xl">
            <img
              src={imageSrc}
              alt={imageAlt || 'Minh họa'}
              className="w-full h-auto object-contain select-none pointer-events-none rounded-none block"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const OthersFor12A2Screen: React.FC<OthersFor12A2ScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const mobileWorkflowScrollRef = useRef<HTMLDivElement>(null);

  // Đóng modal khi bấm phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWorkflowModalOpen) {
        setIsWorkflowModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWorkflowModalOpen]);

  // Cuộn lên đầu trang khi mở app "cách thực hiện" trên mobile
  useEffect(() => {
    if (isWorkflowModalOpen && mobileWorkflowScrollRef.current) {
      mobileWorkflowScrollRef.current.scrollTop = 0;
    }
  }, [isWorkflowModalOpen]);

  // Danh sách các bước thực hiện (tái sử dụng chung cho cả Mobile app và Desktop modal)
  const workflowStepsContent = (
    <>
      {/* Bước 0 */}
      <WorkflowStepItem
        digit={0}
        text={
          isEn
            ? 'Prepare media assets for editing.'
            : 'Chuẩn bị tư liệu chỉnh sửa.'
        }
        imageSrc={WORKFLOW_STEP_0_IMG}
        imageAlt="Bước 0 - Chuẩn bị tư liệu chỉnh sửa"
      />

      {/* Bước 1 */}
      <WorkflowStepItem
        digit={1}
        text={
          isEn
            ? 'Use Canva and ibisPaint to isolate each classmate from the background, setting a solid color backdrop (ensuring it does not match any subject colors).'
            : 'Dùng công cụ Canva và ibisPaint để tách nền từng thành viên trong lớp, để lại nền đằng sau một màu trơn thống nhất (miễn là không trùng với màu của vật thể cần tách).'
        }
        icons={[
          { src: ICON_CANVA, alt: 'Canva' },
          { src: ICON_IBISPAINT, alt: 'ibisPaint' },
        ]}
        imageSrc={WORKFLOW_STEP_1_IMG}
        imageAlt="Bước 1 - Tách nền với phông màu trơn"
      />

      {/* Bước 2 */}
      <WorkflowStepItem
        digit={2}
        text={
          isEn
            ? 'Apply Chroma Key to remove the solid color background, composite onto the original photo, overlay university logos and names, and make necessary adjustments.'
            : 'Dùng Chroma Key để tách nền màu trơn, sau đó lồng ghép lên tấm ảnh gốc, ghép logo cùng tên các trường đại học và thực hiện các tinh chỉnh cần thiết.'
        }
        icons={[
          { src: ICON_CANVA, alt: 'Canva' },
        ]}
        imageSrc={WORKFLOW_STEP_2_IMG}
        imageAlt="Bước 2 - Ghép ảnh, logo và tên các trường đại học"
      />

      {/* Bước 3 */}
      <WorkflowStepItem
        digit={3}
        text={
          isEn
            ? 'Export all still frames, sequentially sequence and edit them into the finished video.'
            : 'Xuất toàn bộ chuỗi ảnh tĩnh ra, tuần tự ghép nối và biên tập lại thành video hoàn chỉnh.'
        }
        icons={[
          { src: ICON_EDITS, alt: 'Edits' },
        ]}
      />
    </>
  );

  return (
    <div 
      id="scene-others-for-12a2"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* CSS tùy chỉnh hỗ trợ Facebook Video iframe phủ kín 100% khung tỉ lệ 16:9 */}
      <style>{`
        .fb-video, .fb-video > span, .fb-video iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          border-radius: 0px !important;
        }
      `}</style>

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
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-28 flex flex-col items-center">
        
        {/* Header tiêu đề chính: CHO LỚP 12A2 kèm microcopy */}
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
          {/* MỤC 01: HẬU TỐT NGHIỆP 2026 (Facebook Reel 16:9 SDK) */}
          {/* ========================================================= */}
          <div id="project-hau-tot-nghiep-2026" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-3 mb-6 text-white border-none">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  01
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  {isEn ? 'POST-GRADUATION 2026' : 'HẬU TỐT NGHIỆP 2026'}
                </span>
              </div>
            </div>

            {/* Khung video tỉ lệ 16:9 co giãn responsive theo kích thước tab */}
            <div className="w-full flex flex-col items-center">
              <FacebookReelPlayer reelUrl={FB_REEL_HAU_TOT_NGHIEP_URL} />

              {/* Thanh tool ở dưới khung FB Reel (không khung, font archivo thường) */}
              <div className="flex items-center justify-center gap-4 mt-5 select-none">
                <button
                  type="button"
                  id="btn-open-workflow-modal"
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="font-archivo font-normal normal-case text-sm md:text-base tracking-normal text-white/50 hover:text-white transition-colors duration-200 cursor-pointer pointer-events-auto bg-transparent border-none p-0 outline-none rounded-none"
                >
                  {isEn ? 'workflow' : 'cách thực hiện'}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MỤC 02: 19_11_2025 */}
          {/* ========================================================= */}
          <div id="project-19-11" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-3 mb-6 text-white border-none">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  02
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  19_11_2025
                </span>
              </div>
            </div>

            {/* Poster dàn phẳng */}
            <div className="w-full max-w-[640px] mx-auto overflow-hidden bg-black rounded-none border border-neutral-900 flex items-center justify-center shadow-2xl">
              <img 
                src={POSTER_19_11_URL}
                alt="19_11_2025"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain select-none pointer-events-none rounded-none"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* MỤC 03: 20_10_2025 (Chỉ để lại đề mục theo yêu cầu) */}
          {/* ========================================================= */}
          <div id="project-20-10" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline text-white border-none">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                  03
                </span>
                <span className="font-archivo font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase text-white">
                  20_10_2025
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* CÁCH THỰC HIỆN: APP RIÊNG TRÊN MOBILE & MODAL TRÊN DESKTOP */}
      {/* ========================================================= */}
      {isWorkflowModalOpen && (
        <>
          {/* --- GIAO DIỆN MOBILE: APP RIÊNG TOÀN MÀN HÌNH --- */}
          <div
            id="workflow-screen-mobile"
            ref={mobileWorkflowScrollRef}
            className="md:hidden fixed inset-0 w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
          >
            {/* Nút "trở về" / "back" cho Mobile: Đặt ở góc trên bên trái, cuộn tự nhiên trong luồng nội dung như các app khác */}
            <div className="w-full px-6 pt-6 pb-2 shrink-0 select-none">
              <button
                type="button"
                id="btn-workflow-back-mobile"
                onClick={() => setIsWorkflowModalOpen(false)}
                className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
                title={isEn ? 'Back' : 'Trở về'}
              >
                {isEn ? 'back' : 'trở về'}
              </button>
            </div>

            {/* Khối nội dung chính trên Mobile */}
            <div className="flex-1 w-full max-w-5xl mx-auto px-6 pt-4 pb-28 flex flex-col items-start">
              {/* Header tiêu đề */}
              <div className="w-full mb-8 flex flex-col items-start select-none">
                <h1 className="font-archivo font-bold text-2xl uppercase tracking-tight text-white mb-1">
                  {isEn ? 'WORKFLOW' : 'CÁCH THỰC HIỆN'}
                </h1>
                <span className="font-archivo font-normal text-xs text-[#89CC04] uppercase tracking-wider">
                  {isEn ? 'POST-GRADUATION 2026' : 'HẬU TỐT NGHIỆP 2026'}
                </span>
              </div>

              {/* Danh sách các bước */}
              <div className="w-full flex flex-col gap-6 sm:gap-7">
                {workflowStepsContent}
              </div>
            </div>
          </div>

          {/* --- GIAO DIỆN DESKTOP: CỬA SỔ MODAL VỚI NÚT ĐÓNG ✕ GÓC PHẢI --- */}
          <div 
            id="workflow-modal-backdrop-desktop"
            className="hidden md:flex fixed inset-0 z-50 bg-black/80 backdrop-blur-md items-center justify-center p-5 md:p-8 animate-fade-in"
            onClick={() => setIsWorkflowModalOpen(false)}
          >
            <div 
              id="workflow-modal-window-desktop"
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 shadow-2xl flex flex-col overflow-y-auto max-h-[90vh] rounded-none select-none p-6 sm:p-7 md:p-8 no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút đóng ở góc trên bên phải */}
              <button
                type="button"
                id="close-workflow-modal-btn-desktop"
                onClick={() => setIsWorkflowModalOpen(false)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer select-none bg-transparent border-0 p-1 flex items-center justify-center group z-30 rounded-none"
                title={isEn ? 'Close' : 'Đóng'}
              >
                <span className="text-xl sm:text-2xl font-light transform transition-transform duration-300 ease-out group-hover:rotate-90 inline-block leading-none">
                  ✕
                </span>
              </button>

              {/* Tiêu đề cửa sổ */}
              <div className="w-full mb-6 sm:mb-8 pr-8 flex flex-col items-start select-none">
                <h2 className="font-archivo font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-white">
                  {isEn ? 'WORKFLOW' : 'CÁCH THỰC HIỆN'}
                </h2>
                <span className="font-archivo font-normal text-xs sm:text-sm text-[#89CC04] uppercase tracking-wider mt-0.5">
                  {isEn ? 'POST-GRADUATION 2026' : 'HẬU TỐT NGHIỆP 2026'}
                </span>
              </div>

              {/* Danh sách các bước thực hiện */}
              <div className="w-full flex flex-col gap-6 sm:gap-7 md:gap-8">
                {workflowStepsContent}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
