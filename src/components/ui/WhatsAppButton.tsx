'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '244946570104';
  const { t } = useLanguage();
  const whatsappMessage = t('hero.location') ? `Olá! Gostaria de saber mais sobre a SINGULAR.i.` : 'Hello! I would like to know more about SINGULAR.i.';

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label={t('whatsapp.label')}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
};

export default WhatsAppButton;
