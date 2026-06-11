'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  alt, 
  className = '',
  autoplay = true,
  autoplayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoplay || isPaused) return;

    const interval = setInterval(() => {
      nextImage();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [nextImage, autoplay, autoplayInterval, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, previousImage]);

  // Touch/Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setIsDragging(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Main Image */}
      <div 
        className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--card)] shadow-2xl group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          priority={currentIndex === 0}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
        
        {/* Skeleton Loading */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[var(--card)] animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-[var(--card)] via-[var(--surface-hover)] to-[var(--card)] animate-shimmer" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation Arrows */}
        <button
          onClick={previousImage}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full transition-all duration-300 group-hover:scale-110 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full transition-all duration-300 group-hover:scale-110 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Image Counter & Autoplay Toggle */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-md rounded-full">
            <span className="text-white text-xs sm:text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          {autoplay && (
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-white" />
              ) : (
                <Pause className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[var(--accent)] w-8 shadow-[0_0_10px_rgba(0,255,157,0.5)]'
                : 'bg-[var(--card)] hover:bg-[var(--accent)]/50 w-2'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
