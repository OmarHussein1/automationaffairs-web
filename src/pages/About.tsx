import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Mail, GitBranch, Heart, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/Button';

export function About() {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'Maximilian Kern',
      title: 'Client Strategy Lead',
      email: 'max@automationaffairs.com',
    },
    {
      name: 'Dario Suckfüll',
      title: 'Automation Engineering Lead',
      email: 'dario@automationaffairs.com',
    },
    {
      name: 'Omar Hussein',
      title: 'Principal Full-Stack Engineer',
      email: 'omar@automationaffairs.com',
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
      <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-ink dark:text-dark-text mb-6 uppercase"
              style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}
            >
              {t('about:title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              className="text-lg md:text-xl text-neutral-ink-muted dark:text-dark-text/70 max-w-3xl mx-auto"
            >
{t('about:hero.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(() => {
              const paragraphs = t('about:intro.paragraphs', { returnObjects: true });
              const paragraphArray = Array.isArray(paragraphs) ? paragraphs : [];
              const icons = [GitBranch, Heart, Settings];
              
              return paragraphArray.map((paragraph: string, index: number) => {
                const IconComponent = icons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: [0.4, 0.0, 0.2, 1]
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ 
                      y: -4,
                      transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                    }}
                    className="bg-neutral-surface dark:bg-gray-700 p-8 rounded-2xl border border-neutral-ink/10 dark:border-gray-600/50 text-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 dark:bg-[#f3ff5a]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-primary dark:text-[#f3ff5a]" />
                    </div>
                    <p className="text-neutral-ink dark:text-dark-text leading-relaxed">
                      {paragraph}
                    </p>
                  </motion.div>
                );
              });
            })()} 
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-section-mobile md:py-section-desktop bg-neutral-surface dark:bg-dark-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4"
            >
              Our Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-lg text-neutral-ink-muted dark:text-dark-text/70 max-w-2xl mx-auto"
            >
              Meet the experts behind Automation Affairs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
                }}
                className="bg-neutral-bg dark:bg-gray-700 p-8 rounded-2xl border border-neutral-ink/10 dark:border-gray-600/50 text-center"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-[#f3ff5a]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-primary dark:text-[#f3ff5a]" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-2">
                  {member.name}
                </h3>
                <p className="text-neutral-ink-muted dark:text-dark-text/70 mb-4">
                  {member.title}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
              }}
              className="bg-white dark:bg-gray-700 p-8 rounded-2xl border border-neutral-ink/10 dark:border-gray-600/50"
            >
              <h2 className="text-2xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('about:mission.title')}
              </h2>
              <p className="text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                {t('about:mission.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
              }}
              className="bg-white dark:bg-gray-700 p-8 rounded-2xl border border-neutral-ink/10 dark:border-gray-600/50"
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

      {/* CTA Section */}
      <section id="cta" className="py-section-mobile md:py-section-desktop relative parallax-section bg-[#3b5bdb] dark:bg-[#f3ff5a]">
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white dark:text-black mb-4">
              {t('home:cta.title')}
            </h2>
            <p className="text-lg text-white/90 dark:text-black/90 mb-8">
              {t('home:cta.subtitle')}
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white dark:bg-black text-[#3b5bdb] dark:text-[#f3ff5a] border-white dark:border-black hover:bg-white/90 dark:hover:bg-black/90" 
              asChild
            >
              <Link 
                to="/contact"
                onClick={() => {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                {t('home:cta.button')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
