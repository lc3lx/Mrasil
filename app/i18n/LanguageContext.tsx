"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from './messages/en.json';
import arMessages from './messages/ar.json';

const I18N_CONFIG_KEY = 'selectedLang';

type Language = 'en' | 'ar';

interface LanguageContextType {
  selectedLang: Language;
  setLanguage: (lang: Language) => void;
  direction: 'ltr' | 'rtl';
}

const allMessages = {
  en: enMessages,
  ar: arMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  selectedLang: 'ar',
  setLanguage: () => {},
  direction: 'rtl',
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem(I18N_CONFIG_KEY) as Language || 'ar';
    setSelectedLang(savedLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(I18N_CONFIG_KEY, lang);
    setSelectedLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const direction = selectedLang === 'ar' ? 'rtl' : 'ltr';

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ selectedLang, setLanguage, direction }}>
      <IntlProvider
        messages={allMessages[selectedLang]}
        locale={selectedLang}
        defaultLocale="ar"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 