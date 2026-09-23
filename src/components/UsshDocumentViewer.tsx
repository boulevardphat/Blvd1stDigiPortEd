import React, { useState, useRef, useEffect } from 'react';
import { ZoomableCarouselContainer } from './ZFoldBooklet';

export type UsshFoldState = 'closed' | 'half' | 'open';

export interface UsshDocumentViewerProps {
  id?: string;
  mode: '3d' | 'flat';
  foldState?: UsshFoldState;
  onFoldStateChange?: (state: UsshFoldState) => void;
  frontUrl: string;
  backUrl: string;
}

export const UsshDocumentViewer: React.FC<UsshDocumentViewerProps> = ({
  id = 'ussh-viewer',
  mode = '3d',
  foldState: externalFoldState,
  onFoldStateChange,
  frontUrl,
  backUrl,
}) => {
  // Trạng thái gập mở của thư: 'half' (hé mở giữa giữa dạng chữ V đứng 3D), 'open' (mở phẳng 180 độ), 'closed' (gập vào)
  const [internalFoldState, setInternalFoldState] = useState<UsshFoldState>('half');
  const currentFoldState = externalFoldState ?? internalFoldState;

  const setFoldState = (next: UsshFoldState) => {
    if (onFoldStateChange) {
      onFoldStateChange(next);
    } else {
      setInternalFoldState(next);
    }
  };

  const cycleFoldState = () => {
    if (currentFoldState === 'half') {
      setFoldState('open');
    } else if (currentFoldState === 'open') {
      setFoldState('closed');
    } else {
      setFoldState('half');
    }
  };

  // Trạng thái xoay 360 độ tự do trong không gian 3D
  const [rotX, setRotX] = useState<number>(8);
  const [rotY, setRotY] = useState<number>(-12);

  // Di chuyển tự do (Pan X, Y)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Thu phóng (Zoom)
  const [zoom, setZoom] = useState<number>(1);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Kích thước chiều rộng của thư chúc mừng theo khung nhìn
  const [cardWidth, setCardWidth] = useState<number>(500);

  const containerRef = useRef<HTMLDivElement>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number>(0);
  const initialPinchZoomRef = useRef<number>(1);
  const lastTwoFingerCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningMouseRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const totalDragDistRef = useRef<number>(0);

  // Tự động đo đạc độ rộng card để responsive mượt mà trên mọi thiết bị
  useEffect(() => {
    const updateSize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight || 500;
      // Tỷ lệ mở phẳng 2 trang là 1.6 : 1 (8000x5000), đảm bảo nằm gọn cả ngang và dọc
      const maxWByHeight = (h - 96) * 1.6;
      const targetW = Math.max(300, Math.min(680, w - 48, maxWByHeight));
      setCardWidth(Math.round(targetW));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Lắng nghe sự kiện reset zoom chuẩn #BLVD
  useEffect(() => {
    const handleReset = () => {
      setRotX(8);
      setRotY(-12);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    };
    window.addEventListener('blvd-reset-zoom', handleReset);
    return () => window.removeEventListener('blvd-reset-zoom', handleReset);
  }, []);

  // Wheel zoom / trackpad pinch trên container 3D
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mode !== '3d') return;

    const onWheel = (e: WheelEvent) => {
      // 1. Pinch zoom trên Trackpad (Chromium, Firefox, Safari gửi wheel với ctrlKey hoặc metaKey)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const factor = Math.exp(-e.deltaY * 0.008);
        setZoom((prev) => Math.min(3.2, Math.max(0.65, Number((prev * factor).toFixed(2)))));
        return;
      }

      // 2. Cuộn chuột thông thường: điều chỉnh zoom
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.003);
        setZoom((prev) => Math.min(3.2, Math.max(0.65, Number((prev * factor).toFixed(2)))));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [mode]);

  // Pointer events: xoay 3D (1 ngón / chuột trái), Pan (2 ngón / chuột phải), Zoom (pinch), Nhấp để đổi trạng thái gập mở
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== '3d') return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);
    totalDragDistRef.current = 0;

    if (e.pointerType === 'mouse') {
      if (e.button === 2 || e.button === 1 || e.shiftKey) {
        isPanningMouseRef.current = true;
      } else {
        isPanningMouseRef.current = false;
      }
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = zoom;
      lastTwoFingerCenterRef.current = {
        x: (pts[0].x + pts[1].x) / 2,
        y: (pts[0].y + pts[1].y) / 2,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activePointersRef.current.has(e.pointerId) || mode !== '3d') return;

    const prev = activePointersRef.current.get(e.pointerId)!;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    totalDragDistRef.current += Math.hypot(dx, dy);

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Kéo 2 ngón tay trên màn hình cảm ứng: Pan và Pinch zoom đồng thời
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (initialPinchDistRef.current > 0) {
        const scale = currentDist / initialPinchDistRef.current;
        const newZoom = Math.min(3.2, Math.max(0.65, initialPinchZoomRef.current * scale));
        setZoom(Number(newZoom.toFixed(2)));
      }

      const currentCenter = {
        x: (pts[0].x + pts[1].x) / 2,
        y: (pts[0].y + pts[1].y) / 2,
      };
      if (lastTwoFingerCenterRef.current) {
        const panDx = currentCenter.x - lastTwoFingerCenterRef.current.x;
        const panDy = currentCenter.y - lastTwoFingerCenterRef.current.y;
        setPan((p) => ({ x: p.x + panDx, y: p.y + panDy }));
      }
      lastTwoFingerCenterRef.current = currentCenter;
      return;
    }

    // Kéo chuột: chuột phải/giữa = Pan, chuột trái = Xoay 3D
    if (e.pointerType === 'mouse' && isPanningMouseRef.current) {
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      return;
    }

    // Xoay 360 độ quanh trục X & Y
    setRotY((prev) => prev + dx * 0.45);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.45)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = totalDragDistRef.current > 8;
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size === 0) {
      setIsInteracting(false);
      lastTwoFingerCenterRef.current = null;
      initialPinchDistRef.current = 0;
      isPanningMouseRef.current = false;

      // Nếu nhấp nhẹ / chạm màn hình (không kéo rê xoay): chuyển trạng thái gập mở theo chu kỳ
      if (!wasDragging) {
        cycleFoldState();
      }
    }
  };

  const handleDoubleClick = () => {
    setRotX(8);
    setRotY(-12);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Kích thước chuẩn từng cánh (Left Wing & Right Wing)
  const wingW = Math.round(cardWidth / 2);
  const wingH = Math.round(cardWidth / 1.6); // Aspect ratio 1.6:1 (8000x5000)

  // Tính toán góc xoay 3D của 2 cánh và độ dịch tâm để luôn căn giữa chuẩn xác ("giữa giữa")
  let leftAngle = 0;
  let rightAngle = 0;
  let leftZOffset = 0;
  let rootOffsetX = 0;
  let rootOffsetZ = 0;

  if (currentFoldState === 'closed') {
    // Gập vào: Cánh trái (bìa trước) gập khít 180 độ phủ trọn vẹn lên cánh phải (bìa sau)
    leftAngle = 180;
    rightAngle = 0;
    leftZOffset = 2.5; // Nổi lên 2.5px phía trên cánh phải để triệt tiêu z-fighting và che trọn vẹn
    rootOffsetX = -wingW / 2; // Căn giữa chuẩn xác trục tâm màn hình
    rootOffsetZ = 0;
  } else if (currentFoldState === 'half') {
    // Giữa giữa: Cánh trái và cánh phải hé mở đối xứng 36 độ dạng thiệp đứng 3D
    leftAngle = 36;
    rightAngle = -36;
    leftZOffset = 0;
    rootOffsetX = 0;
    rootOffsetZ = -(wingW * Math.sin((36 * Math.PI) / 180)) / 2; // Đặt trọng tâm hình học đúng tâm quay
  } else {
    // Mở ra: Cả hai cánh mở phẳng hoàn toàn 180 độ
    leftAngle = 0;
    rightAngle = 0;
    leftZOffset = 0;
    rootOffsetX = 0;
    rootOffsetZ = 0;
  }

  // ==========================================================================
  // RENDER DÀN PHẲNG (FLAT LAYOUT - CAROUSEL TƯƠNG TỰ #BLVD)
  // ==========================================================================
  if (mode === 'flat') {
    return (
      <ZoomableCarouselContainer
        id={`${id}-flat-carousel`}
        className="w-full max-w-6xl mx-auto flex items-center justify-center px-4"
      >
        <div className="flex items-center gap-0 w-max shrink-0">
          {/* Mặt trước */}
          <div
            className="shrink-0 relative overflow-hidden bg-[#111] border-y border-white/20 transition-all duration-200 ease-out rounded-none"
            style={{
              width: 'calc(clamp(280px, 36vw, 480px) * var(--carousel-scale, 1))',
              aspectRatio: '1.6 / 1',
            }}
          >
            <img
              src={frontUrl}
              alt="Mặt trước Thư chúc mừng HCMUSSH"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none rounded-none"
            />
          </div>

          {/* Mặt sau */}
          <div
            className="shrink-0 relative overflow-hidden bg-[#111] border-y border-white/20 transition-all duration-200 ease-out rounded-none"
            style={{
              width: 'calc(clamp(280px, 36vw, 480px) * var(--carousel-scale, 1))',
              aspectRatio: '1.6 / 1',
            }}
          >
            <img
              src={backUrl}
              alt="Mặt sau Thư chúc mừng HCMUSSH"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none rounded-none"
            />
          </div>
        </div>
      </ZoomableCarouselContainer>
    );
  }

  // ==========================================================================
  // RENDER MÔ HÌNH 3D: GẬP VÀO / GIỮA GIỮA / MỞ RA (THƯ CHÚC MỪNG HCMUSSH)
  // ==========================================================================
  return (
    <div
      ref={containerRef}
      id={`${id}-3d-container`}
      className="relative w-full h-[72vh] max-w-5xl mx-auto flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none rounded-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{ perspective: '2200px', touchAction: 'none' }}
    >
      {/* Khối di chuyển (Pan), xoay 360 độ và scale zoom */}
      <div
        className={`relative flex items-center justify-center will-change-transform ${
          isInteracting ? 'transition-none' : 'transition-transform duration-250 ease-out'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* Khung chứa 2 cánh thư gập mở với trục gáy ở chính giữa X = 0 */}
        <div
          className="relative will-change-transform select-none rounded-none"
          style={{
            width: `${cardWidth}px`,
            height: `${wingH}px`,
            transformStyle: 'preserve-3d',
            transform: `translateX(${rootOffsetX}px) translateZ(${rootOffsetZ}px)`,
            transition: isInteracting ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)',
          }}
        >
          {/* ================================================================= */}
          {/* CÁNH TRÁI (LEFT WING) - Bản lề gắn vào gáy tại mép phải của cánh  */}
          {/* ================================================================= */}
          <div
            className="absolute will-change-transform select-none rounded-none"
            style={{
              width: `${wingW}px`,
              height: `${wingH}px`,
              right: '50%', // Mép phải gắn chính xác vào gáy x = 0
              top: 0,
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d',
              transform: `translateZ(${leftZOffset}px) rotateY(${leftAngle}deg)`,
              transition: isInteracting ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)',
              zIndex: currentFoldState === 'closed' ? 10 : 2,
              boxShadow: currentFoldState === 'closed' ? '0 20px 45px -15px rgba(0, 0, 0, 0.85)' : '0 20px 40px -15px rgba(0, 0, 0, 0.75)',
            }}
          >
            {/* Mặt trong của cánh trái (Ruột thư - Trang 2) */}
            <div
              className="absolute inset-0 w-full h-full bg-[#111] overflow-hidden border-y border-l border-white/20 select-none rounded-none"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0.5px)',
              }}
            >
              <img
                src={backUrl}
                alt="Trang trong trái Thư chúc mừng HCMUSSH"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute top-0 select-none pointer-events-none rounded-none"
                style={{
                  width: `${cardWidth}px`,
                  height: `${wingH}px`,
                  left: 0,
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
              {/* Bóng nếp gấp gáy thư tăng chiều sâu 3D */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to right, transparent 65%, rgba(0,0,0,0.55) 100%)',
                  opacity: currentFoldState === 'open' ? 0.05 : currentFoldState === 'half' ? 0.45 : 0.85,
                }}
              />
            </div>

            {/* Mặt ngoài của cánh trái (Bìa trước - Front Cover) */}
            <div
              className="absolute inset-0 w-full h-full bg-[#111] overflow-hidden border-y border-r border-white/20 select-none rounded-none"
              style={{
                transform: 'rotateY(180deg) translateZ(0.5px)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={frontUrl}
                alt="Bìa trước Thư chúc mừng HCMUSSH"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute top-0 select-none pointer-events-none rounded-none"
                style={{
                  width: `${cardWidth}px`,
                  height: `${wingH}px`,
                  left: `-${wingW}px`,
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
              {/* Bóng nếp gập mặt ngoài */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to left, transparent 75%, rgba(0,0,0,0.35) 100%)',
                  opacity: currentFoldState === 'half' ? 0.35 : 0.05,
                }}
              />
            </div>
          </div>

          {/* ================================================================== */}
          {/* CÁNH PHẢI (RIGHT WING) - Bản lề gắn vào gáy tại mép trái của cánh  */}
          {/* ================================================================== */}
          <div
            className="absolute will-change-transform select-none rounded-none"
            style={{
              width: `${wingW}px`,
              height: `${wingH}px`,
              left: '50%', // Mép trái gắn chính xác vào gáy x = 0
              top: 0,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rightAngle}deg)`,
              transition: isInteracting ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)',
              zIndex: 1,
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.75)',
            }}
          >
            {/* Mặt trong của cánh phải (Nội dung Thư chúc mừng HCMUSSH - Trang 3) */}
            <div
              className="absolute inset-0 w-full h-full bg-[#111] overflow-hidden border-y border-r border-white/20 select-none rounded-none"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0.5px)',
              }}
            >
              <img
                src={backUrl}
                alt="Nội dung Thư chúc mừng HCMUSSH"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute top-0 select-none pointer-events-none rounded-none"
                style={{
                  width: `${cardWidth}px`,
                  height: `${wingH}px`,
                  left: `-${wingW}px`,
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
              {/* Bóng nếp gấp gáy thư tăng chiều sâu 3D */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to left, transparent 65%, rgba(0,0,0,0.55) 100%)',
                  opacity: currentFoldState === 'open' ? 0.05 : currentFoldState === 'half' ? 0.45 : 0.85,
                }}
              />
            </div>

            {/* Mặt ngoài của cánh phải (Bìa sau - Back Cover) */}
            <div
              className="absolute inset-0 w-full h-full bg-[#111] overflow-hidden border-y border-l border-white/20 select-none rounded-none"
              style={{
                transform: 'rotateY(180deg) translateZ(0.5px)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={frontUrl}
                alt="Bìa sau Thư chúc mừng HCMUSSH"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute top-0 select-none pointer-events-none rounded-none"
                style={{
                  width: `${cardWidth}px`,
                  height: `${wingH}px`,
                  left: 0,
                  maxWidth: 'none',
                  objectFit: 'cover',
                }}
              />
              {/* Bóng nếp gập mặt ngoài */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to right, transparent 75%, rgba(0,0,0,0.35) 100%)',
                  opacity: currentFoldState === 'half' ? 0.35 : 0.05,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
