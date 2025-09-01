import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { translations, detectBrowserLanguage, formatString, Translations } from '@/lib/i18n';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  availableLanguages: Array<{ code: string; name: string }>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  // Initialize with browser language detection
  const [language, setLanguage] = useKV('taskflow-language', detectBrowserLanguage());

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  // Update HTML lang attribute and page title when language changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.lang = language;
    }
    
    // Update page title
    const appTitle = translations[language]?.appTitle || translations['en'].appTitle;
    const appSubtitle = translations[language]?.appSubtitle || translations['en'].appSubtitle;
    document.title = `${appTitle} - ${appSubtitle}`;
  }, [language]);

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    const translation = translations[language]?.[key] || translations['en'][key] || key as string;
    return params ? formatString(translation, params) : translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </I18nContext.Provider>
  );
};