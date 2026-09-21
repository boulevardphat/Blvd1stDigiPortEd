import React, { useState, useRef, useEffect, useMemo } from 'react';

export const SPOTIFLYER_SHARED_PAGES = [
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/lu%E1%BA%ADt%20ch%C6%A1i.webp',
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/b%E1%BA%A3n%20%C4%91%E1%BB%93%20khu%20v%E1%BB%B1c.webp',
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/b%E1%BA%A3n%20%C4%91%E1%BB%93%20th%E1%BA%BF%20gi%E1%BB%9Bi.webp',
];

export const SPOTIFLYER_SETS: Record<number, {
  code: string;
  labelVi: string;
  labelEn: string;
  topPages: [string, string]; // [tấm (2) nằm trên, tấm (1) nằm dưới]
}> = {
  1: {
    code: '01',
    labelVi: 'mã 1',
    labelEn: 'code 1',
    topPages: [
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/M%C3%A3%201%20%282%29.webp',
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/M%C3%A3%201%20%281%29.webp',
    ],
  },
  2: {
    code: '02',
    labelVi: 'mã 2',
    labelEn: 'code 2',
    topPages: [
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%202%20%282%29.webp',
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%202%20%281%29.webp',
    ],
  },
  3: {
    code: '03',
    labelVi: 'mã 3',
    labelEn: 'code 3',
    topPages: [
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%203%20%282%29.webp',
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%203%20%281%29.webp',
    ],
  },
  4: {
    code: '04',
    labelVi: 'mã 4',
    labelEn: 'code 4',
    topPages: [
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%204%20%282%29.webp',
      'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/m%C3%A3%204%20%281%29.webp',
    ],
  },
};

export const SPOTIFLYER_PAGES = [
  ...SPOTIFLYER_SETS[1].topPages,
  ...SPOTIFLYER_SETS[2].topPages,
  ...SPOTIFLYER_SETS[3].topPages,
  ...SPOTIFLYER_SETS[4].topPages,
  ...SPOTIFLYER_SHARED_PAGES,
];

// Tỉ lệ sau khi xoay 90 độ theo chiều kim đồng hồ: 3109 x 1318 (chiều rộng / chiều cao ≈ 2.358877)
const ASPECT_RATIO = 3109 / 1318;

interface SpotiflyerVerticalZFoldProps {
  id?: string;
  isEn?: boolean;
}

