import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users } from 'lucide-react';
import { GeometricBackground } from '../assets/svg/GeometricBackground';
import { SEO } from '../components/SEO';

export function About() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      key: 'excellence',
      title: t('about.values.items.excellence.title'),
      description: t('about.values.items.excellence.description'),
    },
    {
      icon: Lightbulb,
      key: 'innovation',
      title: t('about.values.items.innovation.title'),
      description: t('about.values.items.innovation.description'),
    },
    {
      icon: Users,
      key: 'partnership',
      title: t('about.values.items.partnership.title'),
      description: t('about.values.items.partnership.description'),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO 
        title={t('common:seo.about.title')}
        description={t('common:seo.about.description')}
        keywords={t('common:seo.about.keywords')}
      />
      {/* Hero */}
      <section className="py-section-mobile md:py-section-desktop bg-gradient-to-br from-primary-cobalt/5 to-primary-azure/5 dark:from-primary-cobalt/10 dark:to-primary-azure/10">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-ink dark:text-dark-text mb-6 uppercase"
              style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}
            >
              {t('about:title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-ink-muted dark:text-dark-text/70 max-w-3xl mx-auto"
            >
              Meet our team of automation experts and discover our mission to transform businesses through intelligent AI solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-section-mobile md:py-section-desktop">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {(() => {
              const paragraphs = t('about:intro.paragraphs', { returnObjects: true });
              const paragraphArray = Array.isArray(paragraphs) ? paragraphs : [];
              return paragraphArray.map((paragraph: string, index: number) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg text-neutral-ink dark:text-dark-text leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ));
            })()} 
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-section-mobile md:py-section-desktop bg-neutral-surface dark:bg-dark-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-neutral-bg dark:bg-dark-bg p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10"
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('about:mission.title')}
              </h2>
              <p className="text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                {t('about:mission.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-bg dark:bg-dark-bg p-8 rounded-2xl border border-neutral-ink/10 dark:border-dark-text/10"
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('about:vision.title')}
              </h2>
              <p className="text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                {t('about:vision.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-section-mobile md:py-section-desktop relative">
        <GeometricBackground variant="grid" className="text-neutral-ink/3 dark:text-dark-text/3" />
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
              {t('about.values.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-ink-muted dark:text-dark-text/70">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are & Approach */}
      <section className="py-section-mobile md:py-section-desktop bg-neutral-surface dark:bg-dark-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-6">
                {t('about.whoWeAre.title')}
              </h2>
              <p className="text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                {t('about.whoWeAre.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-6">
                {t('about.approach.title')}
              </h2>
              <p className="text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed mb-6">
                {t('about.approach.description')}
              </p>
              <ul className="space-y-4">
                {(() => {
                  const principles = t('about.approach.principles', { returnObjects: true });
                  const principleArray = Array.isArray(principles) ? principles : [];
                  return principleArray.map((principle: string, index: number) => (
                    <li key={index} className="text-neutral-ink/80 dark:text-dark-text/80 flex items-start">
                      <span className="w-2 h-2 bg-primary-cobalt rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm leading-relaxed">{principle}</span>
                    </li>
                  ));
                })()}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
