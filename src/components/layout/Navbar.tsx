'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Efeito de fade-in do logo no mobile - só aparece quando hero desaparece completamente
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const scrollY = window.scrollY;
        const maxScroll = 150;
        // Logo só aparece quando scrollY > maxScroll (hero completamente invisível)
        const opacity = scrollY > maxScroll ? 1 : 0;
        setLogoOpacity(opacity);
      } else {
        setLogoOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chamar imediatamente para definir estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.sobre'), href: '/sobre' },
    { name: t('nav.projetos'), href: '/products' },
    { name: t('nav.servicos'), href: '/servicos' },
    { name: t('nav.contacto'), href: '/contacto' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--border)]'
            : 'bg-[var(--card)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
                style={{ opacity: logoOpacity, transition: 'opacity 0.2s ease-in-out' }}
              >
                {mounted && (
                  <Image
                    src={isDark ? "/images/singular_horizontal_branco.svg" : "/images/aceite1.svg"}
                    alt="Singular.i"
                    width={180}
                    height={60}
                    priority
                    className="w-[140px] sm:w-[160px] md:w-[180px] h-auto object-contain"
                  />
                )}
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent)] ${
                    pathname === item.href
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="ml-4 p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
              >
                <Globe className="w-5 h-5 text-[var(--muted)]" />
              </button>
              <Link href="/contacto">
                <Button variant="primary" size="sm">
                  {t('nav.contacto')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-3 hover:bg-[var(--surface-hover)] rounded-lg transition-colors active:scale-95 relative z-[70]"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-[var(--muted)]" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
