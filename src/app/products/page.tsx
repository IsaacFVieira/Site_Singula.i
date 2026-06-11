'use client';

import { useState } from 'react';
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import StatusCheckModal from "@/components/products/StatusCheckModal";

export default function Products() {
  const { t } = useLanguage();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const products = [
    {
      slug: "doctor-plus",
      title: t('projects.doctor-plus.title'),
      category: t('projects.doctor-plus.category') || "Saúde",
      description: t('projects.doctor-plus.description'),
      icon: <Image src="/images/D+.PNG" alt="Doctor Plus" width={64} height={64} className="w-16 h-16 object-contain rounded-xl" />,
      color: "text-[#00ff9d]",
      bgColor: "bg-[#00ff9d]",
    },
    {
      slug: "jafadh",
      title: t('projects.jafadh.title'),
      category: t('projects.jafadh.category') || "Segurança",
      description: t('projects.jafadh.description'),
      icon: <Image src="/images/JAFADH_com_fundo .PNG" alt="JAFADH" width={64} height={64} className="w-16 h-16 object-contain rounded-xl" />,
      color: "text-[#00ff9d]",
      bgColor: "bg-[#00ff9d]",
    }
  ];

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">
              {t('projects.title')}
            </h1>
            <p className="text-base sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto leading-relaxed mb-6">
              {t('projects.description')}
            </p>
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="bg-[#00ff9d] text-[#1e1e2e] font-semibold py-3 px-6 rounded-lg hover:bg-[#00cc7d] transition-colors flex items-center gap-2 mx-auto"
            >
              <Search className="w-5 h-5" />
              Verificar Status do Pedido
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto px-4">
            {products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`}>
                <div className="bg-[#282a36] p-6 sm:p-8 rounded-2xl border border-[#282a36] hover:border-[#00ff9d] hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-opacity-10 rounded-xl flex items-center justify-center ${product.bgColor} ${product.color}`}>
                      {product.icon}
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-[#282a36] text-[#a0a0a0] text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-[#ffffff] group-hover:text-[#00ff9d] transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#a0a0a0] mb-4 sm:mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-[#282a36]">
                    <div className="flex items-center gap-2 text-[#00ff9d] group-hover:gap-3 transition-all">
                      <span className="text-xs sm:text-sm font-medium">{t('projects.verDetalhes')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <StatusCheckModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}
