'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Star, Clock, Zap, Shield, Crown, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { useTheme } from 'next-themes';

export type PlanType = 'FREE' | 'STANDARD' | 'PREMIUM';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (plan: PlanType) => void;
  onConfirm?: () => void;
  productName: string;
}

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  duration: string;
  description: string;
  badge?: string;
  features: {
    name: string;
    available: boolean;
    icon?: React.ReactNode;
  }[];
  highlight?: boolean;
  disabled?: boolean;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onPlanSelect,
  onConfirm,
  productName
}) => {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen) return null;

  const planTranslations = translations[language].planSelection;
  const plans: Plan[] = [
    {
      id: 'FREE',
      name: planTranslations.free.name,
      price: planTranslations.free.price,
      duration: planTranslations.free.duration,
      description: planTranslations.free.description,
      badge: planTranslations.free.badge,
      highlight: true,
      features: planTranslations.free.features.map((feature: string, index: number) => ({
        name: feature,
        available: true,
        icon: index < 4 ? <Check className="w-4 h-4" /> : index === 4 ? <Star className="w-4 h-4" /> : <Clock className="w-4 h-4" />
      }))
    },
    {
      id: 'STANDARD',
      name: planTranslations.standard.name,
      price: planTranslations.standard.price,
      duration: planTranslations.standard.duration,
      description: planTranslations.standard.description,
      disabled: true,
      features: planTranslations.standard.features.map((feature: string, index: number) => ({
        name: feature,
        available: index < 4,
        icon: index < 4 ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
      }))
    },
    {
      id: 'PREMIUM',
      name: planTranslations.premium.name,
      price: planTranslations.premium.price,
      duration: planTranslations.premium.duration,
      description: planTranslations.premium.description,
      disabled: true,
      features: planTranslations.premium.features.map((feature: string, index: number) => ({
        name: feature,
        available: true,
        icon: index === 0 ? <Crown className="w-4 h-4" /> : index === 2 ? <Shield className="w-4 h-4" /> : index === 3 ? <Zap className="w-4 h-4" /> : <Check className="w-4 h-4" />
      }))
    }
  ];

  const handlePlanClick = (planId: PlanType) => {
    const plan = plans.find(p => p.id === planId);
    if (plan && !plan.disabled) {
      // Se já estiver selecionado, desseleciona
      if (selectedPlan === planId) {
        setSelectedPlan(null);
      } else {
        setSelectedPlan(planId);
      }
    }
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleConfirm = () => {
    if (selectedPlan) {
      onPlanSelect(selectedPlan);
      // If onConfirm is provided, use it instead of onClose
      if (onConfirm) {
        onConfirm();
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--background)]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--card)] border-b border-[var(--border)] p-4 sm:p-6 z-10 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {mounted && (
                <Image
                  src={isDark ? "/images/singular_horizontal_branco.svg" : "/images/aceite1.svg"}
                  alt="Singular.i"
                  width={180}
                  height={60}
                  className="w-auto h-9 sm:h-12"
                />
              )}
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-[var(--foreground)] mb-1">
                  {t('planSelection.choosePlan')}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  {t('planSelection.selectPlanFor').replace('{product}', productName)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--muted)]" />
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className={`relative rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 ${
                  plan.disabled
                    ? 'border-[var(--border)] bg-[var(--card)]/50 cursor-not-allowed opacity-60'
                    : selectedPlan === plan.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg cursor-pointer'
                    : plan.highlight
                    ? 'border-[var(--accent)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md cursor-pointer'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:shadow-md cursor-pointer'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-[#1a1a2e] text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-4 sm:mb-6 pt-3 sm:pt-4">
                  <h3 className="text-base sm:text-xl font-bold text-[var(--foreground)] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 sm:gap-3 ${
                        feature.available ? 'text-[var(--muted)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 ${
                        feature.available ? 'text-[var(--accent)]' : 'text-[#EF4444]'
                      }`}>
                        {feature.icon}
                      </div>
                      <span className="text-xs sm:text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                <div className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-center transition-all text-xs sm:text-sm ${
                  selectedPlan === plan.id
                    ? 'bg-[var(--accent)] text-[#1a1a2e]'
                    : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--surface-hover)]'
                }`}>
                  {selectedPlan === plan.id ? t('planSelection.selected') : t('planSelection.selectPlan')}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!selectedPlan}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                selectedPlan
                  ? 'bg-[var(--accent)] text-[#1a1a2e] hover:bg-[var(--primary)] hover:shadow-lg transform hover:scale-105'
                  : 'bg-[var(--card)] text-[var(--muted)] cursor-not-allowed'
              }`}
            >
              {selectedPlan ? t('planSelection.continueWith').replace('{plan}', plans.find(p => p.id === selectedPlan)?.name || '') : t('planSelection.selectPlan')}
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              {t('planSelection.changePlanLater')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;
