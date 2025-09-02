import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Privacy() {
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
            {t('legal:privacy.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-neutral-ink-muted dark:text-dark-text/70 space-y-8">
            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <p className="text-neutral-ink dark:text-dark-text mb-4">
                {t('legal:privacy.overview.content')}
              </p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-6">
                1. {t('legal:privacy.controllers.title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-3">Germany:</h3>
                  <p className="text-sm">
                    Dario Suckfüll<br />
                    Schleißheimer Straße 124<br />
                    80797 Munich, Germany<br />
                    Email: <a href="mailto:dario@automationaffairs.com" className="text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 transition-colors">dario@automationaffairs.com</a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-3">Austria:</h3>
                  <p className="text-sm">
                    Maximilian Franz Alois Kern e.U.<br />
                    Koschatweg 35<br />
                    9201 Krumpendorf am Wörthersee, Austria<br />
                    Email: <a href="mailto:max@automationaffairs.com" className="text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 transition-colors">max@automationaffairs.com</a>
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">
                {t('legal:privacy.controllers.content')}
              </p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                2. {t('legal:privacy.collection.title')}
              </h2>
              <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-4">{t('legal:privacy.collection.whoCollects.title')}</h3>
              <p className="mb-4">{t('legal:privacy.collection.whoCollects.content')}</p>
              <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-4">{t('legal:privacy.collection.howCollect.title')}</h3>
              <p className="mb-4">{t('legal:privacy.collection.howCollect.content')}</p>
              <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-4">{t('legal:privacy.collection.whatFor.title')}</h3>
              <p className="mb-4">{t('legal:privacy.collection.whatFor.content')}</p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                3. {t('legal:privacy.rights.title')}
              </h2>
              <p className="mb-4">{t('legal:privacy.rights.content')}</p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                4. {t('legal:privacy.cookies.title')}
              </h2>
              <p className="mb-4">{t('legal:privacy.cookies.content')}</p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                5. {t('legal:privacy.contact.title')}
              </h2>
              <p className="mb-4">{t('legal:privacy.contact.content')}</p>
              <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">{t('legal:privacy.contact.authority')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
