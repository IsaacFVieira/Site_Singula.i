'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Servicos() {
  const { t } = useLanguage();

  const services = [
    {
      title: t('services.webDev'),
      description: t('services.webDevDesc')
    },
    {
      title: t('services.dataPlatforms'),
      description: t('services.dataPlatformsDesc')
    },
    {
      title: t('services.healthSolutions'),
      description: t('services.healthSolutionsDesc')
    },
    {
      title: t('services.adminSystems'),
      description: t('services.adminSystemsDesc')
    },
    {
      title: t('services.customSoftware'),
      description: t('services.customSoftwareDesc')
    }
  ];

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">
              {t('services.title')}
            </h1>
            <p className="text-base sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto leading-relaxed">
              {t('services.description')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
            {services.map((service, index) => (
              <Card key={index}>
                <div className="w-12 h-12 bg-[#282a36] rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#00ff9d] rounded"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#ffffff]">{service.title}</h3>
                <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
