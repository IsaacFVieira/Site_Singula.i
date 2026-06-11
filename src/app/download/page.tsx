'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DownloadModal from '@/components/download/DownloadModal';
import { useLanguage } from '@/contexts/LanguageContext';

function DownloadPageContent() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plan, setPlan] = useState<'FREE' | 'STANDARD' | 'PREMIUM'>('FREE');
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [statusPagamento, setStatusPagamento] = useState<'pendente' | 'pago' | 'free'>('free');
  const { t } = useLanguage();

  useEffect(() => {
    const planoParam = searchParams.get('plano');
    const produtoParam = searchParams.get('produto');
    const productIdParam = searchParams.get('productId');
    const statusParam = searchParams.get('status');

    if (planoParam) {
      setPlan(planoParam as 'FREE' | 'STANDARD' | 'PREMIUM');
    }
    if (produtoParam) {
      setProductName(produtoParam);
    }
    if (productIdParam) {
      setProductId(productIdParam);
    }
    if (statusParam) {
      setStatusPagamento(statusParam as 'pendente' | 'pago' | 'free');
    }

    // Open modal automatically when page loads
    setIsModalOpen(true);
  }, [searchParams]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#1a1a2e] flex items-center justify-center p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff] mb-3 sm:mb-4">
          {statusPagamento === 'pago' ? t('download.paymentConfirmed') : t('download.title')}
        </h1>
        <p className="text-sm sm:text-base text-[#a0a0a0] mb-6 sm:mb-8">
          {t('download.completeData')}
        </p>
      </div>

      {productId && productName && (
        <DownloadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productId={productId}
          productName={productName}
          fileName={`${productId}.apk`}
          statusPagamento={statusPagamento}
          preSelectedPlan={plan}
        />
      )}
    </div>
  );
}

export default function DownloadPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#1a1a2e] flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-[#a0a0a0]">{t('download.loading')}</p>
        </div>
      </div>
    }>
      <DownloadPageContent />
    </Suspense>
  );
}
