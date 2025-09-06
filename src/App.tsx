import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Impressum } from './pages/Impressum';
import { Privacy } from './pages/Privacy';
import './lib/i18n';

// Language wrapper component to handle route-based language detection
function LanguageWrapper({ children, lang }: { children: React.ReactNode; lang?: string }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set language based on URL path or prop
    if (lang && ['en', 'de'].includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (location.pathname.startsWith('/de')) {
      i18n.changeLanguage('de');
    } else {
      i18n.changeLanguage('en');
    }
  }, [lang, location.pathname, i18n]);

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <Router>
        <Routes>
          {/* English routes */}
          <Route path="/" element={<LanguageWrapper><Home /></LanguageWrapper>} />
          <Route path="/about" element={<LanguageWrapper><About /></LanguageWrapper>} />
          <Route path="/contact" element={<LanguageWrapper><Contact /></LanguageWrapper>} />
          <Route path="/impressum" element={<LanguageWrapper><Impressum /></LanguageWrapper>} />
          <Route path="/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
          
          {/* German routes */}
          <Route path="/de" element={<LanguageWrapper lang="de"><Home /></LanguageWrapper>} />
          <Route path="/de/uber-uns" element={<LanguageWrapper lang="de"><About /></LanguageWrapper>} />
          <Route path="/de/kontakt" element={<LanguageWrapper lang="de"><Contact /></LanguageWrapper>} />
          <Route path="/de/impressum" element={<LanguageWrapper lang="de"><Impressum /></LanguageWrapper>} />
          <Route path="/de/datenschutz" element={<LanguageWrapper lang="de"><Privacy /></LanguageWrapper>} />
          
          {/* Redirect old German about route */}
          <Route path="/de/about" element={<Navigate to="/de/uber-uns" replace />} />
          <Route path="/de/contact" element={<Navigate to="/de/kontakt" replace />} />
          <Route path="/de/privacy" element={<Navigate to="/de/datenschutz" replace />} />
        </Routes>
      </Router>
  );
}

export default App;
