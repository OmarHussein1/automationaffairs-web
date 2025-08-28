import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from '../CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg dark:bg-dark-bg">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        {t('a11y.skipToContent')}
      </a>
      
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      <CookieConsent />
    </div>
  );
}
