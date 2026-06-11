'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.sobre'), href: '/sobre' },
    { name: t('nav.projetos'), href: '/products' },
    { name: t('nav.contacto'), href: '/contacto' },
  ];

  return (
    <footer className="bg-[var(--card)] text-[var(--foreground)]">
      <Container>
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {/* Logo & Description */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                {mounted && (
                  <Image
                    src={isDark ? "/images/singular_horizontal_branco.svg" : "/images/aceite1.svg"}
                    alt="Singular.i"
                    width={180}
                    height={60}
                    className="w-auto h-14 sm:h-16"
                  />
                )}
              </div>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                {t('footer.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-[var(--foreground)]">{t('footer.links')}</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-[var(--foreground)]">{t('footer.contacto')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[var(--muted)] text-sm">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a href="mailto:singular.i.ao@gmail.com" className="hover:text-[var(--accent)] transition-colors duration-200">
                    singular.i.ao@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[var(--muted)] text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+244 946 570 104 / +244 958 736 918</span>
                </li>
                <li className="flex items-start gap-3 text-[var(--muted)] text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{t('hero.location')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--muted)] text-sm text-center md:text-left">
              © {currentYear} SINGULAR.i. {t('footer.copyright')}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
