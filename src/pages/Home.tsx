import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import { useGSAPScrollAnimations } from '../hooks/useGSAPScrollAnimations';
import { ValuesWheel } from '../components/ValuesWheel';
import { ProcessSection } from '../components/process/ProcessSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Home() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const containerRef = useGSAPScrollAnimations();
  const processRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  
  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);


  // GSAP ScrollTrigger for values section
  useEffect(() => {
    if (!valuesRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: valuesRef.current,
        start: "top top",
        end: "+=500%",
        pin: ".values-content",
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // 5 individual values appearing one by one
          // 0-0.2: Value 1, 0.2-0.4: Value 2, 0.4-0.6: Value 3, 0.6-0.8: Value 4, 0.8-1.0: Value 5
          
          if (progress < 0.2) {
            setCurrentValueIndex(0); // Human-Led
          } else if (progress < 0.4) {
            setCurrentValueIndex(1); // Outcomes
          } else if (progress < 0.6) {
            setCurrentValueIndex(2); // Precision
          } else if (progress < 0.8) {
            setCurrentValueIndex(3); // Privacy
          } else {
            setCurrentValueIndex(4); // Partner
          }
        }
      });
    }, valuesRef);

    return () => ctx.revert();
  }, []);

  const getLocalizedPath = (path: string) => {
    return isGerman ? `/de${path}` : path;
  };

  const scrollToProcess = () => {
    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen overflow-x-hidden" ref={containerRef}>
      <SEO 
        title={t('common:seo.home.title')}
        description={t('common:seo.home.description')}
        keywords={t('common:seo.home.keywords')}
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center parallax-section hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo above title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex justify-center mb-4 sm:mb-6 lg:mb-8"
            >
              <img 
                src="/logo.svg" 
                alt="Automation Affairs Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain filter dark:invert"
                onError={(e) => {
                  // Fallback to PNG if SVG fails
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('.svg')) {
                    target.src = '/logo.png';
                  } else {
                    // Final fallback - hide image
                    target.style.display = 'none';
                  }
                }}
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title text-xl xs:text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-neutral-ink dark:text-dark-text mb-4 lg:mb-6 whitespace-pre-line uppercase"
              style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}
            >
              {t('home:hero.title')}
            </motion.h1>
            
            <p className="hero-subtitle text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-ink-muted dark:text-dark-text/70 mb-6 lg:mb-8 max-w-2xl mx-auto px-2">
              {t('home:hero.subtitle')}
            </p>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-2 items-center">
              <Button size="md" className="lg:size-lg bg-primary dark:bg-[#f3ff5a] hover:bg-primary/90 dark:hover:bg-[#f3ff5a]/90 text-white dark:text-black w-full sm:w-auto" asChild>
                <Link to={getLocalizedPath('/contact')}>
                  {t('home:hero.primaryCta')}
                  <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="md" className="lg:size-lg border-primary dark:border-[#f3ff5a] text-primary dark:text-[#f3ff5a] hover:bg-primary/10 dark:hover:bg-[#f3ff5a]/10 w-full sm:w-auto" onClick={scrollToProcess}>
                {t('home:hero.secondaryCta')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-section-mobile md:py-section-desktop bg-[#3b5bdb] dark:bg-[#f3ff5a]">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="what-we-do-content">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white dark:text-black mb-6">
                {t('home:whatWeDo.title')}
              </h2>
              <p className="text-lg text-white/90 dark:text-black/90 leading-relaxed">
                {t('home:whatWeDo.description')}
              </p>
            </div>
            <div className="what-we-do-image">
              <div className="aspect-[4/3] bg-neutral-ink/10 dark:bg-dark-text/10 rounded-2xl overflow-hidden">
                <img 
                  src="/Animation-fast-light-Web.gif"
                  alt={t('home:whatWeDo.imageAlt')}
                  className="w-full h-full object-cover dark:hidden"
                  style={{ 
                    imageRendering: 'auto',
                    animation: 'none'
                  }}
                />
                <img 
                  src="/Animation-fast-Dark-Web.gif"
                  alt={t('home:whatWeDo.imageAlt')}
                  className="w-full h-full object-cover hidden dark:block"
                  style={{ 
                    imageRendering: 'auto',
                    animation: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Process Section */}
      <ProcessSection ref={processRef} />

      {/* Values Section */}
      <section ref={valuesRef} className="relative">
        <div className="values-content hero-grid-bg min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
          <div className="w-full mx-auto relative z-10">
            <div className="text-center mb-8 px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('home:values.title')}
              </h2>
              <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 max-w-2xl mx-auto">
                {t('home:values.subtitle')}
              </p>
            </div>

            {/* Values Wheel Animation */}
            <div className="relative">
              <ValuesWheel 
              currentValueIndex={currentValueIndex} 
              onValueChange={setCurrentValueIndex}
            />
              
              {/* Navigation buttons - Desktop only */}
              <div className="hidden md:flex absolute right-8 top-1/2 transform -translate-y-1/2 flex-col space-y-4 z-50">
                {/* Up arrow - go to previous section */}
                <motion.button
                  onClick={() => {
                    const processSection = document.getElementById('process');
                    if (processSection) {
                      processSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-500 flex items-center justify-center text-primary dark:text-[#f3ff5a] hover:shadow-xl transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <ArrowUp size={20} />
                </motion.button>

                {/* Down arrow - go to next section */}
                <motion.button
                  onClick={() => {
                    const ctaSection = document.getElementById('cta');
                    if (ctaSection) {
                      ctaSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-500 flex items-center justify-center text-primary dark:text-[#f3ff5a] hover:shadow-xl transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.1, y: 3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <ArrowDown size={20} />
                </motion.button>
              </div>
            </div>
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
      </section>
    </div>
  );
}

