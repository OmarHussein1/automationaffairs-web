import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { GeometricBackground } from '../assets/svg/GeometricBackground';
import { SEO } from '../components/SEO';
import { useGSAPScrollAnimations } from '../hooks/useGSAPScrollAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function Home() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const containerRef = useGSAPScrollAnimations();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const processRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const valuesRef = useRef<HTMLDivElement>(null);
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  
  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // GSAP ScrollTrigger for sticky process section
  useEffect(() => {
    if (!processRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the process section
      ScrollTrigger.create({
        trigger: processRef.current,
        start: "top top",
        end: "+=400%",
        pin: ".process-content",
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setCurrentStep(0);
          } else if (progress < 0.66) {
            setCurrentStep(1);
          } else {
            setCurrentStep(2);
          }
        }
      });
    }, processRef);

    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger for values section
  useEffect(() => {
    if (!valuesRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: valuesRef.current,
        start: "top top",
        end: "+=800%",
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

  // Auto-rotate testimonials
  useEffect(() => {
    const testimonials = t('home:testimonials.items', { returnObjects: true });
    const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
    
    if (testimonialsArray.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonialsArray.length);
      }, 5000); // Change every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [t]);

  return (
    <div className="min-h-screen overflow-x-hidden" ref={containerRef}>
      <SEO 
        title={t('common:seo.home.title')}
        description={t('common:seo.home.description')}
        keywords={t('common:seo.home.keywords')}
      />
      {/* Hero Section */}
      <section className="relative py-8 md:py-section-desktop min-h-[60vh] md:min-h-[80vh] flex items-center parallax-section">
        <GeometricBackground variant="lines" className="text-neutral-ink/5 dark:text-dark-text/5 parallax-bg" />
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-ink dark:text-dark-text mb-4 md:mb-6 whitespace-pre-line uppercase"
              style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}
            >
              {t('home:hero.title')}
            </motion.h1>
            
            <p className="hero-subtitle text-base md:text-lg lg:text-xl text-neutral-ink-muted dark:text-dark-text/70 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              {t('home:hero.subtitle')}
            </p>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-2">
              <Button size="md" className="sm:size-lg" asChild>
                <Link to={getLocalizedPath('/contact')}>
                  {t('home:hero.primaryCta')}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="md" className="sm:size-lg" onClick={scrollToProcess}>
                {t('home:hero.secondaryCta')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-section-mobile md:py-section-desktop bg-neutral-surface dark:bg-dark-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="what-we-do-content">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-6">
                {t('home:whatWeDo.title')}
              </h2>
              <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                {t('home:whatWeDo.description')}
              </p>
            </div>
            <div className="what-we-do-image">
              <div className="aspect-[4/3] bg-neutral-ink/10 dark:bg-dark-text/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-primary rounded-lg"></div>
                  </div>
                  <p className="text-neutral-ink/50 dark:text-dark-text/50 text-sm">Placeholder Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Process Section */}
      <section ref={processRef} id="process" className="relative">
        <div className="process-content bg-neutral-bg dark:bg-dark-bg min-h-screen flex items-center justify-center">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('home:process.title')}
              </h2>
              <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 max-w-2xl mx-auto">
                {t('home:process.subtitle')}
              </p>
            </div>

            {/* Sequential Process Steps */}
            <div className="relative flex items-center justify-center min-h-[400px]">
              {[
                { key: 'scope', index: 0 },
                { key: 'identify', index: 1 },
                { key: 'build', index: 2 }
              ].map((step) => (
                <motion.div
                  key={step.key}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{
                    opacity: currentStep === step.index ? 1 : 0,
                    x: currentStep === step.index ? 0 : currentStep > step.index ? -100 : 100,
                    scale: currentStep === step.index ? 1 : 0.8
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="text-center max-w-md">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary-azure/10 dark:from-primary/20 dark:to-primary-azure/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl"
                      animate={{
                        scale: currentStep === step.index ? [0.8, 1.1, 1] : 0.8,
                        rotate: currentStep === step.index ? [0, 5, 0] : 0
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      {t(`home:process.steps.${step.key}.icon`)}
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4"
                      animate={{
                        y: currentStep === step.index ? [20, 0] : 20,
                        opacity: currentStep === step.index ? 1 : 0
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {t(`home:process.steps.${step.key}.title`)}
                    </motion.h3>
                    <motion.p 
                      className="text-lg text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed"
                      animate={{
                        y: currentStep === step.index ? [20, 0] : 20,
                        opacity: currentStep === step.index ? 1 : 0
                      }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {t(`home:process.steps.${step.key}.description`)}
                    </motion.p>
                    <motion.div 
                      className="mt-6 text-sm font-medium text-primary-cobalt"
                      animate={{
                        y: currentStep === step.index ? [20, 0] : 20,
                        opacity: currentStep === step.index ? 1 : 0
                      }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      Step {step.index + 1} of 3
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Progress Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentStep === index ? 'bg-primary dark:bg-[#f3ff5a]' : 'bg-neutral-ink/20 dark:bg-dark-text/20'
                    }`}
                    animate={{
                      scale: currentStep === index ? [1, 1.3, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="relative">
        <div className="values-content bg-neutral-bg dark:bg-dark-bg min-h-screen flex items-center justify-center">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('home:values.title')}
              </h2>
              <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 max-w-2xl mx-auto">
                {t('home:values.subtitle')}
              </p>
            </div>

            {/* Sequential Individual Values */}
            <div className="relative flex items-center justify-center min-h-[400px]">
              {[
                { key: 'humanLed', icon: '👥', index: 0 },
                { key: 'outcomes', icon: '🎯', index: 1 },
                { key: 'precision', icon: '⚡', index: 2 },
                { key: 'privacy', icon: '🔒', index: 3 },
                { key: 'partner', icon: '🤝', index: 4 }
              ].map((value) => (
                <motion.div
                  key={value.key}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{
                    opacity: currentValueIndex === value.index ? 1 : 0,
                    x: currentValueIndex === value.index ? 0 : currentValueIndex > value.index ? -100 : 100,
                    scale: currentValueIndex === value.index ? 1 : 0.8
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="text-center max-w-md">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary-azure/10 dark:from-primary/20 dark:to-primary-azure/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl"
                      animate={{
                        scale: currentValueIndex === value.index ? [0.8, 1.1, 1] : 0.8,
                        rotate: currentValueIndex === value.index ? [0, 5, 0] : 0
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      {value.icon}
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-heading font-semibold text-neutral-ink dark:text-dark-text mb-4"
                      animate={{
                        y: currentValueIndex === value.index ? [20, 0] : 20,
                        opacity: currentValueIndex === value.index ? 1 : 0
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {t(`home:values.items.${value.key}.title`)}
                    </motion.h3>
                    <motion.p 
                      className="text-lg text-neutral-ink/70 dark:text-dark-text/70 leading-relaxed"
                      animate={{
                        y: currentValueIndex === value.index ? [20, 0] : 20,
                        opacity: currentValueIndex === value.index ? 1 : 0
                      }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {t(`home:values.items.${value.key}.description`)}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

              {/* Progress Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentValueIndex === index ? 'bg-primary dark:bg-[#f3ff5a]' : 'bg-neutral-ink/20 dark:bg-dark-text/20'
                    }`}
                    animate={{
                      scale: currentValueIndex === index ? [1, 1.3, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-section-mobile md:py-section-desktop bg-neutral-surface dark:bg-dark-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
              {t('home:testimonials.title')}
            </h2>
            <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 max-w-2xl mx-auto">
              {t('home:testimonials.subtitle')}
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              {(() => {
                const testimonials = t('home:testimonials.items', { returnObjects: true });
                const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
                
                if (testimonialsArray.length === 0) return null;
                
                const testimonial = testimonialsArray[currentTestimonial];
                
                return (
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-dark-surface rounded-2xl p-8 md:p-12 border border-neutral-stroke/50 dark:border-dark-stroke/50 shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-azure/20 dark:from-primary/30 dark:to-primary-azure/30 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/40 to-primary-azure/40 rounded-full flex items-center justify-center text-white font-heading text-xl">
                            {testimonial.name?.charAt(0) || 'A'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow text-center md:text-left">
                        <blockquote className="text-lg md:text-xl text-neutral-ink dark:text-dark-text leading-relaxed mb-6">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="space-y-1">
                          <div className="font-heading font-semibold text-neutral-ink dark:text-dark-text">
                            {testimonial.name}
                          </div>
                          <div className="text-primary font-medium">
                            {testimonial.position}
                          </div>
                          <div className="text-neutral-ink-muted dark:text-dark-text/70">
                            {testimonial.company} • {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2 px-4">
              {(() => {
                const testimonials = t('home:testimonials.items', { returnObjects: true });
                const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
                
                return testimonialsArray.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial
                        ? 'bg-primary'
                        : 'bg-neutral-ink/20 dark:bg-dark-text/20 hover:bg-primary/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section-mobile md:py-section-desktop relative parallax-section">
        <GeometricBackground variant="stripes" className="text-neutral-ink/3 dark:text-dark-text/3 parallax-bg" />
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-ink dark:text-dark-text mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-neutral-ink-muted dark:text-dark-text/70 mb-8">
              {t('cta.subtitle')}
            </p>
            <Button size="lg" asChild>
              <Link to={getLocalizedPath('/contact')}>
                {t('cta.button')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

