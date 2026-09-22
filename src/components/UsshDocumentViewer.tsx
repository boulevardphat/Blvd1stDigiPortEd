import React, { useState, useRef, useEffect } from 'react';
import { ZoomableCarouselContainer } from './ZFoldBooklet';

export interface UsshDocumentViewerProps {
  id?: string;
  mode: '3d' | 'flat';
  frontUrl: string;
  backUrl: string;
}

export const UsshDocumentViewer: React.FC<UsshDocumentViewerProps> = ({
  id = 'ussh-viewer',
  mode = '3d',
  frontUrl,
  backUrl,
}) => {
  // Trạng thái xoay 360 độ tự do trong không gian 3D
  const [rotX, setRotX] = useState<number>(8);
  const [rotY, setRotY] = useState<number>(-12);

  // Di chuyển tự do (Pan X, Y)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Thu phóng (Zoom)
  const [zoom, setZoom] = useState<number>(1);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number>(0);
  const initialPinchZoomRef = useRef<number>(1);
  const lastTwoFingerCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningMouseRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const totalDragDistRef = useRef<number>(0);

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

  // Pointer events: xoay 3D (1 ngón / chuột trái), Pan (2 ngón / chuột phải), Zoom (pinch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== '3d') return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);
    totalDragDistRef.current = 0;

    if (e.pointerType === 'mouse') {
      if (e.button === 2 || e.button === 1) {
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
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size === 0) {
      setIsInteracting(false);
      lastTwoFingerCenterRef.current = null;
      initialPinchDistRef.current = 0;
      isPanningMouseRef.current = false;
    }
  };

  const handleDoubleClick = () => {
    setRotX(8);
    setRotY(-12);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

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
  // RENDER MÔ HÌNH 3D (3D MODEL XOAY 360 ĐỘ CỦA THƯ CHÚC MỪNG HCMUSSH)
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
        {/* Bản in Thư chúc mừng 2 mặt với độ sâu 3D */}
        <div
          className="relative will-change-transform select-none rounded-none"
          style={{
            width: 'clamp(280px, 44vw, 560px)',
            aspectRatio: '1.6 / 1',
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* MẶT TRƯỚC (Front Face) */}
          <div
            className="absolute inset-0 bg-neutral-900 border border-white/20 overflow-hidden rounded-none"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(1px)',
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

          {/* MẶT SAU (Back Face) - Xoay 180 độ quanh Y */}
          <div
            className="absolute inset-0 bg-neutral-900 border border-white/20 overflow-hidden rounded-none"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(1px)',
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
      </div>
    </div>
  );
};
