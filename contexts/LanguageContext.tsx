'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';

// This function runs once to determine the initial language.
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en'; // Default for SSR
  }

  // 1. Priority: Use language from localStorage if it exists and is valid.
  const storedLang = window.localStorage.getItem('language') as Language;
  if (storedLang && translations[storedLang]) {
    return storedLang;
  }

  // 2. Detect browser language and map it to a supported language.
  const browserLang = window.navigator.language;

  if (browserLang.startsWith('zh')) {
    if (browserLang.toLowerCase() === 'zh-tw' || browserLang.toLowerCase() === 'zh-hk') {
      return 'zh-TW';
    }
    return 'zh';
  }
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }
  if (browserLang.startsWith('ko')) {
    return 'ko';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  // 3. Fallback to English if no match is found.
  return 'en';
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en'); // Start with a non-null default
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setLanguage(getInitialLanguage());
    setIsMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, ...args: any[]): string => {
    const currentLangSet = translations[language] as { [key: string]: any };
    const fallbackLangSet = translations.en as { [key: string]: any };

    let translation = currentLangSet?.[key];

    if (translation === undefined) {
      translation = fallbackLangSet?.[key];
    }
    
    if (translation === undefined) {
      return key;
    }

    if (typeof translation === 'function') {
      return (translation as (...args: any[]) => string)(...args);
    }
    return String(translation);
  };

  if (!isMounted) {
    // On the server, and on the initial client render, return a blank screen.
    // This prevents the hydration mismatch.
    return <div className="min-h-screen bg-background" />;
  }

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
