'use client';

import React, { useState, use, useEffect } from 'react';
import { ArrowLeft, Check, CreditCard, Lock, Shield, Zap, Crown, Clock, Loader2, X, AlertCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { useTheme } from 'next-themes';

type PlanType = 'STANDARD' | 'PREMIUM';

interface PaymentPageProps {
  searchParams: Promise<{
    plano?: PlanType;
    produto?: string;
    productId?: string;
  }>;
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = use(searchParams);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(params.plano || 'STANDARD');
  const [productName, setProductName] = useState(params.produto || '');
  const [productId, setProductId] = useState(params.productId || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentUnavailableModal, setShowPaymentUnavailableModal] = useState(false);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPlan = language === 'pt' ? translations.pt.payment.standard : translations.en.payment.standard;
  const premiumPlan = language === 'pt' ? translations.pt.payment.premium : translations.en.payment.premium;

  const planDetails = {
    STANDARD: {
      name: currentPlan.name,
      price: currentPlan.price,
      duration: currentPlan.duration,
      description: currentPlan.description,
      features: currentPlan.features,
      color: 'from-blue-500 to-blue-600'
    },
    PREMIUM: {
      name: premiumPlan.name,
      price: premiumPlan.price,
      duration: premiumPlan.duration,
      description: premiumPlan.description,
      features: premiumPlan.features,
      color: 'from-amber-500 to-orange-500'
    }
  };

  const handlePayment = async () => {
    // Show payment unavailable modal
    setShowPaymentUnavailableModal(true);
  };

  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-[#282a36] border-b border-[#282a36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#a0a0a0] hover:text-[#ffffff] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{t('payment.back')}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {mounted && (
                <Image
                  src={isDark ? "/images/singular_horizontal_branco.svg" : "/images/aceite1.svg"}
                  alt="Singular.i"
                  width={180}
                  height={60}
                  className="w-auto h-12 sm:h-15"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[rgba(0,255,157,0.1)] text-[#00ff9d] rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('payment.securePayment')}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ffffff] mb-3 sm:mb-4">
              {t('payment.completePayment')}
            </h1>
            <p className="text-base sm:text-xl text-[#a0a0a0]">
              {t('payment.acquiringPlan').replace('{plan}', planDetails[selectedPlan].name).replace('{product}', productName)}
            </p>
          </div>

          {!paymentSuccess ? (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Plan Selection */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#ffffff] mb-4">{t('payment.selectPlan')}</h2>
                
                {Object.entries(planDetails).map(([key, plan]) => (
                  <div
                    key={key}
                    onClick={() => handlePlanChange(key as PlanType)}
                    className={`relative p-4 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlan === key
                        ? 'border-[#00ff9d] bg-[rgba(0,255,157,0.1)] shadow-lg'
                        : 'border-[#282a36] bg-[#282a36] hover:border-[#00ff9d] hover:shadow-md'
                    }`}
                  >
                    {selectedPlan === key && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#00ff9d] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#1a1a2e]" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                      <div className={`p-2 sm:p-3 bg-gradient-to-br ${plan.color} rounded-xl`}>
                        {key === 'STANDARD' ? (
                          <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-[#1a1a2e]" />
                        ) : (
                          <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-[#1a1a2e]" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#ffffff]">{plan.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-bold text-[#ffffff]">{plan.price}</span>
                          <span className="text-xs sm:text-sm text-[#a0a0a0]">{plan.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-[#a0a0a0] mb-3">{plan.description}</p>
                    
                    <ul className="space-y-1.5 sm:space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-[#a0a0a0]">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ff9d]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="bg-[#282a36] rounded-2xl p-5 sm:p-8 border border-[#282a36] shadow-lg">
                <h2 className="text-lg sm:text-xl font-semibold text-[#ffffff] mb-4 sm:mb-6">{t('payment.paymentSummary')}</h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-[#282a36]">
                    <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.product')}</span>
                    <span className="text-sm sm:text-base font-medium text-[#ffffff]">{productName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-[#282a36]">
                    <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.plan')}</span>
                    <span className="text-sm sm:text-base font-medium text-[#ffffff]">{planDetails[selectedPlan].name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-[#282a36]">
                    <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.duration')}</span>
                    <span className="text-sm sm:text-base font-medium text-[#ffffff]">{t('payment.monthly')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 sm:py-4 bg-[#282a36] rounded-lg px-3 sm:px-4">
                    <span className="text-base sm:text-lg font-semibold text-[#ffffff]">{t('payment.total')}</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#00ff9d]">{planDetails[selectedPlan].price}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-medium text-[#a0a0a0] mb-2 sm:mb-3">{t('payment.paymentMethods')}</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-[#282a36] rounded-lg hover:border-[#00ff9d] transition-colors cursor-pointer">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#a0a0a0]" />
                      <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.creditCard')}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-[#282a36] rounded-lg hover:border-[#00ff9d] transition-colors cursor-pointer">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#a0a0a0]" />
                      <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.bankTransfer')}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-[#282a36] rounded-lg hover:border-[#00ff9d] transition-colors cursor-pointer">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#a0a0a0]" />
                      <span className="text-xs sm:text-sm text-[#a0a0a0]">{t('payment.multicaixa')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] text-[#1a1a2e] font-semibold rounded-xl hover:from-[#00cc7d] hover:to-[#00ff9d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      {t('payment.processingPayment')}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t('payment.pay')} {planDetails[selectedPlan].price}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-[#a0a0a0]">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{t('payment.secureEncrypted')}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Payment Success */
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#ffffff] mb-3 sm:mb-4">
                {t('payment.paymentConfirmed')}
              </h2>
              <p className="text-base sm:text-xl text-[#a0a0a0] mb-6 sm:mb-8">
                {t('payment.redirecting')}
              </p>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff9d]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center text-xs sm:text-sm text-[#a0a0a0]">
          <p>&copy; {new Date().getFullYear()} SINGULAR.i - {t('payment.copyright')}</p>
        </div>
      </div>

      {/* Payment Unavailable Modal */}
      {showPaymentUnavailableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#282a36] rounded-2xl max-w-md w-full p-5 sm:p-8 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-[rgba(0,255,157,0.1)] rounded-xl">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#00ff9d]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#ffffff]">
                  {t('payment.paymentUnavailable')}
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentUnavailableModal(false)}
                className="p-2 hover:bg-[#282a36] rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#a0a0a0]" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                {t('payment.paymentUnavailableDesc')}
              </p>
              <p className="text-sm sm:text-base text-[#a0a0a0] leading-relaxed">
                {t('payment.workingOnIt')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-[rgba(0,255,157,0.1)] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm font-medium text-[#ffffff] mb-2 sm:mb-3">
                {t('payment.supportContact')}
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#a0a0a0]">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ff9d]" />
                  <span>{t('payment.supportEmail')}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#a0a0a0]">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ff9d]" />
                  <span>{t('payment.supportPhone')}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowPaymentUnavailableModal(false)}
              className="w-full py-3 px-4 sm:px-6 bg-[#00ff9d] text-[#1a1a2e] font-semibold rounded-xl hover:bg-[#00cc7d] transition-all duration-200 text-sm sm:text-base"
            >
              {t('payment.understood')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
