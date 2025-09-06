import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function SEO({ 
  title, 
  description, 
  keywords,
  image = '/og-image.jpg',
  type = 'website',
  noIndex = false 
}: SEOProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const currentLang = i18n.language;
  const isGerman = currentLang === 'de';
  
  const siteUrl = 'https://automationaffairs.com';
  const currentUrl = `${siteUrl}${location.pathname}`;
  
  const defaultTitle = t('common:seo.defaultTitle');
  const defaultDescription = t('common:seo.defaultDescription');
  const defaultKeywords = t('common:seo.defaultKeywords');
  
  const finalTitle = title ? `${title} | ${t('common:seo.siteName')}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Automation Affairs",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": finalDescription,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE",
      "addressLocality": "Berlin"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-123-456-789",
      "contactType": "customer service",
      "email": "hello@automationaffairs.com"
    },
    "sameAs": [
      "https://linkedin.com/company/automation-affairs",
      "https://youtube.com/@automation-affairs"
    ]
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('common:nav.home'),
        "item": siteUrl
      }
    ]
  };

  // Add current page to breadcrumb if not home
  if (location.pathname !== '/' && location.pathname !== '/de') {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === 'about' || lastSegment === 'uber-uns') {
      breadcrumbStructuredData.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": t('common:nav.about'),
        "item": currentUrl
      });
    } else if (lastSegment === 'contact' || lastSegment === 'kontakt') {
      breadcrumbStructuredData.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": t('common:nav.contact'),
        "item": currentUrl
      });
    }
  }

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel: string, href: string, hrefLang?: string) => {
      const selector = hrefLang ? `link[rel="${rel}"][hreflang="${hrefLang}"]` : `link[rel="${rel}"]`;
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (hrefLang) {
          link.setAttribute('hreflang', hrefLang);
        }
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', 'Automation Affairs');
    
    // Language and locale
    document.documentElement.setAttribute('lang', currentLang);
    updateMetaTag('og:locale', isGerman ? 'de_DE' : 'en_US', true);
    
    // Canonical URL
    updateLinkTag('canonical', currentUrl);
    
    // Alternate language URLs
    updateLinkTag('alternate', siteUrl + location.pathname.replace('/de', ''), 'en');
    updateLinkTag('alternate', siteUrl + '/de' + location.pathname.replace('/de', ''), 'de');
    updateLinkTag('alternate', siteUrl + location.pathname.replace('/de', ''), 'x-default');
    
    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', `${siteUrl}${image}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', 'Automation Affairs', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', `${siteUrl}${image}`);
    
    // Robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }
    
    // Structured data
    const updateStructuredData = (id: string, data: object) => {
      let script = document.querySelector(`script[data-id="${id}"]`) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-id', id);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };
    
    updateStructuredData('organization', structuredData);
    updateStructuredData('breadcrumb', breadcrumbStructuredData);
    
  }, [finalTitle, finalDescription, finalKeywords, currentLang, isGerman, currentUrl, siteUrl, location.pathname, image, type, noIndex, structuredData, breadcrumbStructuredData]);

  return null;
}
