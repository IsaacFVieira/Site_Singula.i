'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language, t } = useLanguage();

  const productData = translations[language].projects[slug as 'doctor-plus' | 'jafadh'] as any;
  const features = productData.features as string[];
  const useCases = productData.useCases as string[];
  const impact = productData.impact as string;

  if (!productData) {
    notFound();
  }

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link href="/products">
              <Button variant="outline" size="sm" className="mb-6 sm:mb-8">
                ← {t('projects.voltar')}
              </Button>
            </Link>
            
            <div className="aspect-video bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-xl mb-6 sm:mb-8 flex items-center justify-center border border-[#E2E8F0]">
              {slug === 'jafadh' ? (
                <Image src="/images/JAFADH_com_fundo .PNG" alt="JAFADH" width={200} height={200} className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg border-4 border-white object-contain" />
              ) : (
                <div className="text-[#94A3B8] text-xs sm:text-sm font-medium tracking-wider uppercase">Project Preview</div>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#0F172A] tracking-tight">
              {productData.title}
            </h1>
            
            <p className="text-base sm:text-xl text-[#475569] mb-6 sm:mb-8 leading-relaxed">
              {productData.description}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-6 sm:mb-8">
                {productData.fullDescription}
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#0F172A] tracking-tight">{t('projectDetail.features')}</h2>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="text-sm sm:text-base text-[#475569] leading-relaxed flex items-start">
                    <span className="text-[#94A3B8] mr-2 sm:mr-3 mt-1 sm:mt-1.5">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {useCases && useCases.length > 0 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#0F172A] tracking-tight">{t('projectDetail.useCases')}</h2>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {useCases.map((useCase, index) => (
                      <li key={index} className="text-sm sm:text-base text-[#475569] leading-relaxed flex items-start">
                        <span className="text-[#94A3B8] mr-2 sm:mr-3 mt-1 sm:mt-1.5">—</span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#0F172A] tracking-tight">{t('projectDetail.expectedImpact')}</h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                {impact}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
