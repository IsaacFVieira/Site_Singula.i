'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { ChevronLeft, X, ChevronLeft as ChevronLeftIcon, ChevronRight } from 'lucide-react';

export default function Angotic() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    { src: '/images/Angotic/Angotic (2).jpeg', alt: 'ANGOTIC 2026 - Foto 2' },
    { src: '/images/Angotic/Angotic (3).jpeg', alt: 'ANGOTIC 2026 - Foto 3' },
    { src: '/images/Angotic/Angotic (6).jpeg', alt: 'ANGOTIC 2026 - Foto 6' },
    { src: '/images/Angotic/Angotic (16).jpeg', alt: 'ANGOTIC 2026 - Foto 16' },
    { src: '/images/Angotic/Angotic (8).jpeg', alt: 'ANGOTIC 2026 - Foto 8' },
    { src: '/images/Angotic/Angotic (7).jpeg', alt: 'ANGOTIC 2026 - Foto 7' }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    } else {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="py-0">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[21/9]">
          <Image
            src="/images/Angotic/Angotic (15).jpeg"
            alt="ANGOTIC 2026"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 text-center">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
              <span className="text-white text-xs sm:text-sm font-medium">
                {t('homeSections.angoticPage.badge')}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white tracking-tight leading-tight">
              {t('homeSections.angoticPage.title')}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white opacity-90 tracking-wide">
              {t('homeSections.angoticPage.subtitle')}
            </p>
          </div>
        </div>
      </Section>

      {/* Intro Text Section */}
      <Section className="py-20 sm:py-24 lg:py-32 bg-[var(--surface)]">
        <Container>
          <div className="max-w-2xl mx-auto text-center px-4">
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              {t('homeSections.angoticPage.introParagraph1')}
            </p>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('homeSections.angoticPage.introParagraph2')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Gallery Section */}
      <Section className="py-20 sm:py-24 lg:py-32 bg-[var(--background)]">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Back Button Section */}
      <Section className="py-16 sm:py-20 bg-[var(--surface)]">
        <Container>
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>{t('homeSections.angoticPage.back')}</span>
            </button>
          </Link>
        </Container>
      </Section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            <ChevronLeftIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12" />
          </button>

          <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
