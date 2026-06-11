'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, CheckCircle, Zap, Code } from "lucide-react";
import ScrollDownloadForm from "@/components/projects/ScrollDownloadForm";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { use } from "react";
import { translations } from "@/lib/translations";

const products: Record<string, {
  slug: string;
}> = {
  'doctor-plus': {
    slug: 'doctor-plus',
  },
  jafadh: {
    slug: 'jafadh',
  }
};

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products[slug];
  const { t, language } = useLanguage();

  if (!product) {
    notFound();
  }

  // Map product slugs to file names
  const productFileNames: Record<string, string> = {
    'doctor-plus': 'doctor-plus-demo.txt',
    jafadh: 'jafadh-demo.txt'
  };

  // Map product slugs to carousel images
  const productImages: Record<string, string[]> = {
    'doctor-plus': [
      '/images/Doctor+/doctorfotos (1).jpeg',
      '/images/Doctor+/doctorfotos (2).jpeg',
      '/images/Doctor+/doctorfotos (3).jpeg',
      '/images/Doctor+/doctorfotos (4).jpeg',
      '/images/Doctor+/doctorfotos (5).jpeg',
      '/images/Doctor+/doctorfotos (6).jpeg',
      '/images/Doctor+/doctorfotos (7).jpeg',
      '/images/Doctor+/doctorfotos (8).jpeg',
      '/images/Doctor+/doctorfotos (9).jpeg',
      '/images/Doctor+/doctorfotos (10).jpeg',
      '/images/Doctor+/doctorfotos (11).jpeg',
      '/images/Doctor+/doctorfotos (12).jpeg',
      '/images/Doctor+/doctorfotos (13).jpeg'
    ]
  };

  const fileName = productFileNames[slug] || 'app-release-demo.txt';
  const images = productImages[slug] || [];

  // Get arrays directly from translations
  const productData = translations[language].projects[slug as 'doctor-plus' | 'jafadh'] as any;
  const features = productData.features as string[];
  const impact = productData.impact as string[];

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/products">
              <Button variant="outline" size="sm" className="mb-6 sm:mb-8">
                ← {t('projects.voltar')}
              </Button>
            </Link>

            {/* JAFADH Hero Card */}
            {slug === 'jafadh' && (
              <div className="mb-8 sm:mb-12">
                <div className="bg-gradient-to-br from-[#282a36] to-[#1e1e2e] rounded-2xl border border-[#3a3a4a] shadow-2xl overflow-hidden">
                  {/* Logo Section */}
                  <div className="relative w-full flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-[#282a36] to-[#1e1e2e]">
                    <div className="relative w-full max-w-3xl mx-auto">
                      <Image
                        src="/images/JAFADH_com_fundo .PNG"
                        alt="JAFADH"
                        width={1200}
                        height={675}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8 lg:p-12">
                    {/* Category Tag */}
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,255,157,0.15)] text-[#00ff9d] text-sm font-semibold rounded-full border border-[rgba(0,255,157,0.3)]">
                        <CheckCircle className="w-4 h-4" />
                        {t(`projects.${slug}.category`)}
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">
                      {t(`projects.${slug}.title`)}
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-[#a0a0a0] mb-6 sm:mb-8 leading-relaxed">
                      {t(`projects.${slug}.description`)}
                    </p>

                    {/* Download Button */}
                    <div className="w-full">
                      <ScrollDownloadForm
                        productId={slug}
                        productName={t(`projects.${slug}.title`)}
                        fileName={fileName}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default Product Layout for other products */}
            {slug !== 'jafadh' && (
              <>
                {/* Product Preview Carousel */}
                {images.length > 0 ? (
                  <ImageCarousel images={images} alt={t(`projects.${slug}.title`)} className="mb-6 sm:mb-8" />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#282a36] to-[#282a36] rounded-xl mb-6 sm:mb-8 flex items-center justify-center border border-[#282a36]">
                    <div className="text-[#a0a0a0] text-sm font-medium tracking-wider uppercase">{t('projectDetail.productPreview')}</div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <span className="px-3 py-1 bg-[rgba(0,255,157,0.1)] text-[#00ff9d] text-xs font-semibold rounded-full">
                    {t(`projects.${slug}.category`)}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">
                  {t(`projects.${slug}.title`)}
                </h1>

                <p className="text-base sm:text-xl text-[#a0a0a0] mb-8 sm:mb-12 leading-relaxed max-w-3xl">
                  {t(`projects.${slug}.description`)}
                </p>

                {/* Scroll-Triggered Download Form */}
                <div className="mb-8 sm:mb-12">
                  <ScrollDownloadForm
                    productId={slug}
                    productName={t(`projects.${slug}.title`)}
                    fileName={fileName}
                  />
                </div>
              </>
            )}

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-[#282a36] p-5 sm:p-6 rounded-xl border border-[#282a36]">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#EF4444]" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#ffffff]">{t('projectDetail.problem')}</h3>
                </div>
                <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                  {t(`projects.${slug}.problem`)}
                </p>
              </div>
              <div className="bg-[#282a36] p-5 sm:p-6 rounded-xl border border-[#282a36]">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff9d]" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#ffffff]">{t('projectDetail.solution')}</h3>
                </div>
                <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                  {t(`projects.${slug}.solution`)}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff9d]" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#ffffff] tracking-tight">{t('projectDetail.features')}</h2>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-[#282a36] rounded-lg border border-[#282a36]">
                      <div className="w-2 h-2 bg-[#00ff9d] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-[#a0a0a0]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#282a36] p-6 sm:p-8 rounded-xl border border-[#282a36]">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">{t('projectDetail.expectedImpact')}</h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {impact.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ff9d] mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-[#a0a0a0]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
