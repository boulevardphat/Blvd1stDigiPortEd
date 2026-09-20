import React from 'react';
import { AppLanguage } from '../types';
import Lanyard from './Lanyard';
import { DdoPanoramicStrap } from './DdoPanoramicStrap';

interface HvocDdo7ScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

interface GalleryImageItem {
  id: string;
  number: string;
  titleVi: string;
  titleEn: string;
  subtextVi?: string;
  subtextEn?: string;
  url: string;
  aspectRatio: string;
  maxWidth?: string;
}

const DDO7_LAYOUTS: GalleryImageItem[] = [
  {
    id: 'ddo7-layout-1',
    number: '05',
    titleVi: 'LAYOUT 1',
    titleEn: 'LAYOUT 1',
    subtextVi: 'MỞ ĐẦU',
    subtextEn: 'OPENING',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Template%20m%E1%BB%9F%20%C4%91%E1%BA%A7u.webp',
    aspectRatio: '16 / 9',
  },
  {
    id: 'ddo7-layout-2',
    number: '06',
    titleVi: 'LAYOUT 2',
    titleEn: 'LAYOUT 2',
    subtextVi: 'CHÍNH',
    subtextEn: 'MAIN',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Template%20ch%C3%ADnh.webp',
    aspectRatio: '16 / 9',
  },
  {
    id: 'ddo7-layout-3',
    number: '07',
    titleVi: 'LAYOUT 3',
    titleEn: 'LAYOUT 3',
    subtextVi: 'KẾT THÚC',
    subtextEn: 'CLOSING',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Template%20k%E1%BA%BFt%20th%C3%BAc.webp',
    aspectRatio: '16 / 9',
  },
];

