'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';

type TranslationKey = keyof (typeof translations)['zh'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    window.localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey, ...args: any[]): string => {
    const translation = translations[language][key];
    if (typeof translation === 'function') {
      return (translation as (...args: any[]) => string)(...args);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
