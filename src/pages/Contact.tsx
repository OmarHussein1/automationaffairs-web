import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Envelope, Phone, Check, PaperPlaneTilt } from '@phosphor-icons/react';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';

interface FormData {
  name: string;
  company: string;
  email: string;
  role: string;
  website: string;
  companySize: string;
  budget: string;
  interests: string[];
  message: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function Contact() {
  const { t } = useTranslation();
  


  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    role: '',
    website: '',
    companySize: '',
    budget: '',
    interests: [],
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact:form.required');
    }
    if (!formData.company.trim()) {
      newErrors.company = t('contact:form.required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('contact:form.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = t('contact:form.required');
    }
    if (!formData.consent) {
      newErrors.consent = t('contact:form.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Webhook URL:', webhookUrl);
      console.log('Environment check:', import.meta.env);
      
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'website_contact_form'
      };

      console.log('Sending payload:', payload); // Debug log
      console.log('Using headers:', headers); // Debug log

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Response error:', responseText); // Debug log
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const responseData = await response.text();
      console.log('Response data:', responseData); // Debug log

      setIsSubmitted(true);
      console.log('Form submitted successfully to webhook');
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = t('contact:form.error');
      
      if (error instanceof Error) {
        if (error.message === 'Webhook URL not configured') {
          errorMessage = 'Contact form is not configured. Please email us directly at info@automationaffairs.com';
        } else if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again or contact us directly.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (isSubmitted) {
    return (
      <div className="overflow-hidden">
        <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
          <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
          
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-ink dark:text-dark-text mb-4">
                {t('contact:success.title')}
              </h1>
              <p className="text-lg text-neutral-ink/80 dark:text-dark-text/80 mb-8">
                {t('contact:success.message')}
              </p>
              <Button asChild>
                <a href="/">{t('common:nav.home')}</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO 
        title={t('common:seo.contact.title')}
        description={t('common:seo.contact.description')}
        keywords={t('common:seo.contact.keywords')}
      />
      {/* Hero Section */}
      <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-ink dark:text-dark-text mb-6 uppercase" style={{ fontFamily: 'Lexend Tera, system-ui, sans-serif' }}>
              {t('contact:hero.title')}
            </h1>
            <p className="text-xl text-neutral-ink/80 dark:text-dark-text/80 max-w-3xl mx-auto">
              {t('contact:hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative py-section-mobile md:py-section-desktop hero-grid-bg">
        <div className="absolute inset-0 bg-neutral-bg/70 dark:bg-dark-bg/70"></div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h2 className="font-heading text-3xl font-bold text-neutral-ink dark:text-dark-text mb-8">
                {t('contact:info.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 justify-center lg:justify-start">
                  <Envelope className="w-6 h-6 text-primary-cobalt mt-1" />
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-1">
                      {t('contact:info.email.title')}
                    </h3>
                    <a 
                      href="mailto:hello@automationaffairs.com"
                      className="text-neutral-ink/70 dark:text-dark-text/70 hover:text-primary-cobalt dark:hover:text-[#f3ff5a] transition-colors focus-ring rounded"
                    >
                      hello@automationaffairs.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 justify-center lg:justify-start">
                  <Phone className="w-6 h-6 text-primary-cobalt mt-1" />
                  <div className="text-center lg:text-left">
                    <h3 className="font-semibold text-neutral-ink dark:text-dark-text mb-1">
                      {t('contact:info.phone.title')}
                    </h3>
                    <a 
                      href="tel:+436605358688"
                      className="text-neutral-ink/70 dark:text-dark-text/70 hover:text-primary-cobalt dark:hover:text-[#f3ff5a] transition-colors focus-ring rounded"
                    >
                      +43 660 535 8688
                    </a>
                  </div>
                </div>
                
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Company */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-neutral-stroke dark:border-dark-stroke'
                      }`}
                      placeholder={t('contact:form.namePlaceholder')}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.company')} *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent ${
                        errors.company ? 'border-red-500' : 'border-neutral-stroke dark:border-dark-stroke'
                      }`}
                      placeholder={t('contact:form.companyPlaceholder')}
                    />
                    {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                  </div>
                </div>

                {/* Email and Role */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-neutral-stroke dark:border-dark-stroke'
                      }`}
                      placeholder={t('contact:form.emailPlaceholder')}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.role')}
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-stroke dark:border-dark-stroke rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent"
                      placeholder={t('contact:form.rolePlaceholder')}
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                    {t('contact:form.website')}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-stroke dark:border-dark-stroke rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent"
                    placeholder={t('contact:form.websitePlaceholder')}
                  />
                </div>

                {/* Company Size and Budget */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.companySize')}
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-stroke dark:border-dark-stroke rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text focus:ring-2 focus:ring-primary-cobalt focus:border-transparent"
                    >
                      <option value="">{t('contact:form.companySizePlaceholder')}</option>
                      <option value="1-10">{t('contact:form.companySizeOptions.small')}</option>
                      <option value="11-50">{t('contact:form.companySizeOptions.medium')}</option>
                      <option value="51-200">{t('contact:form.companySizeOptions.large')}</option>
                      <option value="201-1000">{t('contact:form.companySizeOptions.enterprise')}</option>
                      <option value="1000+">{t('contact:form.companySizeOptions.corporation')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('contact:form.budget')}
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-stroke dark:border-dark-stroke rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text focus:ring-2 focus:ring-primary-cobalt focus:border-transparent"
                    >
                      <option value="">{t('contact:form.budgetPlaceholder')}</option>
                      <option value="under-10k">{t('contact:form.budgetOptions.small')}</option>
                      <option value="10k-50k">{t('contact:form.budgetOptions.medium')}</option>
                      <option value="50k-100k">{t('contact:form.budgetOptions.large')}</option>
                      <option value="100k+">{t('contact:form.budgetOptions.enterprise')}</option>
                    </select>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-3">
                    {t('contact:form.interests')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['aiAgents', 'rag', 'workflowAutomation', 'apiIntegrations', 'selfHostedAI'].map((interest) => (
                      <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="w-4 h-4 text-primary-cobalt border-neutral-stroke dark:border-dark-stroke rounded focus:ring-primary-cobalt focus:ring-2"
                        />
                        <span className="text-sm text-neutral-ink dark:text-dark-text">
                          {t(`contact:form.interestOptions.${interest}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-ink dark:text-dark-text mb-2">
                    {t('contact:form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-dark-surface text-neutral-ink dark:text-dark-text placeholder-neutral-ink/50 dark:placeholder-dark-text/50 focus:ring-2 focus:ring-primary-cobalt focus:border-transparent resize-vertical ${
                      errors.message ? 'border-red-500' : 'border-neutral-stroke dark:border-dark-stroke'
                    }`}
                    placeholder={t('contact:form.messagePlaceholder')}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* Consent Checkbox */}
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className={`w-4 h-4 text-primary-cobalt border rounded focus:ring-primary-cobalt focus:ring-2 mt-1 ${
                        errors.consent ? 'border-red-500' : 'border-neutral-stroke dark:border-dark-stroke'
                      }`}
                    />
                    <span className="text-sm text-neutral-ink dark:text-dark-text">
                      {t('contact:form.consent')} *
                    </span>
                  </label>
                  {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('contact:form.submitting')}
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt className="w-5 h-5 mr-2" />
                      {t('contact:form.submit')}
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
