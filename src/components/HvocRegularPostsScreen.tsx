import React from 'react';
import { AppLanguage } from '../types';

interface HvocRegularPostsScreenProps {
  onBack: () => void;
  language?: AppLanguage;
}

interface GalleryItem {
  id: string;
  number: string;
  titleVi: string;
  titleEn: string;
  url: string;
}

const REGULAR_POST_IMAGES: GalleryItem[] = [
  {
    id: 'emp-hvoc-bonding',
    number: '01',
    titleVi: 'HVOC BONDING',
    titleEn: 'HVOC BONDING',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20BONDING/%5BHVOC%5D%20BONDING.webp',
  },
  {
    id: 'emp-hvoc-maudong',
    number: '02',
    titleVi: 'MÁU ĐÔNG - "SÁT THỦ" ẨN DANH?',
    titleEn: 'MÁU ĐÔNG - "SÁT THỦ" ẨN DANH?',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20M%C3%A1u%20%C4%91%C3%B4ng/%5BHVOC%5D%20M%C3%A1u%20%C4%91%C3%B4ng.webp',
  },
];

export const HvocRegularPostsScreen: React.FC<HvocRegularPostsScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div 
      id="scene-hvoc-regular-posts"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-regular-posts-back-desktop"
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
          id="btn-regular-posts-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính: Dàn 2 ảnh vuông của Bài đăng thông thường */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        
        {/* Tiêu đề dự án */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white">
            {isEn ? 'REGULAR POSTS' : 'BÀI ĐĂNG THÔNG THƯỜNG'}
          </h1>
        </div>

        {/* Danh sách hình ảnh được dàn phẳng chỉn chu */}
        <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
          
          {REGULAR_POST_IMAGES.map((item) => (
            <div 
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="w-full flex flex-col items-start bg-transparent select-none"
            >
              {/* Nhãn thông tin từng hình */}
              <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                    {item.number}
                  </span>
                  <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                    {isEn ? item.titleEn : item.titleVi}
                  </span>
                  {/* Tool icon: Canva bé */}
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

              {/* Khung chứa ảnh vuông: Không viền, không bo góc, không hiệu ứng hover, căn giữa cân đối */}
              <div 
                className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-default"
                style={{
                  maxWidth: '640px',
                  margin: '0 auto',
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
                    aspectRatio: '1 / 1',
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
