'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import PlanSelectionModal, { PlanType } from '@/components/pricing/PlanSelectionModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  fileName: string;
  statusPagamento?: 'pendente' | 'pago' | 'free';
  preSelectedPlan?: 'FREE' | 'STANDARD' | 'PREMIUM';
}

interface FormData {
  empresa: string;
  telefone: string;
  email: string;
}

interface FormErrors {
  empresa?: string;
  telefone?: string;
  email?: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, productId, productName, fileName, statusPagamento = 'free', preSelectedPlan }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';
  const [showPlanSelection, setShowPlanSelection] = useState(statusPagamento === 'free' && !preSelectedPlan);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(preSelectedPlan || (statusPagamento === 'free' ? null : (statusPagamento === 'pago' ? 'STANDARD' : 'FREE')));
  const [formData, setFormData] = useState<FormData>({
    empresa: '',
    telefone: '',
    email: ''
  });

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<any>(null);

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de telefone (formato angolano simplificado)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.empresa.trim()) {
      newErrors.empresa = t('downloadModal.errorCompanyRequired');
    } else if (formData.empresa.trim().length < 2) {
      newErrors.empresa = t('downloadModal.errorCompanyMinLength');
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = t('downloadModal.errorPhoneRequired');
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = t('downloadModal.errorPhoneInvalid');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('downloadModal.errorEmailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('downloadModal.errorEmailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipulador de mudança nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erro do campo quando o usuário começa a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedPlan) {
      setErrorMessage(t('downloadModal.errorSelectPlan'));
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Primeiro, verifica se existe cadastro para este produto
      const checkResponse = await fetch(`/api/check-registration?productId=${productId}&email=${encodeURIComponent(formData.email)}&telefone=${encodeURIComponent(formData.telefone)}`);
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        // Mostra diálogo de substituição
        setExistingRegistration(checkData.download);
        setShowReplaceDialog(true);
        setIsSubmitting(false);
        return;
      }

      // Se não existe cadastro, envia normalmente
      await submitDownload(false);

    } catch (error) {
      console.error('Erro ao verificar cadastro:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('downloadModal.errorRequest'));
      setIsSubmitting(false);
    }
  };

  // Função para submeter o download (com ou sem substituição)
  const submitDownload = async (replace: boolean) => {
    try {
      // Envia dados para a API com productId, planoSelecionado e statusPagamento
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          productId,
          planoSelecionado: selectedPlan,
          statusPagamento,
          replace
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('downloadModal.errorDownload'));
      }

      // Sucesso - mostra mensagem de confirmação
      setSubmitStatus('success');
      setShowReplaceDialog(false);

    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('downloadModal.errorRequest'));
      setShowReplaceDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para substituir registro
  const handleReplace = () => {
    setIsSubmitting(true);
    submitDownload(true);
  };

  // Handler para manter registro
  const handleKeepExisting = () => {
    setShowReplaceDialog(false);
    setSubmitStatus('idle');
    setIsSubmitting(false);
  };

  // Handler para seleção de plano
  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
    
    // Se for plano FREE, fecha o modal de seleção e mostra o formulário
    if (plan === 'FREE') {
      setShowPlanSelection(false);
    } else {
      // Se for plano pago, redireciona para página de pagamento
      const paymentUrl = `/pagamento?plano=${plan}&produto=${encodeURIComponent(productName)}&productId=${productId}`;
      window.location.href = paymentUrl;
    }
  };

  // Handler para fechar modal de seleção de plano (X button)
  const handlePlanModalClose = () => {
    onClose();
    // Reset state when closing
    setSelectedPlan(null);
    setShowPlanSelection(true);
  };

  // Handler para confirmar seleção de plano (Continuar button)
  const handlePlanConfirm = () => {
    if (selectedPlan) {
      handlePlanSelect(selectedPlan);
    }
  };

  // Handler para fechar apenas o modal de seleção de plano (sem fechar o modal principal)
  const handlePlanSelectionClose = () => {
    setShowPlanSelection(false);
  };

  // Fecha modal ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      // Reset state when closing
      setSelectedPlan(null);
      setShowPlanSelection(true);
    }
  };

  // Fecha modal com ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        // Reset state when closing
        setSelectedPlan(null);
        setShowPlanSelection(true);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedPlan(null);
      setShowPlanSelection(true);
    }
  }, [isOpen]);

  // Previne scroll do body quando modal está aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Plan Selection Modal */}
      {showPlanSelection && (
        <PlanSelectionModal
          isOpen={showPlanSelection}
          onClose={handlePlanModalClose}
          onPlanSelect={handlePlanSelect}
          onConfirm={handlePlanConfirm}
          productName={productName}
        />
      )}

      {/* Replace Dialog Modal */}
      {showReplaceDialog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Cadastro Existente
                </h2>
                <button
                  onClick={handleKeepExisting}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    Já existe um registo para este produto
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Tivemos um registo anterior para o produto <strong>{productName}</strong> utilizando este email ou contacto.
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Deseja substituir o registo anterior por este novo?
                  </p>
                </div>
              </div>

              {existingRegistration && (
                <div className="bg-[var(--muted)]/10 rounded-lg p-4 mb-4">
                  <p className="text-xs text-[var(--muted)] mb-1">Registro anterior:</p>
                  <p className="text-sm text-[var(--foreground)]">
                    <strong>Nome:</strong> {existingRegistration.nome}
                  </p>
                  <p className="text-sm text-[var(--foreground)]">
                    <strong>Email:</strong> {existingRegistration.email}
                  </p>
                  <p className="text-sm text-[var(--foreground)]">
                    <strong>Telefone:</strong> {existingRegistration.telefone}
                  </p>
                  <p className="text-sm text-[var(--foreground)]">
                    <strong>Data:</strong> {new Date(existingRegistration.data).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleKeepExisting}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-[var(--border)] text-[var(--foreground)] font-semibold rounded-lg hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Não, manter o anterior
                </button>
                <button
                  onClick={handleReplace}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Substituindo...
                    </>
                  ) : (
                    'Sim, substituir'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Form Modal */}
      {!showPlanSelection && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 id="modal-title" className="text-base sm:text-xl font-semibold text-[#1a1a2e]">
                {t('downloadModal.downloadProduct').replace('{product}', productName)}
              </h2>
              <p className="text-xs sm:text-sm text-[#1a1a2e]/80">
                {t('downloadModal.selectedPlan')}: <span className="font-semibold">{selectedPlan}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPlanSelection(true)}
                className="p-2 text-[#1a1a2e]/80 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/20 rounded-lg transition-colors"
                aria-label={t('downloadModal.backToSelection')}
                title={t('downloadModal.changePlan')}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#1a1a2e]/80 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/20 rounded-lg transition-colors"
                aria-label={t('downloadModal.closeModal')}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {submitStatus === 'idle' && (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <p className="text-xs sm:text-sm text-[var(--muted)] mb-3 sm:mb-4">
                {t('downloadModal.fillData').replace('{product}', productName)}
              </p>

              {/* Empresa */}
              <div>
                <label htmlFor="empresa" className="block text-xs sm:text-sm font-medium text-[var(--foreground)] mb-1.5 sm:mb-2">
                  {t('downloadModal.companyName')} <span className="text-red-500">{t('downloadModal.required')}</span>
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder={t('downloadModal.companyPlaceholder')}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--foreground)] text-sm sm:text-base ${
                    errors.empresa
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.empresa && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.empresa}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-1.5 sm:mb-2">
                  {t('downloadModal.companyPhone')} <span className="text-red-500">{t('downloadModal.required')}</span>
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder={t('downloadModal.phonePlaceholder')}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)] text-sm sm:text-base ${
                    errors.telefone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.telefone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.telefone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[var(--text-primary)] mb-1.5 sm:mb-2">
                  {t('downloadModal.companyEmail')} <span className="text-red-500">{t('downloadModal.required')}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('downloadModal.emailPlaceholder')}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)] text-sm sm:text-base ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[var(--border)] focus:border-[var(--accent)]'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[var(--accent)] text-[#1a1a2e] font-semibold rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    {t('downloadModal.processing')}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('downloadModal.downloadNow')}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Estado de Sucesso */}
          {submitStatus === 'success' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-2">
                Pedido Recebido com Sucesso
              </h3>
              <p className="text-sm sm:text-base text-[var(--muted)] mb-3 sm:mb-4">
                O seu pedido foi recebido. O link de download será enviado para o seu email em até 7 dias.
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted)] mb-3 sm:mb-4">
                Enviámos um email com as informações para {formData.email}. Se não encontrar na caixa de entrada, por favor verifique o spam.
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted)] mb-4 sm:mb-6">
                Email: {formData.email}
              </p>
              <button
                onClick={() => {
                  onClose();
                  setFormData({
                    empresa: '',
                    telefone: '',
                    email: ''
                  });
                  setSelectedPlan(null);
                  setShowPlanSelection(true);
                  setSubmitStatus('idle');
                }}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent)]/90 transition-colors duration-200"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Estado de Erro */}
          {submitStatus === 'error' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-2">
                {t('downloadModal.errorProcessing')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--muted)] mb-4 sm:mb-6">
                {errorMessage || t('downloadModal.errorProcessingDesc')}
              </p>
              <button
                onClick={() => {
                  setSubmitStatus('idle');
                  setErrorMessage('');
                }}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--accent)] text-[#1a1a2e] font-semibold rounded-lg hover:bg-[var(--primary)] transition-colors text-sm sm:text-base"
              >
                {t('downloadModal.tryAgain')}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[var(--card)] border-t border-[var(--border)]">
          <p className="text-[10px] sm:text-xs text-[var(--muted)] text-center">
            {t('downloadModal.secureData')}
          </p>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default DownloadModal;
export type { DownloadModalProps };
