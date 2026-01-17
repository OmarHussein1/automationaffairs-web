import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieConsent } from '../CookieConsent';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  fullpage?: boolean;
}

export function Layout({ children, fullpage = false }: LayoutProps) {

  return (
    <div className={cn(
      "flex flex-col bg-neutral-bg dark:bg-dark-bg",
      fullpage
        ? "h-screen overflow-hidden"
        : "min-h-screen"
    )}>

      <Header />

      <main className={cn(
        "flex-1",
        fullpage && "overflow-hidden"
      )}>
        {children}
      </main>

      {!fullpage && <Footer />}
      <CookieConsent />
    </div>
  );
}
