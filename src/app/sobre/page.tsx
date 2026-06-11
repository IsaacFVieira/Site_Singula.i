'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';
import { Target, Users, Lightbulb, Award, Zap, Globe, Code, Shield, Rocket } from 'lucide-react';

export default function Sobre() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: t('about.mission'),
      description: t('about.missionText')
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Inovação',
      description: 'Buscamos constantemente novas tecnologias e metodologias para entregar soluções de ponta.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Foco no Cliente',
      description: 'Cada projeto é único e desenvolvido com atenção aos detalhes e necessidades específicas.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Qualidade',
      description: 'Compromisso com a excelência em cada linha de código e cada funcionalidade entregue.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Eficiência',
      description: 'Soluções otimizadas que maximizam o desempenho e minimizam custos operacionais.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Impacto Local',
      description: 'Desenvolvemos soluções que respondem a desafios reais em Angola e África.'
    }
  ];

  const services = [
    {
      icon: <Code className="w-12 h-12" />,
      title: t('services.webDev'),
      description: t('services.webDevDesc')
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: t('services.dataPlatforms'),
      description: t('services.dataPlatformsDesc')
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: t('services.customSoftware'),
      description: t('services.customSoftwareDesc')
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32 bg-gradient-to-br from-[var(--card)] to-[var(--surface)]">
        <Container>
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {mounted && (
                <Image
                  src={isDark ? "/images/singular_horizontal_branco.svg" : "/images/aceite1.svg"}
                  alt="Singular.i"
                  width={180}
                  height={60}
                  className="w-auto h-18 sm:h-24"
                />
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">
              {t('about.title')}
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg sm:text-xl text-[var(--muted)] leading-relaxed mb-4 sm:mb-6">
                {t('about.description')}
              </p>
              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-4 sm:mb-6">
                {t('about.description2')}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-[var(--foreground)]">
                {t('about.mission')}
              </h2>
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section className="py-16 sm:py-20 bg-[var(--surface)]">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-12 text-center text-[var(--foreground)]">
              Nossos Valores
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-[var(--card)] p-6 sm:p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-[var(--accent)] mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[var(--foreground)]">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-12 text-center text-[var(--foreground)]">
              {t('services.title')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[var(--card)] to-[var(--surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-[var(--accent)] mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[var(--foreground)]">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Identity Section */}
      <Section className="py-16 sm:py-20 bg-[#282a36]">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-[#ffffff] tracking-tight">
              {t('about.identityTitle')}
            </h2>
            <p className="text-base sm:text-lg text-[#a0a0a0] mb-4 sm:mb-6">
              {t('about.identityDescription')}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#282a36] p-5 sm:p-6 rounded-xl border border-[#282a36]">
                <div className="w-12 h-12 bg-[#282a36] border-2 border-[#282a36] rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2 text-[#ffffff]">{t('about.white')}</h3>
                <p className="text-[#a0a0a0] text-sm">{t('about.whiteDesc')}</p>
              </div>
              <div className="bg-[#282a36] p-5 sm:p-6 rounded-xl border border-[#282a36]">
                <div className="w-12 h-12 bg-[#00ff9d] rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2 text-[#ffffff]">{t('about.green')}</h3>
                <p className="text-[#a0a0a0] text-sm">{t('about.greenDesc')}</p>
              </div>
              <div className="bg-[#282a36] p-5 sm:p-6 rounded-xl border border-[#282a36]">
                <div className="w-12 h-12 bg-[#00ff9d] rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2 text-[#ffffff]">{t('about.graphite')}</h3>
                <p className="text-[#a0a0a0] text-sm">{t('about.graphiteDesc')}</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#a0a0a0] mt-6 sm:mt-8">
              {t('about.interfaceDesc')}
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
