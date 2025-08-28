import { Helmet } from 'react-helmet-async';
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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Automation Affairs" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Language and Locale */}
      <html lang={currentLang} />
      <meta property="og:locale" content={isGerman ? 'de_DE' : 'en_US'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Alternate Language URLs */}
      <link rel="alternate" hrefLang="en" href={siteUrl + location.pathname.replace('/de', '')} />
      <link rel="alternate" hrefLang="de" href={siteUrl + '/de' + location.pathname.replace('/de', '')} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl + location.pathname.replace('/de', '')} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Automation Affairs" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
}
