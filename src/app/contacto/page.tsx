'use client';

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contacto() {
  const { t } = useLanguage();

  return (
    <div>
      <Section className="pt-24 sm:pt-16 py-8 sm:py-20 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#ffffff] tracking-tight">
                {t('contact.title')}
              </h1>
              <p className="text-base sm:text-xl text-[#a0a0a0]">
                {t('contact.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#ffffff]">{t('contact.informacoes')}</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-[#282a36] p-4 sm:p-6 rounded-lg border border-[#282a36]">
                    <h3 className="font-semibold mb-2 text-[#ffffff]">{t('contact.email')}</h3>
                    <p className="text-sm sm:text-base text-[#a0a0a0]">{t('contact.emailValue')}</p>
                  </div>
                  <div className="bg-[#282a36] p-4 sm:p-6 rounded-lg border border-[#282a36]">
                    <h3 className="font-semibold mb-2 text-[#ffffff]">{t('contact.telefone')}</h3>
                    <p className="text-sm sm:text-base text-[#a0a0a0]">{t('contact.telefoneValue')}</p>
                  </div>
                  <div className="bg-[#282a36] p-4 sm:p-6 rounded-lg border border-[#282a36]">
                    <h3 className="font-semibold mb-2 text-[#ffffff]">{t('contact.localizacao')}</h3>
                    <p className="text-sm sm:text-base text-[#a0a0a0]">{t('contact.localizacaoValue')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#ffffff]">{t('contact.enviarMensagem')}</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">{t('contact.nome')}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all text-[var(--foreground)] text-base bg-[var(--card)]"
                      placeholder={t('contact.nomePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">{t('contact.email')}</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all text-[var(--foreground)] text-base bg-[var(--card)]"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">{t('contact.mensagem')}</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all resize-none text-[var(--foreground)] text-base bg-[var(--card)]"
                      placeholder={t('contact.mensagemPlaceholder')}
                    ></textarea>
                  </div>
                  <Button variant="primary" size="lg" className="w-full">
                    {t('contact.enviar')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
