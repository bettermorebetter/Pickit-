/* Photo carousel — used in preview cards, tournament cards, and champion card */

import { useState, useRef, useCallback } from 'react';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  className?: string;
  autoPlay?: boolean;
}

export default function PhotoCarousel({ photos, alt, className = '', autoPlay = false }: PhotoCarouselProps) {
  const [idx, setIdx] = useState(0);
  const startXRef = useRef(0);

  const show = useCallback((i: number) => {
    setIdx(((i % photos.length) + photos.length) % photos.length);
  }, [photos.length]);

  if (autoPlay) {
    // Auto-play carousel (for champion)
    return (
      <div className={`photo-carousel ${className}`}>
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={alt}
            className={`carousel-slide${i === idx ? ' active' : ''}`}
          />
        ))}
        <div className="carousel-dots">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === idx ? ' active' : ''}`}
              onClick={() => show(i)}
              aria-label={`사진 ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Interactive photo nav (for preview/tournament cards)
  return (
    <>
      <img
        src={photos[idx]}
        alt={alt}
        className="card-photo"
      />
      {photos.length > 1 && (
        <>
          <button
            className="photo-nav photo-nav--prev"
            aria-label="이전 사진"
            onClick={(e) => { e.stopPropagation(); show(idx - 1); }}
          >
            ◀
          </button>
          <button
            className="photo-nav photo-nav--next"
            aria-label="다음 사진"
            onClick={(e) => { e.stopPropagation(); show(idx + 1); }}
          >
            ▶
          </button>
          <div className="photo-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`photo-dot${i === idx ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); show(i); }}
              />
            ))}
          </div>
        </>
      )}
      {/* Touch swipe handling via invisible touch area */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        onTouchStart={(e) => { startXRef.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const d = startXRef.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) show(idx + (d > 0 ? 1 : -1));
        }}
        onClick={() => { if (photos.length > 1) show(idx + 1); }}
      />
    </>
  );
}