export const SpotiflyerVerticalZFold: React.FC<SpotiflyerVerticalZFoldProps> = ({
  id = 'spotiflyer-vertical-3d',
  isEn = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flatContainerRef = useRef<HTMLDivElement>(null);

  const [selectedCode, setSelectedCode] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'3d' | 'flat'>('3d');
  const [isOpen, setIsOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(330);
  const [isInteracting, setIsInteracting] = useState(false);

  // Thao tác 3D chuẩn xác kế thừa 100% từ #blvd (ZFoldBooklet):
  // Xoay tự do 360 độ (RotX, RotY), Di chuyển tự do (Pan X, Y) và Zoom phóng to/thu nhỏ
  const [rotX, setRotX] = useState(14);
  const [rotY, setRotY] = useState(-18);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.95);

  // Zoom cho chế độ Trải phẳng (Vertical Carousel)
  const [flatZoom, setFlatZoom] = useState(1);

  // Quản lý đa chạm (Multi-touch), chuột phải (Pan) và nhấp chuột đóng/mở
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number>(0);
  const initialPinchZoomRef = useRef<number>(1);
  const lastTwoFingerCenterRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningMouseRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const totalDragDistRef = useRef<number>(0);

  // Ref kéo cuộn dọc (drag-to-scroll) cho chế độ trải phẳng
  const isFlatDraggingRef = useRef<boolean>(false);
  const flatStartYRef = useRef<number>(0);
  const flatScrollTopRef = useRef<number>(0);
  const flatDragDistRef = useRef<number>(0);
  const flatPointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialFlatPinchDistRef = useRef<number>(0);
  const initialFlatPinchZoomRef = useRef<number>(1);

  // Tự động đo đạc độ rộng panel dựa trên khung hiển thị (đồng bộ 100% giữa 3D và Trải phẳng)
  useEffect(() => {
    const updateSize = () => {
      const el = rootRef.current || containerRef.current || flatContainerRef.current;
      if (!el) return;
      const containerW = el.clientWidth;
      const targetW = Math.max(260, Math.min(380, containerW - 40));
      setPanelWidth(targetW);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [viewMode]);

  const panelHeight = Math.round(panelWidth / ASPECT_RATIO);

  // Góc gập ziczac dọc: khi mở phẳng = 0deg, khi gập ziczac = 32deg
  const foldAngle = isOpen ? 0 : 32;

  // Lắng nghe sự kiện con lăn chuột và cử chỉ pinch-zoom trên trackpad cho 3D model (#blvd standard)
  useEffect(() => {
    if (viewMode !== '3d') return;
    const el = containerRef.current;
    if (!el) return;

    let wheelTimer: NodeJS.Timeout;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsInteracting(true);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        setIsInteracting(false);
      }, 150);

      if (e.ctrlKey) {
        // Cử chỉ pinch-zoom trên touchpad (Trackpad macOS / Precision Windows)
        const factor = Math.exp(-e.deltaY * 0.012);
        setZoom((prev) => Math.min(3.5, Math.max(0.35, prev * factor)));
      } else {
        // Con lăn chuột tiêu chuẩn
        const delta = -e.deltaY * 0.0015;
        setZoom((prev) => Math.min(3.5, Math.max(0.35, prev + delta)));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer);
    };
  }, [viewMode]);

  // Lắng nghe con lăn & pinch zoom cho chế độ trải phẳng (Vertical Carousel)
  useEffect(() => {
    if (viewMode !== 'flat') return;
    const el = flatContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Pinch zoom trên Trackpad
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const factor = Math.exp(-e.deltaY * 0.008);
        setFlatZoom((prev) => Math.min(2.5, Math.max(0.6, Number((prev * factor).toFixed(2)))));
        return;
      }
      // Con lăn bình thường: cuộn dọc tự nhiên theo chiều từ trên xuống dưới
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [viewMode]);

  // Đồng bộ sự kiện reset từ hệ thống #blvd
  useEffect(() => {
    const handleReset = () => {
      setRotX(14);
      setRotY(-18);
      setPan({ x: 0, y: 0 });
      setZoom(0.95);
      setFlatZoom(1);
      if (flatContainerRef.current) {
        flatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('blvd-reset-zoom', handleReset);
    return () => window.removeEventListener('blvd-reset-zoom', handleReset);
  }, []);

  // Pointer gestures 3D kế thừa toàn bộ từ #blvd (ZFoldBooklet)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    // Chuột phải (button 2), chuột giữa (button 1) hoặc giữ phím Shift: chế độ Pan di chuyển
    if (e.button === 2 || e.button === 1 || e.shiftKey) {
      isPanningMouseRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);

    if (activePointersRef.current.size === 1) {
      totalDragDistRef.current = 0;
    } else if (activePointersRef.current.size === 2) {
      // 2 ngón tay: ghi nhận khoảng cách ban đầu (zoom) và trọng tâm 2 ngón (pan)
      const pts = Array.from(activePointersRef.current.values()) as { x: number; y: number }[];
      if (pts.length >= 2) {
        initialPinchDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialPinchZoomRef.current = zoom;
        lastTwoFingerCenterRef.current = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activePointersRef.current.has(e.pointerId)) return;
    e.stopPropagation();

    // Kéo chuột phải / chuột giữa để di chuyển (Pan)
    if (isPanningMouseRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    const prev = activePointersRef.current.get(e.pointerId)!;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 1) {
      // 1 con trỏ / 1 ngón: XOAY 360 ĐỘ TỰ DO
      totalDragDistRef.current += Math.hypot(dx, dy);
      setRotY((prevY) => (prevY + dx * 0.55) % 360);
      setRotX((prevX) => Math.max(-85, Math.min(85, prevX - dy * 0.55)));
    } else if (activePointersRef.current.size === 2) {
      // 2 ngón tay: DI CHUYỂN (PAN) VÀ PINCH ZOOM (KHÔNG XOAY)
      const pts = Array.from(activePointersRef.current.values()) as { x: number; y: number }[];
      if (pts.length >= 2) {
        const currentCenter = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };

        if (lastTwoFingerCenterRef.current) {
          const dCenterX = currentCenter.x - lastTwoFingerCenterRef.current.x;
          const dCenterY = currentCenter.y - lastTwoFingerCenterRef.current.y;
          setPan((prev) => ({ x: prev.x + dCenterX, y: prev.y + dCenterY }));
        }
        lastTwoFingerCenterRef.current = currentCenter;

        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (initialPinchDistRef.current > 10) {
          const scale = currentDist / initialPinchDistRef.current;
          setZoom(Math.min(3.5, Math.max(0.35, initialPinchZoomRef.current * scale)));
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    isPanningMouseRef.current = false;
    const wasActive = activePointersRef.current.has(e.pointerId);
    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size < 2) {
      lastTwoFingerCenterRef.current = null;
    }

    if (activePointersRef.current.size === 0) {
      setIsInteracting(false);
      // Chạm dứt khoát không rê kéo (< 6px): kích hoạt đóng / mở nếp gập ziczac
      if (wasActive && totalDragDistRef.current < 6) {
        setIsOpen((prev) => !prev);
      }
    } else if (activePointersRef.current.size === 1) {
      totalDragDistRef.current = 100;
    }
  };

  // Nhấp đúp chuột (Double click) reset 3D về góc chuẩn
  const handleDoubleClick = () => {
    setPan({ x: 0, y: 0 });
    setZoom(0.95);
    setRotX(14);
    setRotY(-18);
  };

  // Pointer gestures cho chế độ trải phẳng (Vertical Drag-to-Scroll & Touch Pinch Zoom)
  const handleFlatPointerDown = (e: React.PointerEvent) => {
    flatPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (flatPointersRef.current.size === 1) {
      isFlatDraggingRef.current = true;
      flatStartYRef.current = e.clientY;
      flatScrollTopRef.current = flatContainerRef.current?.scrollTop || 0;
      flatDragDistRef.current = 0;
    } else if (flatPointersRef.current.size === 2) {
      const pts = Array.from(flatPointersRef.current.values()) as { x: number; y: number }[];
      initialFlatPinchDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialFlatPinchZoomRef.current = flatZoom;
    }
  };

  const handleFlatPointerMove = (e: React.PointerEvent) => {
    if (!flatPointersRef.current.has(e.pointerId)) return;
    flatPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (flatPointersRef.current.size === 1 && isFlatDraggingRef.current && flatContainerRef.current) {
      const dy = e.clientY - flatStartYRef.current;
      flatDragDistRef.current += Math.abs(dy);
      flatContainerRef.current.scrollTop = flatScrollTopRef.current - dy * 1.3;
    } else if (flatPointersRef.current.size === 2) {
      const pts = Array.from(flatPointersRef.current.values()) as { x: number; y: number }[];
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (initialFlatPinchDistRef.current > 10) {
        const scale = currentDist / initialFlatPinchDistRef.current;
        setFlatZoom(Math.min(2.5, Math.max(0.6, Number((initialFlatPinchZoomRef.current * scale).toFixed(2)))));
      }
    }
  };

  const handleFlatPointerUp = (e: React.PointerEvent) => {
    flatPointersRef.current.delete(e.pointerId);
    if (flatPointersRef.current.size === 0) {
      isFlatDraggingRef.current = false;
    }
  };

  const handleFlatDoubleClick = () => {
    setFlatZoom(1);
    if (flatContainerRef.current) {
      flatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSet = SPOTIFLYER_SETS[selectedCode] || SPOTIFLYER_SETS[1];
  const currentPages = useMemo(() => [
    {
      title: isEn ? `${activeSet.labelEn} (Top)` : `${activeSet.labelVi} (2)`,
      url: activeSet.topPages[0],
    },
    {
      title: isEn ? `${activeSet.labelEn} (Bottom)` : `${activeSet.labelVi} (1)`,
      url: activeSet.topPages[1],
    },
    {
      title: isEn ? 'Game Rules' : 'Luật chơi',
      url: SPOTIFLYER_SHARED_PAGES[0],
    },
    {
      title: isEn ? 'Area Map' : 'Bản đồ khu vực',
      url: SPOTIFLYER_SHARED_PAGES[1],
    },
    {
      title: isEn ? 'World Map' : 'Bản đồ thế giới',
      url: SPOTIFLYER_SHARED_PAGES[2],
    },
  ], [activeSet, isEn]);

  // Helper render 2 mặt (mặt trước và mặt sau) của từng panel trong mô hình 3D
  // Đảm bảo khi xoay mô hình ra phía sau, mặt sau hiển thị cùng chiều ảnh chuẩn xác giống hệt mặt trước
  const renderPanelImage = (pageIndex: number) => {
    const page = currentPages[pageIndex];
    const isEven = pageIndex % 2 === 0;

    // Phân bổ viền chính xác theo thứ tự nếp gấp dọc
    const borderClasses =
      pageIndex === 0
        ? 'border-t border-x border-white/20'
        : pageIndex === 4
        ? 'border-b border-x border-white/20'
        : 'border-x border-white/20';

    return (
      <>
        {/* MẶT TRƯỚC */}
        <div
          className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] flex items-center justify-center select-none rounded-none ${borderClasses}`}
          style={{
            transform: 'translateZ(0.5px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img
            src={page.url}
            alt={page.title}
            referrerPolicy="no-referrer"
            loading="eager"
            className="select-none pointer-events-none object-cover shrink-0 rounded-none"
            style={{
              width: `${panelHeight}px`,
              height: `${panelWidth}px`,
              transform: 'rotate(90deg)',
              transformOrigin: 'center center',
            }}
          />

          {/* Hiệu ứng nếp gấp bóng đổ theo ánh sáng 3D */}
          <div
            className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
            style={{
              background: isEven
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.3) 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.07) 50%, rgba(0,0,0,0.25) 100%)',
              opacity: isOpen ? 0.05 : 0.45 + (pageIndex % 2) * 0.15,
            }}
          />
        </div>

        {/* MẶT SAU (XOAY 180 ĐỘ QUANH TRỤC Y, KHÔNG BỊ NGƯỢC, ĐỒNG BỘ 100% VỚI MẶT TRƯỚC) */}
        <div
          className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] flex items-center justify-center select-none rounded-none ${borderClasses}`}
          style={{
            transform: 'rotateY(180deg) translateZ(0.5px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img
            src={page.url}
            alt={`${page.title} (Back)`}
            referrerPolicy="no-referrer"
            loading="eager"
            className="select-none pointer-events-none object-cover shrink-0 rounded-none"
            style={{
              width: `${panelHeight}px`,
              height: `${panelWidth}px`,
              transform: 'scaleX(-1) rotate(90deg)',
              transformOrigin: 'center center',
            }}
          />

          {/* Hiệu ứng nếp gấp bóng đổ mặt sau theo góc gập 3D */}
          <div
            className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
            style={{
              background: isEven
                ? 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.3) 100%)'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.07) 50%, rgba(0,0,0,0.25) 100%)',
              opacity: isOpen ? 0.05 : 0.45 + (pageIndex % 2) * 0.15,
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div ref={rootRef} className="w-full max-w-full min-w-0 flex flex-col items-center select-none">
      {/* Thanh chọn mã đề và nút chuyển đổi chế độ xem căn giữa trên khung model 3D */}
      <div className="w-full max-w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-3 select-none">
        {/* 4 mã đề - BỎ KHUNG HOÀN TOÀN, font archivo thường */}
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((code) => {
            const isSelected = selectedCode === code;
            const item = SPOTIFLYER_SETS[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedCode(code)}
                className={`px-1.5 py-0.5 text-xs sm:text-sm font-archivo font-normal normal-case tracking-normal transition-colors cursor-pointer border-none bg-transparent ${
                  isSelected
                    ? 'text-white font-medium'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {isEn ? item.labelEn : item.labelVi}
              </button>
            );
          })}
        </div>

        {/* Chuyển đổi giữa Mô hình 3D và Trải phẳng (Vertical Carousel) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-1.5 py-0.5 text-xs sm:text-sm font-archivo font-normal normal-case tracking-normal transition-colors cursor-pointer border-none bg-transparent ${
              viewMode === '3d'
                ? 'text-white font-medium'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isEn ? '3d model' : 'mô hình 3d'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flat')}
            className={`px-1.5 py-0.5 text-xs sm:text-sm font-archivo font-normal normal-case tracking-normal transition-colors cursor-pointer border-none bg-transparent ${
              viewMode === 'flat'
                ? 'text-white font-medium'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isEn ? 'flat view' : 'trải phẳng'}
          </button>
        </div>
      </div>

      {/* CHẾ ĐỘ 1: SÂN KHẤU 3D PERSPECTIVE (Vertical Accordion 5 tờ - Kế thừa 100% thao tác #blvd) */}
      {viewMode === '3d' ? (
        <div
          ref={containerRef}
          id={id}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          onContextMenu={(e) => e.preventDefault()}
          className="relative w-full max-w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] bg-neutral-950/70 border border-white/15 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none rounded-none"
          style={{
            perspective: '2200px',
            touchAction: 'none',
          }}
        >
          {/* Lớp nền radial */}
          <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent pointer-events-none" />

          {/* Khối xoay toàn cục: Pan X/Y, Scale Zoom, Xoay RotX / RotY 360 độ */}
          <div
            className={`relative flex flex-col items-center justify-center will-change-transform ${
              isInteracting ? 'transition-none' : 'transition-transform duration-300 ease-out'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            }}
          >
            {/* TỜ 1 (GỐC Ở TRÊN CÙNG - MÃ ĐỀ (2)) */}
            <div
              className="relative will-change-transform select-none rounded-none"
              style={{
                width: `${panelWidth}px`,
                height: `${panelHeight}px`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transform: `translateY(-${(isOpen ? 2.5 : 2.5 * Math.cos((foldAngle * 0.5 * Math.PI) / 180)) * panelHeight}px) rotateX(${isOpen ? 0 : -foldAngle * 0.5}deg)`,
                transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              {renderPanelImage(0)}

              {/* TỜ 2 (NỐI TIẾP CẠNH ĐÁY TỜ 1 - MÃ ĐỀ (1)) */}
              <div
                className="absolute left-0 w-full will-change-transform select-none rounded-none"
                style={{
                  top: `${panelHeight}px`,
                  height: `${panelHeight}px`,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'top center',
                  transform: `rotateX(${foldAngle}deg)`,
                  transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                }}
              >
                {renderPanelImage(1)}

                {/* TỜ 3 (NỐI TIẾP CẠNH ĐÁY TỜ 2 - LUẬT CHƠI DÙNG CHUNG) */}
                <div
                  className="absolute left-0 w-full will-change-transform select-none rounded-none"
                  style={{
                    top: `${panelHeight}px`,
                    height: `${panelHeight}px`,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top center',
                    transform: `rotateX(${-foldAngle}deg)`,
                    transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  }}
                >
                  {renderPanelImage(2)}

                  {/* TỜ 4 (NỐI TIẾP CẠNH ĐÁY TỜ 3 - BẢN ĐỒ KHU VỰC DÙNG CHUNG) */}
                  <div
                    className="absolute left-0 w-full will-change-transform select-none rounded-none"
                    style={{
                      top: `${panelHeight}px`,
                      height: `${panelHeight}px`,
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'top center',
                      transform: `rotateX(${foldAngle}deg)`,
                      transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                    }}
                  >
                    {renderPanelImage(3)}

                    {/* TỜ 5 (NỐI TIẾP CẠNH ĐÁY TỜ 4 - BẢN ĐỒ THẾ GIỚI DÙNG CHUNG) */}
                    <div
                      className="absolute left-0 w-full will-change-transform select-none rounded-none"
                      style={{
                        top: `${panelHeight}px`,
                        height: `${panelHeight}px`,
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'top center',
                        transform: `rotateX(${-foldAngle}deg)`,
                        transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                      }}
                    >
                      {renderPanelImage(4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CHẾ ĐỘ 2: TRẢI PHẲNG (Vertical Carousel - cuộn từ trên xuống dưới) */
        <div
          id={`${id}-flat-container`}
          className="relative w-full max-w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] bg-neutral-950/70 border border-white/15 overflow-hidden flex flex-col items-center justify-start select-none rounded-none"
        >
          {/* Vùng cuộn dọc từ trên xuống dưới (Drag-to-scroll, Mouse wheel, Touch swipe) */}
          <div
            ref={flatContainerRef}
            onPointerDown={handleFlatPointerDown}
            onPointerMove={handleFlatPointerMove}
            onPointerUp={handleFlatPointerUp}
            onPointerCancel={handleFlatPointerUp}
            onDoubleClick={handleFlatDoubleClick}
            className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center py-6 px-3 cursor-grab active:cursor-grabbing touch-pan-y select-none"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            {/* Dải 5 tờ nối tiếp từ trên xuống dưới gap-0 liền mạch, độ rộng bằng đúng mô hình 3D (panelWidth) */}
            <div
              className="flex flex-col items-center gap-0 shrink-0 transition-all duration-200 ease-out"
              style={{
                width: `${panelWidth * flatZoom}px`,
                maxWidth: '100%',
              }}
            >
              {currentPages.map((page, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === currentPages.length - 1;

                return (
                  <div
                    key={`${selectedCode}-${idx}`}
                    className={`w-full relative overflow-hidden bg-[#0d0d0d] select-none border-x border-white/20 transition-all duration-200 ease-out ${
                      isFirst ? 'border-t' : ''
                    } ${isLast ? 'border-b' : ''}`}
                    style={{
                      aspectRatio: '3109 / 1318',
                    }}
                  >
                    {/* Ảnh xoay 90 độ khớp chuẩn khung landscape */}
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                      <img
                        src={page.url}
                        alt={page.title}
                        referrerPolicy="no-referrer"
                        loading="eager"
                        decoding="async"
                        className="select-none pointer-events-none object-cover shrink-0 rounded-none"
                        style={{
                          width: 'calc(100% / 2.358877)',
                          height: 'calc(100% * 2.358877)',
                          transform: 'rotate(90deg)',
                          transformOrigin: 'center center',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

