import React from 'react';

interface HvocBuuDienScreenProps {
  onBack: () => void;
  language?: 'vi' | 'en';
}

interface GalleryItem {
  id: string;
  number: string;
  titleVi: string;
  titleEn: string;
  subtextVi?: string;
  subtextEn?: string;
  url: string;
  aspectRatio: string;
  crop?: boolean;
  linkUrl?: string;
  isVideo?: boolean;
}

const BUU_DIEN_IMAGES: GalleryItem[] = [
  {
    id: 'buu-dien-chinh',
    number: '01',
    titleVi: 'CHÍNH',
    titleEn: 'MAIN VISUAL',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20B%C6%B0u%20%C4%91i%E1%BB%87n%20HVOC/Ch%C3%ADnh.webp',
    aspectRatio: '1 / 1',
  },
  {
    id: 'buu-dien-quang-ba',
    number: '02',
    titleVi: 'QUẢNG BÁ',
    titleEn: 'PROMOTIONAL',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20B%C6%B0u%20%C4%91i%E1%BB%87n%20HVOC/Qu%E1%BA%A3ng%20b%C3%A1.png',
    aspectRatio: '16 / 9',
  },
  {
    id: 'buu-dien-bia-fb',
    number: '03',
    titleVi: 'ẢNH BÌA FACEBOOK / ẢNH BÌA GOOGLE FORM',
    titleEn: 'FACEBOOK COVER / GOOGLE FORM COVER',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20B%C6%B0u%20%C4%91i%E1%BB%87n%20HVOC/%E1%BA%A2nh%20b%C3%ACa%20Facebook.webp',
    aspectRatio: '4 / 1',
  },
  {
    id: 'buu-dien-video',
    number: '04',
    titleVi: 'VIDEO GIỚI THIỆU',
    titleEn: 'INTRODUCTORY VIDEO',
    subtextVi: '(bấm vào hình để tiếp tục)',
    subtextEn: '(click on image to continue)',
    url: 'https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/Employer/%5BHVOC%5D%20B%C6%B0u%20%C4%91i%E1%BB%87n%20HVOC/%E1%BA%A2nh%20b%C3%ACa%20Facebook.webp',
    aspectRatio: '16 / 9',
    crop: true,
    linkUrl: 'https://www.facebook.com/share/v/19qxDLrBbK/',
    isVideo: true,
  },
];

export const HvocBuuDienScreen: React.FC<HvocBuuDienScreenProps> = ({ onBack, language = 'vi' }) => {
  const isEn = language === 'en';

  return (
    <div 
      id="scene-hvoc-buu-dien"
      className="relative w-screen h-[calc(var(--vh,1vh)*100)] bg-black text-white overflow-x-hidden overflow-y-auto z-50 select-none no-scrollbar flex flex-col"
    >
      {/* Nút "trở về" / "back" cố định cho Desktop ở góc trên bên trái */}
      <div className="hidden md:block fixed md:top-8 md:left-10 lg:top-10 lg:left-14 z-50 select-none">
        <button
          type="button"
          id="btn-buu-dien-back-desktop"
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
          id="btn-buu-dien-back-mobile"
          onClick={onBack}
          className="font-archivo font-normal normal-case text-xs sm:text-sm tracking-normal text-white/60 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 outline-none select-none rounded-none"
          title={isEn ? 'Back to HVOC' : 'Trở về trang HVOC'}
        >
          {isEn ? 'back' : 'trở về'}
        </button>
      </div>

      {/* Nội dung chính: Dàn toàn bộ 3 hình ảnh của Bưu điện HVOC */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-4 md:pt-16 pb-20 flex flex-col items-center">
        
        {/* Tiêu đề dự án */}
        <div className="w-full mb-10 md:mb-14 flex flex-col items-start select-none">
          <h1 className="font-archivo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white">
            BƯU ĐIỆN HVOC (2025)
          </h1>
        </div>

        {/* Danh sách hình ảnh được dàn phẳng chỉn chu */}
        <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
          
          {BUU_DIEN_IMAGES.map((item) => (
            <div 
              key={item.id}
              id={`gallery-item-${item.id}`}
              className="w-full flex flex-col items-start bg-transparent select-none"
            >
              {/* Nhãn thông tin từng hình (kèm subtext nếu có) */}
              <div className="w-full flex items-baseline pb-2.5 mb-3 text-white border-none">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="font-archivo font-normal text-[#89CC04] text-xs sm:text-sm">
                    {item.number}
                  </span>
                  <span className="font-archivo font-bold text-sm sm:text-base tracking-wide uppercase text-white">
                    {isEn ? item.titleEn : item.titleVi}
                  </span>
                  {/* Tool icons: Canva bé và Filmora nếu có video */}
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <img 
                      src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/canva.webp"
                      alt="Canva"
                      title="Canva"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    {item.isVideo && (
                      <img 
                        src="https://raw.githubusercontent.com/boulevardphat/Kho-multimedia-c-a-Blvd/main/blvdarchive/Boulevard1st/iconpack/filmora.webp"
                        alt="Filmora"
                        title="Filmora"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-none select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  {(item.subtextVi || item.subtextEn) && (
                    <span className="font-archivo font-light text-xs sm:text-sm text-white/50 normal-case tracking-normal">
                      {isEn ? item.subtextEn : item.subtextVi}
                    </span>
                  )}
                </div>
              </div>

              {/* Khung chứa ảnh: Không viền, không bo góc, không hiệu ứng hover */}
              {item.linkUrl ? (
                <a
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-pointer block"
                  style={{
                    maxWidth: item.aspectRatio === '1 / 1' ? '640px' : '100%',
                    margin: item.aspectRatio === '1 / 1' ? '0 auto' : undefined,
                    aspectRatio: item.aspectRatio,
                  }}
                  title={isEn ? 'Click image to watch video' : 'Bấm vào hình để xem video'}
                >
                  <img
                    src={item.url}
                    alt={item.titleVi}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className={`w-full ${item.crop ? 'h-full object-cover object-center' : 'h-auto object-contain'} select-none pointer-events-none`}
                  />
                </a>
              ) : (
                <div 
                  className="w-full relative overflow-hidden bg-transparent border-none rounded-none flex items-center justify-center cursor-default"
                  style={{
                    maxWidth: item.aspectRatio === '1 / 1' ? '640px' : '100%',
                    margin: item.aspectRatio === '1 / 1' ? '0 auto' : undefined,
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.titleVi}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className={`w-full ${item.crop ? 'h-full object-cover object-center' : 'h-auto object-contain'} select-none pointer-events-none`}
                    style={item.crop ? undefined : {
                      aspectRatio: item.aspectRatio,
                    }}
                  />
                </div>
              )}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};
