import React, { useEffect, useState } from 'react';

export interface IntroClockProps {
  mode?: 'normal' | 'reverse-mirrored' | 'multiple';
  onComplete?: () => void;
}

export const IntroClock: React.FC<IntroClockProps> = ({ mode = 'normal', onComplete }) => {
  const [timeStr, setTimeStr] = useState('');
  const [visibleDistance, setVisibleDistance] = useState<number>(0);
  const probeRef = React.useRef<HTMLDivElement>(null);

  // Calculate dynamic line count based on viewport width/height so it fills and bleeds ("tràn tràn")
  // without creating dozens of hidden offscreen rows on wide/horizontal tabs
  const [lineCount, setLineCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 25;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const isLandscape = vw > vh;
    const fontPx = Math.min(60.8, Math.max(22.4, 0.042 * vw));
    const lineHeight = fontPx * 1.15;
    const gapPx = vh * (isLandscape ? 0.015 : 0.005);
    const totalLineHeight = Math.max(24, lineHeight + gapPx);
    const needed = Math.ceil(vh / totalLineHeight);
    const oddNeeded = needed % 2 === 0 ? needed + 1 : needed;
    return Math.max(7, oddNeeded + 2);
  });

  // Refine line count with real measured probe line height on mount and window resize
  useEffect(() => {
    if (mode !== 'multiple') return;

    const calcLines = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isLandscape = vw > vh;
      const measuredHeight = probeRef.current ? probeRef.current.offsetHeight : 0;
      const fontPx = Math.min(60.8, Math.max(22.4, 0.042 * vw));
      const lineHeight = measuredHeight > 10 ? measuredHeight : fontPx * 1.15;
      const gapPx = vh * (isLandscape ? 0.015 : 0.005);
      const totalLineHeight = Math.max(24, lineHeight + gapPx);

      const needed = Math.ceil(vh / totalLineHeight);
      const oddNeeded = needed % 2 === 0 ? needed + 1 : needed;
      const count = Math.max(7, oddNeeded + 2);
      setLineCount(count);
    };

    calcLines();
    window.addEventListener('resize', calcLines);
    window.addEventListener('orientationchange', calcLines);
    return () => {
      window.removeEventListener('resize', calcLines);
      window.removeEventListener('orientationchange', calcLines);
    };
  }, [mode]);

  // Stepped sequential appearance with fixed speed (40ms per step from center outwards)
  // Runs until all lines have appeared, holds briefly, and triggers onComplete
  useEffect(() => {
    if (mode !== 'multiple') return;

    let hasCompleted = false;
    let animId: number;
    let holdTimeout: NodeJS.Timeout;

    const startTime = performance.now();
    const stepDuration = 40; // Fixed speed: 40ms per step from center outwards
    const maxDist = Math.floor(lineCount / 2);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const currentDist = Math.min(maxDist, Math.floor(elapsed / stepDuration));
      setVisibleDistance(currentDist);

      if (currentDist < maxDist) {
        animId = requestAnimationFrame(tick);
      } else if (!hasCompleted) {
        hasCompleted = true;
        // All rows have appeared ("chạy hết rồi mới vô")
        // Hold for 360ms with full visual composition before entering main app
        holdTimeout = setTimeout(() => {
          onComplete?.();
        }, 360);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(holdTimeout);
    };
  }, [mode, lineCount, onComplete]);

  useEffect(() => {
    const startTimeMs = Date.now();

    const updateClock = () => {
      let nowMs = Date.now();
      if (mode === 'reverse-mirrored') {
        const diff = nowMs - startTimeMs;
        // Run backwards at normal speed
        nowMs = startTimeMs - diff; 
      }
      const now = new Date(nowMs);
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setTimeStr(`${hrs} : ${mins} : ${secs} : ${ms}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 16); // ~60fps high speed update

    return () => {
      clearInterval(interval);
    };
  }, [mode]);

  const getTransform = () => {
    if (mode === 'reverse-mirrored') return 'scaleX(-1)';
    return 'none';
  };

  const ClockDisplay: React.FC<{ text?: string; visible?: boolean }> = ({ text, visible = true }) => (
    <div 
      className="font-archivo font-normal text-[clamp(1.4rem,4.2vw,3.8rem)] text-white/95 tracking-[0.05em] select-none pointer-events-none tabular-nums"
      style={{ 
        transform: getTransform(),
        visibility: visible ? 'visible' : 'hidden',
        transition: 'none',
      }}
    >
      {text || timeStr}
    </div>
  );

  const centerIndex = Math.floor(lineCount / 2);

  return (
    <div 
      id="scene-clock"
      className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 select-none overflow-hidden gap-[calc(var(--vh,1vh)*0.5)] landscape:gap-[calc(var(--vh,1vh)*1.5)]"
    >
      {/* Invisible probe to measure exact rendered font height */}
      <div 
        ref={probeRef}
        className="font-archivo font-normal text-[clamp(1.4rem,4.2vw,3.8rem)] tracking-[0.05em] select-none pointer-events-none tabular-nums whitespace-nowrap absolute -left-[9999px] -top-[9999px] opacity-0"
        aria-hidden="true"
      >
        DIGITAL ARCHIVE ED.
      </div>

      {mode === 'multiple' ? (
        Array.from({ length: lineCount }).map((_, i) => {
          const dist = Math.abs(i - centerIndex);
          const isVisible = dist <= visibleDistance;
          return (
            <ClockDisplay 
              key={i} 
              text="DIGITAL ARCHIVE ED." 
              visible={isVisible}
            />
          );
        })
      ) : (
        <ClockDisplay />
      )}
    </div>
  );
};
