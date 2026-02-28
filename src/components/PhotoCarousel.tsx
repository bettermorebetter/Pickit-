/* Photo carousel — swipeable, used in tournament cards, preview cards, and champion card */

import { useState, useRef, useCallback } from 'react';

interface PhotoCarouselProps {
  photos: string[];
  alt: string;
  className?: string;
  autoPlay?: boolean;
}

export default function PhotoCarousel({ photos, alt, className = '', autoPlay = false }: PhotoCarouselProps) {
  const [idx, setIdx] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalRef = useRef<boolean | null>(null);

  const show = useCallback((i: number) => {
    setIdx(((i % photos.length) + photos.length) % photos.length);
    setOffsetX(0);
  }, [photos.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isHorizontalRef.current = null;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - startXRef.current;
    const dy = e.touches[0].clientY - startYRef.current;

    // Determine direction on first significant move
    if (isHorizontalRef.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontalRef.current && photos.length > 1) {
      e.stopPropagation();
      setOffsetX(dx);
    }
  }, [swiping, photos.length]);

  const handleTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);

    if (isHorizontalRef.current && photos.length > 1) {
      if (Math.abs(offsetX) > 50) {
        show(idx + (offsetX < 0 ? 1 : -1));
      } else {
        setOffsetX(0);
      }
    } else {
      setOffsetX(0);
    }
    isHorizontalRef.current = null;
  }, [swiping, offsetX, idx, show, photos.length]);

  if (autoPlay) {
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

  // Interactive swipeable photo nav
  return (
    <div
      className="photo-carousel-swipe"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="photo-carousel-track"
        style={{
          transform: `translateX(calc(-${idx * 100}% + ${offsetX}px))`,
          transition: swiping ? 'none' : 'transform 0.3s ease',
        }}
      >
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={alt}
            className="card-photo"
            draggable={false}
          />
        ))}
      </div>
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
    </div>
  );
}
