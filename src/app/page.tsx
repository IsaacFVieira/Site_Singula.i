'use client';

import { useState, useEffect } from 'react';
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

export default function Home() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Efeito de fade-out do hero no mobile
      if (isMobile) {
        const scrollY = window.scrollY;
        const maxScroll = 150;
        const opacity = Math.max(1 - (scrollY / maxScroll), 0);
        setHeroOpacity(opacity);
      } else {
        setHeroOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chamar imediatamente para definir estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <div>
      {isMobile ? (
        <section className="bg-black w-full min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            {mounted && (
              <div style={{ opacity: heroOpacity, transition: 'opacity 0.2s ease-in-out' }}>
                <Image
                  src="/images/logo_singular_letras_brancas_Sem_slogan.svg"
                  alt="SINGULAR.i"
                  width={400}
                  height={100}
                  className="w-full h-auto object-contain"
                  priority
                  sizes="100vw"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white text-center leading-tight">
              {t('hero.subtitle')}
            </h1>
            <p className="text-base text-gray-300 text-center leading-relaxed">
              {t('hero.description')}
            </p>
            <p className="text-sm text-gray-400 text-center">
              {t('hero.location')}
            </p>
            <div className="flex flex-col gap-3 w-full mt-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="w-full">
                  {t('hero.verProjetos')}
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg" className="w-full text-white border-white hover:bg-white hover:text-black">
                  {t('hero.contactar')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-[#0a0a0a] w-full pt-24 m-0 p-0">
            <div className="w-full m-0 p-0">
              {mounted && (
                <Image
                  src="/images/fundo_site_letras_brancas.svg"
                  alt="SINGULAR.i"
                  width={1920}
                  height={500}
                  className="w-full h-auto max-h-[500px] object-contain"
                  priority
                  sizes="100vw"
                />
              )}
            </div>
          </section>
          <section className="bg-[var(--surface)] w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center py-8 px-4">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  {t('hero.verProjetos')}
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg">
                  {t('hero.contactar')}
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}

      {/* ANGOTIC Highlight Section - Full-width Hero */}
      <Section className="py-0">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[21/9]">
          <Image
            src="/images/ango(1).jpeg"
            alt="ANGOTIC 2026"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-20">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-white tracking-tight leading-tight">
                {t('homeSections.angoticHighlightTitle')}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white opacity-85 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                {t('homeSections.angoticHighlightDesc')}
              </p>
              <Link href="/angotic">
                <button className="px-6 py-3 sm:px-8 sm:py-3 bg-[var(--accent)] border-2 border-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent)]/90 hover:border-[var(--accent)]/90 hover:scale-105 transition-all duration-300">
                  Ver Mais
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-16 sm:py-20 bg-[var(--surface)]">
        <Container>
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[var(--text-primary)] tracking-tight">
              {t('homeSections.featuredProjects')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-xl mb-4 flex items-center justify-center">
                <Image src="/images/D+.PNG" alt="Doctor+" width={48} height={48} className="w-12 h-12 rounded-xl border-2 border-white object-contain" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[var(--text-primary)]">{t('projects.doctor-plus.title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 leading-relaxed">
                {t('projects.doctor-plus.description')}
              </p>
              <Link href="/products/doctor-plus">
                <Button variant="outline" size="sm">
                  {t('projects.verDetalhes')}
                </Button>
              </Link>
            </div>
            <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
              <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-xl mb-4 flex items-center justify-center">
                <Image src="/images/JAFADH_com_fundo .PNG" alt="JAFADH" width={48} height={48} className="w-12 h-12 rounded-xl border-2 border-white object-contain" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-[var(--text-primary)]">{t('projects.jafadh.title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4 leading-relaxed">
                {t('projects.jafadh.description')}
              </p>
              <Link href="/products/jafadh">
                <Button variant="outline" size="sm">
                  {t('projects.verDetalhes')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[var(--text-primary)] tracking-tight">
                  {t('homeSections.aboutTitle')}
                </h2>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 sm:mb-6">
                  {t('homeSections.aboutDesc')}
                </p>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 sm:mb-6">
                  {t('about.description')}
                </p>
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm sm:text-base">
                  <span>📍</span>
                  <span>{t('hero.location')}</span>
                </div>
              </div>
              <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-xl border border-[var(--border)]">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[var(--text-primary)]">{t('about.mission')}</h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  {t('about.missionText')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20 bg-[var(--surface)]">
        <Container>
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[var(--text-primary)] tracking-tight">
              {t('homeSections.whyTitle')}
            </h2>
            <p className="text-base sm:text-xl text-[var(--text-secondary)] mb-8 sm:mb-12 leading-relaxed">
              {t('homeSections.whyDesc')}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-lg mb-4 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
                </div>
                <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-semibold">
                  {t('homeSections.institutionalPoint1')}
                </p>
              </div>
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-lg mb-4 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
                </div>
                <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-semibold">
                  {t('homeSections.institutionalPoint2')}
                </p>
              </div>
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-lg mb-4 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
                </div>
                <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-semibold">
                  {t('homeSections.institutionalPoint3')}
                </p>
              </div>
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
                <div className="w-12 h-12 bg-[var(--primary-soft)] rounded-lg mb-4 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
                </div>
                <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-semibold">
                  {t('homeSections.institutionalPoint4')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[var(--text-primary)] tracking-tight">
              {t('homeSections.ctaTitle')}
            </h2>
            <p className="text-base sm:text-xl text-[var(--text-secondary)] mb-6 sm:mb-8 leading-relaxed">
              {t('homeSections.ctaDesc')}
            </p>
            <Link href="/contacto">
              <Button variant="primary" size="lg">
                {t('homeSections.ctaButton')}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
