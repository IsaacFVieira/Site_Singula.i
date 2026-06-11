'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, Download } from 'lucide-react';

interface PricingSectionProps {
  onPricingRendered?: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onPricingRendered }) => {
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);

  useEffect(() => {
    // Simula um pequeno delay para garantir que o componente foi renderizado
    const timer = setTimeout(() => {
      setIsDownloadEnabled(true);
      if (onPricingRendered) {
        onPricingRendered();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [onPricingRendered]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Plano Básico */}
        <div className="bg-[var(--card)] rounded-2xl p-5 sm:p-8 border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">Plano Básico</h3>
            <p className="text-xs sm:text-sm text-[var(--muted)]">Para começar a explorar</p>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">Grátis</span>
          </div>

          <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[var(--muted)]">Acesso a funcionalidades básicas</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[var(--muted)]">Suporte por email</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[var(--muted)]">Atualizações mensais</span>
            </li>
          </ul>

          <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 border-2 border-[var(--accent)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--accent)] hover:text-[#1a1a2e] transition-all duration-200 text-sm sm:text-base">
            Começar Grátis
          </button>
        </div>

        {/* Plano Premium */}
        <div className="bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-2xl p-5 sm:p-8 border-2 border-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a1a2e] fill-[#1a1a2e]" />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-2">Plano Premium</h3>
            <p className="text-xs sm:text-sm text-[#1a1a2e]/80">Para profissionais e empresas</p>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">Kz 15.000</span>
            <span className="text-xs sm:text-sm text-[#1a1a2e]/80">/mês</span>
          </div>

          <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#1a1a2e]">Todas as funcionalidades básicas</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#1a1a2e]">Suporte prioritário 24/7</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#1a1a2e]">Atualizações semanais</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#1a1a2e]">API completa</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#34D399] mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-[#1a1a2e]">Relatórios avançados</span>
            </li>
          </ul>

          <button className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[var(--primary-foreground)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--card)] transition-all duration-200 text-sm sm:text-base">
            Assinar Premium
          </button>
        </div>
      </div>

      {/* Plano de Experiência - Card Horizontal Premium */}
      <div className="mb-6 sm:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] rounded-2xl blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] rounded-2xl p-1">
          <div className="bg-[var(--card)] rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-xl">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#1a1a2e] fill-[#1a1a2e]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-[var(--foreground)] mb-1">Plano de Experiência</h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">Teste todas as funcionalidades sem compromisso</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">Teste Gratuito</div>
                <div className="text-xs sm:text-sm text-[var(--muted)]">3 Meses de Acesso Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          disabled={!isDownloadEnabled}
          className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
            isDownloadEnabled
              ? 'bg-[var(--accent)] text-[#1a1a2e] hover:bg-[var(--primary)] hover:shadow-lg transform hover:scale-105'
              : 'bg-[var(--card)] text-[var(--muted)] cursor-not-allowed'
          }`}
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Download</span>
        </button>
      </div>

      {!isDownloadEnabled && (
        <p className="text-center text-xs sm:text-sm text-[var(--muted)] mt-3 sm:mt-4">
          Selecione um plano para habilitar o download
        </p>
      )}
    </div>
  );
};

export default PricingSection;
