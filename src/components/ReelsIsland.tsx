import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaSlide } from "@/data/media";

interface Props {
  slides: MediaSlide[];
  autoplayMs?: number;
  mini?: boolean;
  offerSlidePromo?: string;
}

const OFFER_SLIDE_ID = "offer-joints";

const HERO_PHOTO_MS = 2000;
const HERO_PHOTO_INDICES = new Set([0, 1, 3]);

function hasMediaVariants(src: string): boolean {
  return src.startsWith("/media/");
}

function thumbSrc(slide: MediaSlide): string {
  if (slide.type === "video" && slide.poster) return slide.poster;
  if (hasMediaVariants(slide.src)) return slide.src.replace(/\.jpg$/i, ".webp");
  return slide.src;
}

export default function ReelsIsland({ slides, autoplayMs = 5500, mini = false, offerSlidePromo }: Props) {
  const [index, setIndex] = useState(0);
  const [advancePaused, setAdvancePaused] = useState(false);
  const [playbackPaused, setPlaybackPaused] = useState(false);
  const touchStartY = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideEnteredAt = useRef(Date.now());

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const selectSlide = useCallback((i: number) => {
    setIndex(i);
    setAdvancePaused(true);
    setPlaybackPaused(false);
  }, []);

  const manualNext = useCallback(() => {
    setAdvancePaused(true);
    setPlaybackPaused(false);
    goNext();
  }, [goNext]);

  const manualPrev = useCallback(() => {
    setAdvancePaused(true);
    setPlaybackPaused(false);
    goPrev();
  }, [goPrev]);

  useEffect(() => {
    slideEnteredAt.current = Date.now();
  }, [index]);

  useEffect(() => {
    if (advancePaused || mini) return;

    const slide = slides[index];
    if (slide.type === "video") return;

    const isHeroPhoto = HERO_PHOTO_INDICES.has(index);
    const waitMs = isHeroPhoto ? HERO_PHOTO_MS : autoplayMs;

    const tick = () => {
      const elapsed = Date.now() - slideEnteredAt.current;
      if (elapsed < waitMs) return;
      goNext();
    };

    const t = setInterval(tick, 150);
    return () => clearInterval(t);
  }, [index, advancePaused, mini, autoplayMs, goNext, slides]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video || i === index) return;
      video.pause();
      video.currentTime = 0;
    });
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 40) return;
    if (dy > 0) manualNext();
    else manualPrev();
  };

  const togglePause = () => {
    setPlaybackPaused((p) => !p);
    setAdvancePaused((p) => !p);
  };

  return (
    <div
      className={`relative mx-auto overflow-hidden bg-black ${
        mini
          ? "h-[70vh] max-h-[640px] rounded-2xl"
          : "h-[100dvh] w-full md:h-[min(86dvh,720px)] md:max-h-[720px] md:rounded-b-2xl"
      }`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={togglePause}
      role="region"
      aria-label="Labs Cannabis visual gallery"
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-500 ${active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            {slide.type === "video" ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="reels-media h-full w-full object-cover md:object-contain"
                poster={slide.poster}
                muted
                playsInline
                controls
                preload="none"
                onClick={(event) => event.stopPropagation()}
                onPlay={() => {
                  setAdvancePaused(true);
                  setPlaybackPaused(false);
                }}
                onEnded={() => {
                  if (i === index && !advancePaused) goNext();
                }}
              >
                <source src={slide.src} type="video/mp4" />
                {slide.webm && <source src={slide.webm} type="video/webm" />}
              </video>
            ) : hasMediaVariants(slide.src) ? (
              <picture>
                <source srcSet={slide.src.replace(/\.jpg$/i, ".avif")} type="image/avif" />
                <source srcSet={slide.src.replace(/\.jpg$/i, ".webp")} type="image/webp" />
                <img
                  src={slide.src}
                  alt={slide.alt ?? ""}
                  className="reels-media h-full w-full object-cover md:object-contain"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </picture>
            ) : (
              <img
                src={slide.src}
                alt={slide.alt ?? ""}
                className="reels-media h-full w-full object-cover md:object-contain"
                loading={i === 0 ? "eager" : "lazy"}
              />
            )}
          </div>
        );
      })}

      <div className="reels-overlay-gradient pointer-events-none absolute inset-0 z-20" />

      {offerSlidePromo && slides[index]?.id === OFFER_SLIDE_ID && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[42%] z-[25] flex justify-center px-4 sm:bottom-[44%]">
          <p className="max-w-sm rounded-xl border border-white/20 bg-black/75 px-4 py-2.5 text-center text-base font-bold leading-snug tracking-wide text-white shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:text-lg">
            {offerSlidePromo}
          </p>
        </div>
      )}

      <div
        className={`pointer-events-auto absolute inset-x-0 z-30 ${mini ? "bottom-3 px-3" : "bottom-[10.75rem] px-4 sm:bottom-[11.25rem]"}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <button
                key={slide.id}
                type="button"
                className={`relative h-14 w-10 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  active ? "border-emerald scale-105 shadow-lg shadow-emerald/30" : "border-white/25 opacity-70 hover:opacity-100"
                }`}
                onClick={() => selectSlide(i)}
                aria-label={`Slide ${i + 1}${slide.type === "video" ? " video" : ""}`}
                aria-current={active}
              >
                <img src={thumbSrc(slide)} alt="" className="reels-media-thumb h-full w-full object-cover" loading="lazy" />
                {slide.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-[10px] text-white">
                    ▶
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {playbackPaused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <span className="rounded-full bg-black/50 px-4 py-2 text-sm text-white">⏸</span>
        </div>
      )}
    </div>
  );
}
