'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Home, Info, Briefcase, Package, Mail, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const menuItems = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.sobre'), href: '/sobre', icon: Info },
    { name: t('nav.servicos'), href: '/servicos', icon: Briefcase },
    { name: t('nav.projetos'), href: '/products', icon: Package },
    { name: t('nav.contacto'), href: '/contacto', icon: Mail },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-[var(--card)]/95 backdrop-blur-xl z-[60] shadow-2xl border-l border-[var(--border)]"
          >
            <div className="p-6 h-full flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 hover:bg-[var(--surface-hover)] rounded-full transition-all duration-300 hover:rotate-90"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-[var(--muted)]" />
              </button>
              
              <div className="mt-8 mb-6">
                <h2 className="text-2xl font-bold text-[var(--accent)] tracking-tight">Menu</h2>
                <p className="text-sm text-[var(--muted)] mt-1">Navegue pelo site</p>
              </div>
              
              <nav className="flex-1">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-4 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200 py-4 px-4 rounded-xl group"
                          >
                            <Icon className="w-5 h-5 text-[var(--accent)] group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <span className="text-[var(--muted)] font-medium">Tema</span>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                  className="flex items-center gap-3 w-full p-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-all duration-200 active:scale-98"
                >
                  <Globe className="w-5 h-5 text-[var(--accent)]" />
                  <span className="text-[var(--muted)] font-medium">
                    {language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
