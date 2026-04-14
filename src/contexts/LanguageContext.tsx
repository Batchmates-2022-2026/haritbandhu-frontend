import React, { createContext, useContext, useState, useEffect } from 'react';
import { LangCode, translations } from '@/data/translations';

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    return (localStorage.getItem('hb_lang') as LangCode) || 'en';
  });

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem('hb_lang', l);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};
