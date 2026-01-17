import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from '@phosphor-icons/react';
import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import { ValuesSection } from '../components/values';
import { ProcessSection } from '../components/process/ProcessSection';
import { TestimonialsSection } from '../components/testimonials';
import { SectionNavigator } from '../components/SectionNavigator';
import { useFullpageScroll } from '../hooks/useFullpageScroll';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'what-we-do', label: 'What We Do' },
  { id: 'process', label: 'How We Work' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'values', label: 'Our Values' },
  { id: 'cta', label: 'Get Started' },
];

export function Home() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const containerRef = useRef<HTMLDivElement>(null);

  // Use custom fullpage scroll hook
  const { activeSection, navigateToSection } = useFullpageScroll({
    sections: SECTIONS,
    containerRef,
  });


  const getLocalizedPath = (path: string) => {
    return isGerman ? `/de${path}` : path;
  };

  const scrollToProcess = () => {
    navigateToSection(2);
  };

  return (
    <>
      <SEO
        title={t('common:seo.home.title')}
        description={t('common:seo.home.description')}
        keywords={t('common:seo.home.keywords')}
      />

      {/* Section Navigator */}
      <SectionNavigator
        sections={SECTIONS}
        activeIndex={activeSection}
        onNavigate={navigateToSection}
      />

      {/* Fullpage Scroll Container */}
      <div ref={containerRef} className="fullpage-container">
        {/* Hero Section */}
        <section
          id="hero"
          className="fullpage-section relative flex items-center hero-grid-bg"
        >
          <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70" />

          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Logo above title */}
              <div className="hero-logo flex justify-center mb-4 sm:mb-6 lg:mb-8 opacity-0">
                <img
                  src="/logo.svg"
                  alt="Automation Affairs Logo"
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain filter dark:invert"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('.svg')) {
                      target.src = '/logo.png';
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                />
              </div>

              <h1
                className="hero-title text-xl xs:text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-neutral-ink dark:text-dark-text mb-4 lg:mb-6 whitespace-pre-line uppercase opacity-0"
                style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}
              >
                {t('home:hero.title')}
              </h1>

              <p className="hero-subtitle text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-ink-muted dark:text-dark-text/70 mb-6 lg:mb-8 max-w-2xl mx-auto px-2 opacity-0">
                {t('home:hero.subtitle')}
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-2 items-center">
                <Button
                  size="md"
                  className="lg:size-lg bg-primary dark:bg-[#f3ff5a] hover:bg-primary/90 dark:hover:bg-[#f3ff5a]/90 text-white dark:text-black w-full sm:w-auto opacity-0"
                  asChild
                >
                  <Link to={getLocalizedPath('/contact')}>
                    {t('home:hero.primaryCta')}
                    <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="lg:size-lg border-primary dark:border-[#f3ff5a] text-primary dark:text-[#f3ff5a] hover:bg-primary/10 dark:hover:bg-[#f3ff5a]/10 w-full sm:w-auto opacity-0"
                  onClick={scrollToProcess}
                >
                  {t('home:hero.secondaryCta')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section
          id="what-we-do"
          className="fullpage-section flex items-center bg-[#3b5bdb] dark:bg-[#f3ff5a]"
        >
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="what-we-do-content opacity-0">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white dark:text-black mb-6">
                  {t('home:whatWeDo.title')}
                </h2>
                <p className="text-lg text-white/90 dark:text-black/90 leading-relaxed">
                  {t('home:whatWeDo.description')}
                </p>
              </div>
              <div className="what-we-do-image opacity-0">
                <div className="aspect-[4/3] bg-neutral-ink/10 dark:bg-dark-text/10 rounded-2xl overflow-hidden">
                  <img
                    src="/Animation-fast-light-Web.gif"
                    alt={t('home:whatWeDo.imageAlt')}
                    className="w-full h-full object-cover dark:hidden"
                    style={{
                      imageRendering: 'auto',
                      animation: 'none',
                    }}
                  />
                  <img
                    src="/Animation-fast-Dark-Web.gif"
                    alt={t('home:whatWeDo.imageAlt')}
                    className="w-full h-full object-cover hidden dark:block"
                    style={{
                      imageRendering: 'auto',
                      animation: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work Process Section */}
        <section id="process" className="fullpage-section">
          <ProcessSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="fullpage-section relative">
          <TestimonialsSection />
        </section>

        {/* Values Section */}
        <section id="values" className="fullpage-section relative">
          <div className="hero-grid-bg h-full flex flex-col justify-center">
            <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70" />
            <ValuesSection />
          </div>
        </section>

        {/* CTA Section with Integrated Footer */}
        <section
          id="cta"
          className="fullpage-section flex flex-col bg-[#3b5bdb] dark:bg-[#f3ff5a]"
        >
          <div className="flex-1 flex items-center">
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="cta-title text-2xl md:text-3xl font-heading font-bold text-white dark:text-black mb-4 opacity-0">
                  {t('home:cta.title')}
                </h2>
                <p className="cta-subtitle text-lg text-white/90 dark:text-black/90 mb-8 opacity-0">
                  {t('home:cta.subtitle')}
                </p>
                <div className="cta-button opacity-0">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white dark:bg-black text-[#3b5bdb] dark:text-[#f3ff5a] border-white dark:border-black hover:bg-white/90 dark:hover:bg-black/90"
                    asChild
                  >
                    <Link
                      to={getLocalizedPath('/contact')}
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
            </div>
          </div>

          {/* Integrated Footer */}
          <div className="cta-footer py-8 border-t border-white/20 dark:border-black/20 opacity-0">
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {/* Brand */}
                <div className="md:col-span-1">
                  <Link
                    to={getLocalizedPath('/')}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src="/logo.svg"
                      alt="Automation Affairs Logo"
                      className="w-8 h-8 object-contain filter brightness-0 invert dark:brightness-100 dark:invert-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('.svg')) {
                          target.src = '/logo.png';
                        } else {
                          target.style.display = 'none';
                        }
                      }}
                    />
                    <span className="font-heading text-base font-semibold text-white dark:text-black">
                      AUTOMATION AFFAIRS
                    </span>
                  </Link>
                  <p className="mt-3 text-sm text-white/70 dark:text-black/70 max-w-xs">
                    {t('footer.description')}
                  </p>
                </div>

                {/* Legal Links */}
                <div className="md:col-span-1">
                  <h3 className="font-heading text-xs font-semibold text-white dark:text-black uppercase tracking-wider mb-3">
                    Legal
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to={getLocalizedPath('/impressum')}
                      className="block text-sm text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black transition-colors"
                    >
                      {t('footer.legal.impressum')}
                    </Link>
                    <Link
                      to={getLocalizedPath('/privacy')}
                      className="block text-sm text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black transition-colors"
                    >
                      {t('footer.legal.privacy')}
                    </Link>
                  </div>
                </div>

                {/* Contact */}
                <div className="md:col-span-1">
                  <h3 className="font-heading text-xs font-semibold text-white dark:text-black uppercase tracking-wider mb-3">
                    Contact
                  </h3>
                  <a
                    href={`mailto:${t('footer.email')}`}
                    className="block text-sm text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black transition-colors"
                  >
                    {t('footer.email')}
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="pt-6 border-t border-white/10 dark:border-black/10">
                <p className="text-xs text-white/50 dark:text-black/50 text-center">
                  © {new Date().getFullYear()} Automation Affairs. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
