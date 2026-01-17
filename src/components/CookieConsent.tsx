import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gear, Check, Cookie } from '@phosphor-icons/react';
import { Button } from './ui/Button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  functional: false,
};

export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    
    // Set cookies based on preferences
    if (prefs.analytics) {
      // Enable analytics cookies (Google Analytics, etc.)
      console.log('Analytics cookies enabled');
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
    
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled');
    }
    
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    savePreferences(defaultPreferences);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface border-t border-neutral-stroke dark:border-dark-stroke shadow-lg"
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showDetails ? (
            // Simple banner view
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary-cobalt mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-neutral-ink dark:text-dark-text mb-2">
                    {t('common:cookies.title')}
                  </h3>
                  <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70 leading-relaxed">
                    {t('common:cookies.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="w-full sm:w-auto"
                >
                  <Gear className="w-4 h-4 mr-2" />
                  {t('common:cookies.customize')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessaryOnly}
                  className="w-full sm:w-auto"
                >
                  {t('common:cookies.necessary')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="w-full sm:w-auto"
                >
                  {t('common:cookies.acceptAll')}
                </Button>
              </div>
            </div>
          ) : (
            // Detailed preferences view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg text-neutral-ink dark:text-dark-text">
                  {t('common:cookies.preferences')}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-neutral-surface dark:hover:bg-dark-surface/50 rounded-lg transition-colors"
                  aria-label={t('common:a11y.closeMenu')}
                >
                  <X className="w-5 h-5 text-neutral-ink-muted dark:text-dark-text/70" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-neutral-surface dark:bg-dark-surface/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-neutral-ink dark:text-dark-text">
                        {t('common:cookies.categories.necessary.title')}
                      </h4>
                      <span className="text-xs bg-primary-cobalt/10 text-primary-cobalt px-2 py-1 rounded">
                        {t('common:cookies.required')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">
                      {t('common:cookies.categories.necessary.description')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-primary-cobalt rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-neutral-surface dark:bg-dark-surface/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('common:cookies.categories.analytics.title')}
                    </h4>
                    <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">
                      {t('common:cookies.categories.analytics.description')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics 
                          ? 'bg-primary-cobalt justify-end' 
                          : 'bg-neutral-stroke dark:bg-dark-stroke justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-neutral-surface dark:bg-dark-surface/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('common:cookies.categories.marketing.title')}
                    </h4>
                    <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">
                      {t('common:cookies.categories.marketing.description')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing 
                          ? 'bg-primary-cobalt justify-end' 
                          : 'bg-neutral-stroke dark:bg-dark-stroke justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between p-4 bg-neutral-surface dark:bg-dark-surface/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-ink dark:text-dark-text mb-2">
                      {t('common:cookies.categories.functional.title')}
                    </h4>
                    <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70">
                      {t('common:cookies.categories.functional.description')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => togglePreference('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.functional 
                          ? 'bg-primary-cobalt justify-end' 
                          : 'bg-neutral-stroke dark:bg-dark-stroke justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessaryOnly}
                  className="w-full sm:w-auto"
                >
                  {t('common:cookies.necessary')}
                </Button>
                <Button
                  size="sm"
                  onClick={saveCustomPreferences}
                  className="w-full sm:w-auto"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {t('common:cookies.savePreferences')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="w-full sm:w-auto"
                >
                  {t('common:cookies.acceptAll')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
