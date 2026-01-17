import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';
import { useState, useEffect } from 'react';

export function Footer() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showCookieMessage, setShowCookieMessage] = useState(false);

  const currentLang = i18n.language;
  const isGerman = currentLang === 'de';

  const toggleLanguage = () => {
    const newLang = isGerman ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };

  const getLocalizedPath = (path: string) => {
    return isGerman ? `/de${path}` : path;
  };

  const handleCookieSettings = () => {
    setShowCookieMessage(true);
  };

  useEffect(() => {
    if (showCookieMessage) {
      const timer = setTimeout(() => {
        setShowCookieMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCookieMessage]);

  return (
    <footer className="bg-neutral-surface border-t border-neutral-ink/10 dark:bg-dark-surface dark:border-dark-text/10">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link 
              to={getLocalizedPath('/')}
              className="flex items-center space-x-3 focus-ring rounded-lg"
            >
              <img 
                src="/logo.svg" 
                alt="Automation Affairs Logo" 
                className="w-8 h-8 object-contain filter dark:invert"
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
              <div className="w-8 h-8 bg-primary rounded-lg items-center justify-center hidden">
                <span className="text-white font-heading text-sm font-bold">AA</span>
              </div>
              <span className="font-heading text-lg font-semibold text-neutral-ink dark:text-dark-text">
                AUTOMATION AFFAIRS
              </span>
            </Link>
            <p className="mt-4 text-neutral-ink-muted dark:text-dark-text/70 max-w-md">
              {t('footer.description')}
            </p>
            <div className="mt-6">
              <a 
                href={`mailto:${t('footer.email')}`}
                className="text-primary dark:text-[#f3ff5a] hover:text-primary/80 dark:hover:text-[#f3ff5a]/80 focus-ring rounded transition-colors"
              >
                {t('footer.email')}
              </a>
            </div>
          </div>

          {/* Legal & Settings */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-neutral-ink dark:text-dark-text uppercase tracking-wider">
              Legal & Settings
            </h3>
            <div className="mt-4 space-y-3">
              <Link
                to={getLocalizedPath('/impressum')}
                className="block text-sm text-neutral-ink-muted hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded"
              >
                {t('footer.legal.impressum')}
              </Link>
              <Link
                to={getLocalizedPath('/privacy')}
                className="block text-sm text-neutral-ink-muted hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded"
              >
                {t('footer.legal.privacy')}
              </Link>
              <button
                onClick={handleCookieSettings}
                className="block text-sm text-neutral-ink-muted hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded text-left"
              >
                {t('footer.legal.cookies')}
              </button>
            </div>

            {/* Theme & Language Toggles */}
            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center p-2 text-neutral-ink-muted hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
                aria-label={t('a11y.toggleLanguage')}
              >
                <Globe className="w-4 h-4" />
                <span className="ml-1 text-xs font-medium">
                  {isGerman ? 'EN' : 'DE'}
                </span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-ink-muted hover:text-neutral-ink dark:text-dark-text/70 dark:hover:text-dark-text transition-colors focus-ring rounded-lg"
                aria-label={t('a11y.toggleTheme')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-ink/10 dark:border-dark-text/10">
          <p className="text-sm text-neutral-ink-muted dark:text-dark-text/70 text-center">
            © {new Date().getFullYear()} Automation Affairs. All rights reserved.
          </p>
        </div>
      </div>

      {/* Cookie Message Popup */}
      {showCookieMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-dark-surface border border-neutral-stroke dark:border-dark-stroke rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
          <p className="text-sm text-neutral-ink dark:text-dark-text font-medium">
            Currently no Tracking is active
          </p>
        </div>
      )}
    </footer>
  );
}
