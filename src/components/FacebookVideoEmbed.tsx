import React, { useEffect, useRef, useState } from 'react';

interface FacebookVideoEmbedProps {
  url: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
}

export const FacebookVideoEmbed: React.FC<FacebookVideoEmbedProps> = ({
  url,
  title = 'Facebook Video',
  aspectRatio = '16 / 9',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  useEffect(() => {
    // 1. Đảm bảo thẻ div #fb-root tồn tại trong DOM
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.prepend(fbRoot);
    }

    // 2. Kích hoạt phân giải XFBML bằng Facebook SDK nếu có
    const parseXfbml = () => {
      const fb = (window as unknown as { FB?: { XFBML?: { parse?: (el?: HTMLElement) => void } } }).FB;
      if (fb?.XFBML?.parse && containerRef.current) {
        try {
          fb.XFBML.parse(containerRef.current);
        } catch {
          setUseIframeFallback(true);
        }
      }
    };

    const fb = (window as unknown as { FB?: { XFBML?: { parse?: (el?: HTMLElement) => void } } }).FB;
    if (fb) {
      parseXfbml();
    } else {
      // Dự phòng nếu SDK không tải được sau 2 giây (chặn tracking, mạng lag, v.v.)
      const timer = setTimeout(() => {
        const currentFb = (window as unknown as { FB?: unknown }).FB;
        if (currentFb) {
          parseXfbml();
        } else {
          setUseIframeFallback(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(url);
  const iframeSrc = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=1280&height=720&allowfullscreen=true&quality=hd`;

  return (
    <div 
      className={`w-full h-full relative overflow-hidden bg-black border-none rounded-none flex items-center justify-center select-none ${className}`}
      style={{ aspectRatio }}
    >
      {useIframeFallback ? (
        <iframe
          src={iframeSrc}
          title={title}
          className="w-full h-full border-none rounded-none"
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
            data-href={url}
            data-width="1280"
            data-show-text="false"
            data-allowfullscreen="true"
            data-autoplay="false"
            data-lazy="true"
          />
        </div>
      )}
    </div>
  );
};
