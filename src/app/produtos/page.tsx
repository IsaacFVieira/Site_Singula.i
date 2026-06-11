'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function Produtos() {
  const { language, t } = useLanguage();
  const products = [
    {
      slug: "doctor-plus",
      title: translations[language].projects['doctor-plus'].title,
      description: translations[language].projects['doctor-plus'].description,
      icon: <Image src="/images/D+.PNG" alt="Doctor Plus" width={48} height={48} className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg border-2 border-white object-contain" />,
    },
    {
      slug: "jafadh",
      title: translations[language].projects['jafadh'].title,
      description: translations[language].projects['jafadh'].description,
      icon: <Image src="/images/JAFADH_com_fundo .PNG" alt="JAFADH" width={48} height={48} className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg border-2 border-white object-contain" />,
    }
  ];

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#0F172A] tracking-tight">
              {t('projects.title')}
            </h1>
            <p className="text-base sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              {t('projects.description')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <Card key={product.slug}>
                <div className="mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F1F5F9] rounded-lg flex items-center justify-center">
                    {product.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#0F172A]">{product.title}</h3>
                <p className="text-sm sm:text-base text-[#475569] mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>
                <Link href={`/products/${product.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('projects.viewDetails')}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
