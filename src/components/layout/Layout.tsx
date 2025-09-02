import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from '../CookieConsent';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg dark:bg-dark-bg">
      
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      <CookieConsent />
    </div>
  );
}
