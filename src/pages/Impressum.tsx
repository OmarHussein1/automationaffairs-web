import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Impressum() {
  const { t } = useTranslation();

  return (
    <div className="py-section-mobile md:py-section-desktop">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-8 text-center">
            {t('legal:impressum.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-neutral-ink-muted dark:text-dark-text/70">
            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10 mb-8">
              <p className="text-neutral-ink dark:text-dark-text mb-2">
                {t('legal:impressum.brandDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
                <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-6">
                  Dario Suckfüll
                </h2>
                <div className="space-y-3">
                  <div>
                    <strong>{t('legal:impressum.address')}:</strong><br />
                    Schleißheimer Straße 124<br />
                    80797 Munich<br />
                    Germany
                  </div>
                  <div>
                    <strong>{t('legal:impressum.court')}:</strong><br />
                    Munich
                  </div>
                  <div>
                    <strong>{t('legal:impressum.vatId')}:</strong><br />
                    DE427649766
                  </div>
                  <div>
                    <strong>{t('legal:impressum.phone')}:</strong><br />
                    +49 162 7673865
                  </div>
                  <div>
                    <strong>{t('legal:impressum.email')}:</strong><br />
                    <a href="mailto:dario@automationaffairs.com" className="text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 transition-colors">
                      dario@automationaffairs.com
                    </a>
                  </div>
                  <div>
                    <strong>{t('legal:impressum.registeredTrade')}:</strong><br />
                    {t('legal:impressum.darioTrade')}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
                <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-6">
                  Maximilian Franz Alois Kern e.U.
                </h2>
                <div className="space-y-3">
                  <div>
                    <strong>{t('legal:impressum.address')}:</strong><br />
                    Koschatweg 35<br />
                    9201 Krumpendorf am Wörthersee<br />
                    Austria
                  </div>
                  <div>
                    <strong>{t('legal:impressum.court')}:</strong><br />
                    Klagenfurt
                  </div>
                  <div>
                    <strong>{t('legal:impressum.vatId')}:</strong><br />
                    ATU72431978
                  </div>
                  <div>
                    <strong>{t('legal:impressum.phone')}:</strong><br />
                    +43 660 5358688
                  </div>
                  <div>
                    <strong>{t('legal:impressum.email')}:</strong><br />
                    <a href="mailto:max@automationaffairs.com" className="text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 transition-colors">
                      max@automationaffairs.com
                    </a>
                  </div>
                  <div>
                    <strong>{t('legal:impressum.registeredTrade')}:</strong><br />
                    {t('legal:impressum.maxTrade')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                {t('legal:impressum.disclaimer')}
              </h2>
              <p className="mb-4">
                {t('legal:impressum.disclaimerText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
