import React, { useRef, useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { SpotiflyerVerticalZFold } from './SpotiflyerVerticalZFold';

interface TntnIntroScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

export const TNTN_CHV_LOGO_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/TNTN%20CHV.png';
export const CDTTBP_VII_TNTN_LOGO_URL = 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/CDTTBP%20VII%20TNTN.png';

export const TntnIntroScreen: React.FC<TntnIntroScreenProps> = ({ onBack, language = 'vi' }) => {
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
  const desktopWidth = viTitleWidth || titleWidth || 560;

  // Khối giới thiệu Spotiflyer (Tiêu đề, Luật chơi 4 bước và Model 3D 4 tờ gấp ziczac dọc)
  const renderSpotiflyerSection = (layoutIdPrefix: string) => (
    <div id={`${layoutIdPrefix}-spotiflyer-block`} className="w-full flex flex-col items-start justify-start select-none">
      {/* Tiêu đề Spotiflyer */}
      <div className="w-fit flex flex-col items-start mb-5 sm:mb-6">
        <span className="font-archivo font-normal text-[#89CC04] text-[0.72em] sm:text-[0.8em] uppercase tracking-wider mb-1 select-none">
          {isEn ? 'DECODING GAME' : 'TRÒ CHƠI GIẢI MÃ'}
        </span>
        <h2 className="font-archivo font-bold text-2xl sm:text-3xl lg:text-[2.35rem] tracking-tight uppercase leading-[1.15] text-white select-none">
          SPOTIFLYER
        </h2>
        <span className="font-archivo font-medium text-white/50 text-xs sm:text-sm uppercase tracking-widest mt-1 select-none">
          {isEn ? 'RULES OF PLAY' : 'LUẬT CHƠI'}
        </span>
      </div>

      {/* 4 bước luật chơi */}
      <div className="w-full flex flex-col space-y-3 sm:space-y-3.5 mb-7 sm:mb-8 text-white/85 font-archivo font-light text-xs sm:text-sm md:text-[14.5px] leading-relaxed select-none">
        {/* Bước 1 */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          <span className="font-archivo font-medium not-italic text-[#89CC04] text-[0.85em] sm:text-[0.95em] shrink-0 mt-[1px] select-none">
            01
          </span>
          <p className="flex-1 text-justify">
            {isEn ? 'Use Spotify to scan the code.' : 'Dùng Spotify để quét mã.'}
          </p>
        </div>

        {/* Bước 2 */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          <span className="font-archivo font-medium not-italic text-[#89CC04] text-[0.85em] sm:text-[0.95em] shrink-0 mt-[1px] select-none">
            02
          </span>
          <p className="flex-1 text-justify">
            {isEn 
              ? 'While listening, look for keywords indicating directions or locations based on the lyrics (via Spotify Premium or Genius). If directed to an artist profile, search on Google for information regarding their origin/hometown.'
              : 'Vừa nghe vừa dựa vào lời bài hát (Spotify Premium hoặc Genius) tìm các từ khóa chỉ phương hướng/địa điểm. Nếu đó là trang nghệ sĩ thì tìm kiếm thông tin về xuất thân trên Google.'}
          </p>
        </div>

        {/* Bước 3 */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          <span className="font-archivo font-medium not-italic text-[#89CC04] text-[0.85em] sm:text-[0.95em] shrink-0 mt-[1px] select-none">
            03
          </span>
          <p className="flex-1 text-justify">
            {isEn
              ? '(Only once the location or artist\'s origin is identified) Use a world map to determine the direction "as the crow flies" from Vietnam to that destination on the map.'
              : '(Chỉ khi tìm được địa điểm/xuất thân nghệ sĩ) Sử dụng bản đồ thế giới để xác định hướng chim bay từ Việt Nam đến điểm đó trên bản đồ.'}
          </p>
        </div>

        {/* Bước 4 */}
        <div className="flex items-start gap-3 sm:gap-3.5">
          <span className="font-archivo font-medium not-italic text-[#89CC04] text-[0.85em] sm:text-[0.95em] shrink-0 mt-[1px] select-none">
            04
          </span>
          <p className="flex-1 text-justify">
            {isEn
              ? 'After determining the directional heading, use the local area map to navigate and move.'
              : 'Sau khi xác định được phương hướng, sử dụng bản đồ khu vực để di chuyển.'}
          </p>
        </div>
      </div>

      {/* Model 3D 4 tờ gấp ziczac theo chiều từ trên xuống dưới */}
      <div className="w-full">
        <SpotiflyerVerticalZFold id={`${layoutIdPrefix}-spotiflyer-3d`} isEn={isEn} />
      </div>
    </div>
  );

  return (
    <div 
      id="scene-tntn-intro"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-40 select-none no-scrollbar flex flex-col justify-between"
    >
      {/* Thẻ chuẩn ẩn để đo chính xác độ rộng của tiêu đề tiếng Việt trên mọi kích cỡ màn hình */}
      <span 
        ref={viTitleRef}
        aria-hidden="true"
        className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none select-none font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] tracking-tight uppercase leading-[1.15] whitespace-nowrap"
      >
        ĐỘI THANH NIÊN TÌNH NGUYỆN
      </span>

      {/* Nút "trở về" / "back" cho Desktop: Cố định góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-tntn-back-desktop"
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
          id="btn-tntn-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to Main Page' : 'Trở về trang chính'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Vùng nội dung chính: Bố cục 2 cột (Cột bên trái chứa thông tin, Cột bên phải để trống theo yêu cầu) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-8 md:py-16 lg:py-20 flex flex-col lg:flex-row lg:items-start justify-between gap-12 lg:gap-16 xl:gap-24">
        
        {/* Cột bên trái: Logo, Tiêu đề Đội TNTN & Đoạn văn bản giới thiệu, cùng khối Chiến dịch Trái Tim Bên Phải Mùa VII ở ngay dưới */}
        <div className="flex-1 max-w-2xl flex flex-col items-start justify-start">
          
          {/* PHẦN 1: ĐỘI THANH NIÊN TÌNH NGUYỆN */}
          {/* Khung ảnh chứa 2 logo Đội TNTN và Chuyên Hùng Vương */}
          <div 
            id="tntn-logo-frame"
            className="mb-6 sm:mb-8 flex items-center justify-start select-none"
          >
            <img
              src={TNTN_CHV_LOGO_URL}
              alt="Logo Đội TNTN và Chuyên Hùng Vương"
              referrerPolicy="no-referrer"
              loading="eager"
              className="h-14 sm:h-16 md:h-20 lg:h-22 w-auto object-contain select-none pointer-events-none rounded-none"
            />
          </div>

          {/* Tiêu đề chính của Đội TNTN */}
          <h1 
            ref={titleRef}
            id="tntn-main-title"
            className="w-fit font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] tracking-tight uppercase leading-[1.15] text-white mb-5 sm:mb-6 select-none"
          >
            {isEn ? (
              <>
                TNTN TEAM
                <br />
                HUNG VUONG FOR THE GIFTED
              </>
            ) : (
              <>
                ĐỘI THANH NIÊN TÌNH NGUYỆN
                <br />
                CHUYÊN HÙNG VƯƠNG
              </>
            )}
          </h1>

          {/* Đoạn văn bản giới thiệu Đội TNTN */}
          <p 
            id="tntn-description-text"
            className="font-archivo font-light text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/80 select-none mb-10 sm:mb-12 md:mb-14"
            style={{
              width: isDesktop && desktopWidth ? `${desktopWidth}px` : undefined,
              maxWidth: isDesktop && desktopWidth ? `${desktopWidth}px` : '100%',
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}
          >
            {isEn
              ? "Established in 2012, the TNTN Team Hung Vuong for the Gifted is dedicated to organizing volunteer activities that support disadvantaged individuals in the Thu Dau Mot Ward and neighboring areas of Ho Chi Minh City. Additionally, the team serves as a platform for students to directly participate in the activities of the school's Ho Chi Minh Communist Youth Union. Thuan Phat became a member in 2023. During his time there, he developed Spotiflyer-a decoding game that combines music and spatial orientation-to serve the team's initiatives."
              : 'Đội Thanh niên Tình nguyện Chuyên Hùng Vương được thành lập vào năm 2012 với sứ mệnh tổ chức các hoạt động tình nguyện, hỗ trợ các hoàn cảnh khó khăn trên địa bàn Phường Thủ Dầu Một và các khu vực lân cận thuộc Thành phố Hồ Chí Minh. Bên cạnh đó, Đội còn là cầu nối tạo điều kiện cho học sinh trực tiếp tham gia vào các phong trào của Đoàn Thanh niên Cộng sản Hồ Chí Minh tại trường. Thuận Phát chính thức gia nhập Đội từ năm 2023. Trong quá trình hoạt động, Phát đã xây dựng nên Spotiflyer - một trò chơi giải mã độc đáo kết hợp giữa âm nhạc và định hướng không gian nhằm phục vụ cho các chương trình của Đội.'}
          </p>

          {/* TRÊN MOBILE: GIỚI THIỆU SPOTIFLYER XUẤT HIỆN NGAY DƯỚI PHẦN GIỚI THIỆU ĐỘI TNTN */}
          <div className="block lg:hidden w-full mb-12 sm:mb-14 pt-6 border-t border-white/10">
            {renderSpotiflyerSection('mobile')}
          </div>

          {/* PHẦN 2: CHIẾN DỊCH TRÁI TIM BÊN PHẢI MÙA VII */}
          <div 
            id="tntn-cdttbp-section"
            className="w-full flex flex-col items-start justify-start pt-8 sm:pt-10 border-t border-white/10 lg:border-t-0"
          >
            {/* Khung ảnh chứa 2 logo ghép: CDTTBP VII và TNTN */}
            <div 
              id="cdttbp-logo-frame"
              className="mb-5 sm:mb-6 flex items-center justify-start select-none"
            >
              <img
                src={CDTTBP_VII_TNTN_LOGO_URL}
                alt="Logo Chiến dịch Trái tim bên phải Mùa VII và Đội TNTN"
                referrerPolicy="no-referrer"
                loading="eager"
                className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain select-none pointer-events-none rounded-none"
              />
            </div>

            {/* Tên chiến dịch: CHIẾN DỊCH TRÁI TIM BÊN PHẢI MÙA VII ("Heart on the Right" Campaign - Season VII) */}
            <h2 
              id="cdttbp-title"
              className="w-fit font-archivo font-bold text-xl sm:text-2xl md:text-3xl lg:text-[2rem] tracking-tight uppercase leading-[1.2] text-white mb-4 sm:mb-5 select-none"
            >
              {isEn ? (
                <>
                  "HEART ON THE RIGHT" CAMPAIGN - SEASON VII
                </>
              ) : (
                <>
                  CHIẾN DỊCH TRÁI TIM BÊN PHẢI MÙA VII
                </>
              )}
            </h2>

            {/* Đoạn mô tả chiến dịch Trái Tim Bên Phải Mùa VII */}
            <p 
              id="cdttbp-description-text"
              className="font-archivo font-light text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/80 select-none"
              style={{
                width: isDesktop && desktopWidth ? `${desktopWidth}px` : undefined,
                maxWidth: isDesktop && desktopWidth ? `${desktopWidth}px` : '100%',
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              {isEn
                ? 'The campaign is an annual initiative organized by the TNTN Team Hung Vuong for the Gifted. Thuan Phat participated in the "Heart on the Right" Campaign - Season VII as a content writer for the Content Sub-committee, under the campaign\'s Communications Department.'
                : 'Chiến dịch "Trái tim Bên Phải" là một hoạt động thường niên do Đội Thanh niên Tình nguyện Chuyên Hùng Vương tổ chức. Thuận Phát đã tham gia chiến dịch mùa VII với vai trò là người viết bài cho Tiểu ban Nội dung, trực thuộc Ban Truyền thông của chiến dịch.'}
            </p>
          </div>

        </div>

        {/* CỘT BÊN PHẢI (TRÊN DESKTOP): GIỚI THIỆU SPOTIFLYER (LUẬT CHƠI + MODEL 3D 4 TỜ GẤP ZICZAC DỌC) */}
        <div 
          id="tntn-right-column-desktop"
          className="hidden lg:flex flex-1 max-w-xl min-w-0 flex-col items-start justify-start"
        >
          {renderSpotiflyerSection('desktop')}
        </div>

      </div>

      {/* Chân trang trống giữ khoảng đệm thoáng đãng dưới cùng */}
      <div className="h-6 sm:h-10 md:h-12 w-full shrink-0 select-none pointer-events-none" />
    </div>
  );
};
