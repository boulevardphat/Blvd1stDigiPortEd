import React, { useState, useRef, useEffect } from 'react';

export const SPOTIFLYER_PAGES = [
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/Lu%E1%BA%ADt%20ch%C6%A1i.webp',
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/Lu%E1%BA%ADt%20ch%C6%A1i%20%282%29.webp',
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/Lu%E1%BA%ADt%20ch%C6%A1i%20%283%29.webp',
  'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5B%C4%90%E1%BB%99i%20TNTN%5D%20Spotiflyer/Lu%E1%BA%ADt%20ch%C6%A1i%20%284%29.webp',
];

// Tỉ lệ thực tế của các ảnh Luật chơi trong kho multimedia: 4704 x 3255 (khoảng 1.4452 : 1)
const ASPECT_RATIO = 4704 / 3255;

interface SpotiflyerVerticalZFoldProps {
  id?: string;
  isEn?: boolean;
}

export const SpotiflyerVerticalZFold: React.FC<SpotiflyerVerticalZFoldProps> = ({
  id = 'spotiflyer-vertical-3d',
  isEn = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(330);
  const [isInteracting, setIsInteracting] = useState(false);

  // Góc xoay 3D mặc định: nhìn từ trên xuống và hơi xiên sang một bên để thấy rõ nếp gấp ziczac
  const [rotX, setRotX] = useState(16);
  const [rotY, setRotY] = useState(-18);
  const [zoom, setZoom] = useState(1);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Tự động đo đạc độ rộng panel dựa trên khung hiển thị
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      // Dành padding 2 bên, panel width tối đa 380px, tối thiểu 260px
      const targetW = Math.max(260, Math.min(380, containerW - 40));
      setPanelWidth(targetW);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const panelHeight = Math.round(panelWidth / ASPECT_RATIO);

  // Góc gập ziczac dọc: khi mở phẳng = 0deg, khi gập ziczac = 36deg
  const foldAngle = isOpen ? 0 : 36;

  // Xử lý tương tác kéo xoay 3D
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Di chuyển ngang thay đổi rotY, di chuyển dọc thay đổi rotX
    setRotY((prev) => prev + dx * 0.45);
    setRotX((prev) => Math.max(-60, Math.min(60, prev - dy * 0.45)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    setIsInteracting(false);
  };

  const handleResetView = () => {
    setRotX(16);
    setRotY(-18);
    setZoom(1);
  };

  return (
    <div className="w-full flex flex-col items-start select-none">
      {/* Thanh công cụ điều khiển tương tác */}
      <div className="w-full flex items-center justify-between mb-3 text-xs font-archivo text-white/60 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20 uppercase tracking-wider rounded-none cursor-pointer"
          >
            {isOpen 
              ? (isEn ? 'FOLD ZICZAC' : 'GẬP ZICZAC') 
              : (isEn ? 'UNFOLD VIEW' : 'MỞ PHẲNG')}
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="px-3 py-1.5 bg-transparent hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 uppercase tracking-wider rounded-none cursor-pointer"
          >
            {isEn ? 'RESET 3D' : 'ĐẶT LẠI GÓC'}
          </button>
        </div>
        <span className="text-[11px] text-white/40 hidden sm:inline-block">
          {isEn ? 'Drag to rotate 3D' : 'Kéo chuột để xoay 3D'}
        </span>
      </div>

      {/* Sân khấu 3D Perspective (Vertical Accordion) */}
      <div
        ref={containerRef}
        id={id}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] bg-neutral-950/60 border border-white/15 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none rounded-none"
        style={{
          perspective: '1800px',
          touchAction: 'none',
        }}
      >
        {/* Lớp nền tinh tế */}
        <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent pointer-events-none" />

        {/* Khối xoay toàn cục */}
        <div
          className={`relative flex flex-col items-center justify-center will-change-transform ${
            isInteracting ? 'transition-none' : 'transition-transform duration-300 ease-out'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* TỜ 1 (GỐC Ở TRÊN CÙNG) */}
          <div
            className="relative will-change-transform border-x border-white/20 select-none rounded-none bg-[#111]"
            style={{
              width: `${panelWidth}px`,
              height: `${panelHeight}px`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: `translateY(-${panelHeight * 0.8}px) rotateX(${isOpen ? 0 : -foldAngle * 0.5}deg)`,
              transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            <img
              src={SPOTIFLYER_PAGES[0]}
              alt="Spotiflyer - Luật chơi 1"
              referrerPolicy="no-referrer"
              loading="eager"
              className="w-full h-full object-cover select-none pointer-events-none rounded-none"
            />
            {/* Hiệu ứng bóng ánh sáng nếp gấp */}
            <div
              className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.3) 100%)',
                opacity: isOpen ? 0.05 : 0.45,
              }}
            />

            {/* TỜ 2 (NỐI TIẾP CẠNH ĐÁY TỜ 1 - GẬP NGƯỢC CHIỀU) */}
            <div
              className="absolute left-0 w-full will-change-transform border-x border-white/20 select-none rounded-none bg-[#111]"
              style={{
                top: `${panelHeight}px`,
                height: `${panelHeight}px`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transform: `rotateX(${foldAngle}deg)`,
                transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              <img
                src={SPOTIFLYER_PAGES[1]}
                alt="Spotiflyer - Luật chơi 2"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover select-none pointer-events-none rounded-none"
              />
              <div
                className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.06) 60%, rgba(0,0,0,0.2) 100%)',
                  opacity: isOpen ? 0.05 : 0.6,
                }}
              />

              {/* TỜ 3 (NỐI TIẾP CẠNH ĐÁY TỜ 2 - GẬP TIẾP NỐI) */}
              <div
                className="absolute left-0 w-full will-change-transform border-x border-white/20 select-none rounded-none bg-[#111]"
                style={{
                  top: `${panelHeight}px`,
                  height: `${panelHeight}px`,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'top center',
                  transform: `rotateX(${-foldAngle * 2}deg)`,
                  transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                }}
              >
                <img
                  src={SPOTIFLYER_PAGES[2]}
                  alt="Spotiflyer - Luật chơi 3"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                />
                <div
                  className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.3) 100%)',
                    opacity: isOpen ? 0.05 : 0.5,
                  }}
                />

                {/* TỜ 4 (NỐI TIẾP CẠNH ĐÁY TỜ 3 - GẬP CUỐI CÙNG) */}
                <div
                  className="absolute left-0 w-full will-change-transform border-x border-b border-white/20 select-none rounded-none bg-[#111]"
                  style={{
                    top: `${panelHeight}px`,
                    height: `${panelHeight}px`,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'top center',
                    transform: `rotateX(${foldAngle * 2}deg)`,
                    transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  }}
                >
                  <img
                    src={SPOTIFLYER_PAGES[3]}
                    alt="Spotiflyer - Luật chơi 4"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="w-full h-full object-cover select-none pointer-events-none rounded-none"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none select-none transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.05) 60%, rgba(0,0,0,0.2) 100%)',
                      opacity: isOpen ? 0.05 : 0.65,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
