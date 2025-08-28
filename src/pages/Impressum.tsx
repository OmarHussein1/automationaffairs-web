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
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-8">
            {t('legal.impressum.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-neutral-ink-muted dark:text-dark-text/70">
            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <strong>Company Name:</strong><br />
                  Automation Affairs GmbH
                </div>
                <div>
                  <strong>Address:</strong><br />
                  Musterstraße 123<br />
                  1010 Vienna<br />
                  Austria
                </div>
                <div>
                  <strong>Contact:</strong><br />
                  Email: hello@automationaffairs.com<br />
                  Phone: +43 (0) 123 456 789
                </div>
                <div>
                  <strong>Commercial Register:</strong><br />
                  FN 123456a<br />
                  Commercial Court Vienna
                </div>
                <div>
                  <strong>VAT ID:</strong><br />
                  ATU12345678
                </div>
                <div>
                  <strong>Managing Director:</strong><br />
                  [Name to be added]
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Disclaimer
              </h2>
              <p>
                The information on this website has been compiled with care and to the best of our knowledge. 
                However, we cannot guarantee the accuracy, completeness, or timeliness of the information provided.
              </p>
              <p className="mt-4">
                We reserve the right to change or update the information on this website at any time without notice.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