export const HvocDdo7Screen: React.FC<HvocDdo7ScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div 
      id="scene-hvoc-ddo7"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-ddo7-back-desktop"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nút "trở về" / "back" cho Mobile: Đặt trong luồng nội dung đầu trang */}
      <div className="block md:hidden w-full px-6 pt-6 pb-2 shrink-0 select-none">
        <button
          type="button"
          id="btn-ddo7-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính: Dàn toàn bộ tài nguyên hình ảnh của DDO 7 */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        
        {/* Tiêu đề dự án */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white">
            ĐƯỜNG ĐẾN OZONE 7 (DDO)
          </h1>
        </div>

        {/* Danh sách các phần tử được dàn phẳng theo chuẩn Boulevard1st */}
        <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
          
          {/* 01. POSTER / VIDEO GIỚI THIỆU */}
          <div id="gallery-item-ddo7-poster" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">01</span>
                <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                  POSTER / {isEn ? 'INTRO VIDEO' : 'VIDEO GIỚI THIỆU'}
                </span>
                <span className="font-archivo font-light text-xs sm:text-sm text-white/50 normal-case tracking-normal">
                  {isEn ? 'click poster to watch video' : 'bấm vô poster để xem video'}
                </span>
              </div>
            </div>
            <a 
              href="https://www.facebook.com/share/v/18x5EhavfH/"
              target="_blank"
              rel="noopener noreferrer"
              title={isEn ? 'Click poster to watch video' : 'Bấm vô poster để xem video'}
              className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-pointer group transition-opacity hover:opacity-95"
              style={{ maxWidth: '560px', margin: '0 auto' }}
            >
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Poster.webp"
                alt="HVOC DDO 7 - Poster"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain select-none"
                style={{ aspectRatio: '1414 / 2000' }}
              />
            </a>
          </div>

          {/* 02. KHUNG AVATAR */}
          <div id="gallery-item-ddo7-avatar" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">02</span>
                <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                  {isEn ? 'AVATAR FRAME' : 'KHUNG AVATAR'}
                </span>
              </div>
            </div>
            <div 
              className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-default"
              style={{ maxWidth: '640px', margin: '0 auto' }}
            >
              <img
                src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Khung%20avatar.webp"
                alt="HVOC DDO 7 - Khung avatar"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain select-none pointer-events-none"
                style={{ aspectRatio: '1 / 1' }}
              />
            </div>
          </div>

          {/* 03. THẺ ĐEO (React Bits Lanyard tương tác vật lý rapier) */}
          <div id="gallery-item-ddo7-thedeo" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-2.5 mb-1 text-white border-none">
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">03</span>
                <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                  {isEn ? 'EVENT BADGE' : 'THẺ ĐEO'}
                </span>
                <span className="font-archivo font-light text-xs sm:text-sm text-white/50 normal-case tracking-normal">
                  {isEn ? 'drag card, scroll wheel or pinch to zoom' : 'kéo lắc thẻ, cuộn chuột hoặc chụm tay để zoom'}
                </span>
              </div>
            </div>
            <div className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center">
              <Lanyard
                position={[0, 0, 18]}
                gravity={[0, -40, 0]}
                fov={20}
                frontImage="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20HVOC%20DDO%207/Th%E1%BA%BB%20%C4%91eo.webp"
                imageFit="cover"
                transparent={true}
                lanyardWidth={1}
              />
            </div>
          </div>

          {/* 04. DÂY ĐEO (Panoramic Strap trượt ngang tự động & mở rộng cuộn tay) */}
          <div id="gallery-item-ddo7-daydeo" className="w-full flex flex-col items-start bg-transparent select-none">
            <div className="w-full flex items-baseline pb-2.5 mb-1 text-white border-none">
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">04</span>
                <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                  {isEn ? 'LANYARD STRAP' : 'DÂY ĐEO'}
                </span>
              </div>
            </div>
            <div className="w-full">
              <DdoPanoramicStrap language={language} />
            </div>
          </div>

          {/* CHÚ THÍCH GIẢI THÍCH KHÁI NIỆM LAYOUT */}
          <div className="w-full border border-white/10 bg-black/40 p-4 sm:p-5 rounded-none select-none">
            <p className="font-archivo text-xs sm:text-sm text-white/80 leading-relaxed font-normal text-justify">
              <span className="font-bold text-white uppercase tracking-wider mr-2">
                {isEn ? 'CONCEPT NOTE:' : 'GHI CHÚ:'}
              </span>
              {isEn
                ? 'Layouts are pre-designed broadcast templates created according to the event concept, imported into OBS Studio to serve as master frames holding and organizing feeds from multiple cameras or computers.'
                : 'Layout là dạng thiết kế có sẵn theo concept của sự kiện, được đưa vào OBS Studio để sử dụng như khung chuẩn chứa và phân bổ một hoặc nhiều khung hình thu từ nhiều máy quay hoặc máy tính khác nhau.'}
            </p>
          </div>

          {/* 05, 06, 07. LAYOUT 1, LAYOUT 2, LAYOUT 3 */}
          {DDO7_LAYOUTS.map((item) => (
            <div 
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="w-full flex flex-col items-start bg-transparent select-none"
            >
              {/* Nhãn thông tin từng hình */}
              <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                  <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                    {item.number}
                  </span>
                  <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                    {isEn ? item.titleEn : item.titleVi}
                  </span>
                  {(item.subtextVi || item.subtextEn) && (
                    <span className="font-archivo font-light text-xs sm:text-sm text-white/50 normal-case tracking-normal">
                      {isEn ? item.subtextEn : item.subtextVi}
                    </span>
                  )}
                </div>
              </div>

              {/* Khung chứa ảnh: Không viền khung trên desktop/mobile, không bo góc, không hiệu ứng hover */}
              <div 
                className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-default"
                style={{
                  maxWidth: item.maxWidth || '100%',
                  margin: item.maxWidth ? '0 auto' : undefined,
                }}
              >
                <img
                  src={item.url}
                  alt={item.titleVi}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                  style={{
                    aspectRatio: item.aspectRatio,
                  }}
                />
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};
