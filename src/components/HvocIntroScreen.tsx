import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage } from '../types';
import { HvocBuuDienScreen } from './HvocBuuDienScreen';
import { HvocDdo7Screen } from './HvocDdo7Screen';
import { HvocTar8Screen } from './HvocTar8Screen';
import { HvocClubDayScreen } from './HvocClubDayScreen';
import { HvocRegularPostsScreen } from './HvocRegularPostsScreen';

interface HvocIntroScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const HVOC_LOGO_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/logo%20HVOC%20v%C3%A0%20CHV.png';

export const HvocIntroScreen: React.FC<HvocIntroScreenProps> = ({ onBack, language = 'vi' }) => {
  const [activeProject, setActiveProject] = useState<'BUU_DIEN' | 'DDO_7' | 'TAR_8' | 'CLUB_DAY' | 'REGULAR_POSTS' | null>(null);
  const [activeBlankOption, setActiveBlankOption] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const viTitleRef = useRef<HTMLSpanElement>(null);
  const [titleWidth, setTitleWidth] = useState<number | null>(null);
  const [viTitleWidth, setViTitleWidth] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const isEn = language === 'en';

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (titleRef.current) {
        setTitleWidth(titleRef.current.offsetWidth);
      }
      if (viTitleRef.current) {
        setViTitleWidth(viTitleRef.current.offsetWidth);
      }
    };

    handleResize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (titleRef.current) {
          setTitleWidth(titleRef.current.offsetWidth);
        }
        if (viTitleRef.current) {
          setViTitleWidth(viTitleRef.current.offsetWidth);
        }
      });
      if (titleRef.current) ro.observe(titleRef.current);
      if (viTitleRef.current) ro.observe(viTitleRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [language]);

  // Chiều rộng đoạn văn trên desktop: Tiếng Anh sử dụng chung độ rộng chuẩn của Tiếng Việt để tránh bị hẹp
  const desktopWidth = viTitleWidth || titleWidth || 520;

  if (activeProject === 'BUU_DIEN') {
    return (
      <HvocBuuDienScreen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  if (activeProject === 'DDO_7') {
    return (
      <HvocDdo7Screen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  if (activeProject === 'TAR_8') {
    return (
      <HvocTar8Screen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  if (activeProject === 'CLUB_DAY') {
    return (
      <HvocClubDayScreen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  if (activeProject === 'REGULAR_POSTS') {
    return (
      <HvocRegularPostsScreen 
        onBack={() => setActiveProject(null)} 
        language={language} 
      />
    );
  }

  return (
    <div 
      id="scene-hvoc-intro"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-40 select-none no-scrollbar flex flex-col justify-between"
    >
      {/* Thẻ chuẩn ẩn để đo chính xác độ rộng của tiêu đề tiếng Việt trên mọi kích cỡ màn hình */}
      <span 
        ref={viTitleRef}
        aria-hidden="true"
        className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none select-none font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] tracking-tight uppercase leading-[1.15] whitespace-nowrap"
      >
        CÂU LẠC BỘ OLYMPIA
      </span>

      {/* Nút "trở về" / "back" cho Desktop: Khôi phục chính xác vị trí fixed góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-hvoc-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Main Page' : 'Trở về trang chính'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" cho Mobile: Đặt tự nhiên ở đầu trang để cuộn mượt mà không kẹt khi vuốt */}
      <div className="block md:hidden w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <button
          type="button"
          id="btn-hvoc-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Main Page' : 'Trở về trang chính'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Vùng nội dung chính: Bố cục responsive (Ngang chia 2 cột, Dọc xếp tuần tự trên dưới) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-8 md:py-24 flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16 xl:gap-24">
        
        {/* Cột bên trái: Logo, Tiêu đề câu lạc bộ & Đoạn văn bản giới thiệu */}
        <div className="flex-1 max-w-2xl flex flex-col items-start justify-center">
          {/* Khung ảnh chứa 2 logo HVOC và Chuyên Hùng Vương */}
          <div 
            id="hvoc-logo-frame"
            className="mb-6 sm:mb-8 flex items-center justify-start select-none"
          >
            <img
              src={HVOC_LOGO_URL}
              alt="Logo HVOC và Chuyên Hùng Vương"
              referrerPolicy="no-referrer"
              loading="eager"
              className="h-14 sm:h-16 md:h-20 lg:h-22 w-auto object-contain select-none pointer-events-none rounded-none"
            />
          </div>

          {/* Tiêu đề chính (VI: CÂU LẠC BỘ OLYMPIA / CHUYÊN HÙNG VƯƠNG, EN: HUNG VUONG / OLYMPIA CLUB) */}
          <h1 
            ref={titleRef}
            id="hvoc-main-title"
            className="w-fit font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] tracking-tight uppercase leading-[1.15] text-white mb-5 sm:mb-6 select-none"
          >
            {isEn ? (
              <>
                HUNG VUONG
                <br />
                OLYMPIA CLUB
              </>
            ) : (
              <>
                CÂU LẠC BỘ OLYMPIA
                <br />
                CHUYÊN HÙNG VƯƠNG
              </>
            )}
          </h1>

          {/* Đoạn văn bản giới thiệu: Độ rộng căn bằng đúng text box tiêu đề trên desktop (tiếng Anh và tiếng Việt cùng dùng chung độ rộng chuẩn đẹp) và căn đều 2 bên */}
          <p 
            id="hvoc-description-text"
            className="font-archivo font-light text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/80 select-none"
            style={{
              width: isDesktop && desktopWidth ? `${desktopWidth}px` : undefined,
              maxWidth: isDesktop && desktopWidth ? `${desktopWidth}px` : '100%',
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}
          >
            {isEn
              ? 'Founded in 2016, the Olympia Club of Hung Vuong High School for the Gifted (HVOC) is an academic club dedicated to providing multidisciplinary knowledge to students through media publications such as posts and short videos. Furthermore, the club creates an intellectual playground to seek out the most outstanding individuals to participate in the "Đường lên đỉnh Olympia" competition, organized annually by Vietnam Television (VTV). Some of the club\'s notable annual events include The Amazing Race (TAR) featuring a cipher-solving format, Bưu điện HVOC (HVOC Post Office), and the core selection program "Đường đến Ozone" (DDO).'
              : 'Được thành lập vào năm 2016, Câu lạc bộ Olympia Chuyên Hùng Vương (HVOC) là một trong những câu lạc bộ học thuật mang sứ mệnh lan tỏa tri thức đa ngành, đa lĩnh vực đến các bạn học sinh trong trường thông qua các ấn phẩm truyền thông như bài đăng, video ngắn... Không những thế, câu lạc bộ còn kiến tạo một sân chơi trí tuệ, từ đó tìm kiếm và bồi dưỡng những cá nhân xuất sắc nhất để đại diện tham gia chương trình "Đường lên đỉnh Olympia" do Đài Truyền hình Việt Nam tổ chức. Một số sự kiện thường niên mang dấu ấn của Câu lạc bộ có thể kể đến như: The Amazing Race (TAR) theo mô-típ giải mật thư, Bưu điện HVOC và cuộc thi Đường đến Ozone (DDO) nhằm tuyển chọn ra ứng cử viên sáng giá nhất.'}
          </p>
        </div>

        {/* Cột bên phải: Danh sách các option dự án giống phong cách Mục lục */}
        <div className="flex-1 flex flex-col justify-center lg:pl-8 xl:pl-12">
          <div className="flex flex-col space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 text-[clamp(1.1rem,2.5vw,1.95rem)] text-white/95 font-archivo font-medium tracking-tight leading-snug select-none uppercase">
            
            {/* Option 01: BƯU ĐIỆN HVOC (2025) */}
            <div 
              id="hvoc-option-buu-dien"
              onClick={() => setActiveProject('BUU_DIEN')}
              className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
            >
              <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
                01
              </span>
              <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
                BƯU ĐIỆN HVOC (2025)
              </span>
            </div>

            {/* Option 02: THE AMAZING RACE 8 (TAR) */}
            <div 
              id="hvoc-option-tar"
              onClick={() => setActiveProject('TAR_8')}
              className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
            >
              <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
                02
              </span>
              <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
                THE AMAZING RACE 8 (TAR)
              </span>
            </div>

            {/* Option 03: ĐƯỜNG ĐẾN OZONE 7 (DDO) */}
            <div 
              id="hvoc-option-ddo"
              onClick={() => setActiveProject('DDO_7')}
              className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
            >
              <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
                03
              </span>
              <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
                ĐƯỜNG ĐẾN OZONE 7 (DDO)
              </span>
            </div>

            {/* Option 04: VI: NGÀY HỘI CLB - ĐỘI - NHÓM (2025) / EN: CLUB DAY (2025) */}
            <div 
              id="hvoc-option-club-day"
              onClick={() => setActiveProject('CLUB_DAY')}
              className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
            >
              <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
                04
              </span>
              <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
                {isEn ? 'CLUB DAY (2025)' : 'NGÀY HỘI CLB - ĐỘI - NHÓM (2025)'}
              </span>
            </div>

            {/* Option 05: VI: BÀI ĐĂNG THÔNG THƯỜNG / EN: REGULAR POSTS */}
            <div 
              id="hvoc-option-post-thong-thuong"
              onClick={() => setActiveProject('REGULAR_POSTS')}
              className="w-fit flex items-baseline gap-3.5 sm:gap-4.5 cursor-pointer group"
            >
              <span className="font-archivo font-normal not-italic text-[#89CC04] text-[0.68em] shrink-0 select-none">
                05
              </span>
              <span className="hover-force-italic hover:text-white cursor-pointer transition-colors">
                {isEn ? 'REGULAR POSTS' : 'BÀI ĐĂNG THÔNG THƯỜNG'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Khoảng đệm chân trang để tránh tràn đáy */}
      <div className="h-6 md:h-10 shrink-0" />

      {/* Màn hình đen xì khi bấm vào bất kỳ option dự án nào */}
      {activeBlankOption && (
        <div 
          id="hvoc-blank-screen"
          onClick={() => setActiveBlankOption(null)}
          className="fixed inset-0 z-[100] bg-black cursor-pointer flex flex-col select-none"
        >
          {/* Nút "trở về" / "back" ở góc trên bên trái màn hình đen */}
          <div className="absolute top-6 left-6 md:top-8 md:left-10 lg:top-10 lg:left-14 z-[110]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveBlankOption(null);
              }}
              className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
              title={isEn ? 'Back' : 'Trở về'}
            >
              {isEn ? 'back' : 'trở về'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
