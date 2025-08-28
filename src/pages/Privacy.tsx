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
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-8">
            {t('legal.privacy.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-neutral-ink-muted dark:text-dark-text/70 space-y-8">
            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Data Protection Overview
              </h2>
              <p>
                We take the protection of your personal data very seriously. This privacy policy explains 
                how we collect, use, and protect your information when you visit our website or use our services.
              </p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Data Collection
              </h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact information (name, email, phone number) when you fill out forms</li>
                <li>Technical data (IP address, browser type, device information) for website functionality</li>
                <li>Usage data to improve our services and website performance</li>
                <li>Cookies and similar technologies for enhanced user experience</li>
              </ul>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                How We Use Your Data
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your inquiries and provide our services</li>
                <li>To improve our website and user experience</li>
                <li>To send you relevant information about our services (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Your Rights (GDPR)
              </h2>
              <p className="mb-4">Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Cookies
              </h2>
              <p className="mb-4">
                We use cookies to enhance your browsing experience. You can manage cookie preferences 
                through your browser settings or our cookie consent banner.
              </p>
              <button 
                onClick={() => {/* Cookie settings handler */}}
                className="text-primary hover:text-primary/80 focus-ring rounded transition-colors underline"
              >
                Manage Cookie Settings
              </button>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Contact for Privacy Matters
              </h2>
              <p>
                If you have questions about this privacy policy or wish to exercise your rights, 
                please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> privacy@automationaffairs.com<br />
                <strong>Address:</strong> Automation Affairs GmbH, Musterstraße 123, 1010 Vienna, Austria
              </p>
            </div>

            <div className="bg-neutral-surface dark:bg-dark-surface p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10">
              <h2 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4">
                Updates to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. The latest version will always 
                be available on this page with the date of last update.
              </p>
              <p className="mt-4 text-sm text-neutral-ink-muted dark:text-dark-text/50">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
