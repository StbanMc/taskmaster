import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { translations, detectBrowserLanguage, formatString, Translations } from '@/lib/i18n';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  availableLanguages: Array<{ code: string; name: string }>;
  isLoaded: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: keyof Translations) => key as string,
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ],
  isLoaded: true
});

export const useI18n = () => {
  const context = useContext(I18nContext);
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  // Initialize with a safe default language
  const [language, setLanguageState] = useKV('taskflow-language', 'en');
  
  // Safe setter that always ensures a valid language
  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
    } else {
      console.warn(`Language '${lang}' not supported, falling back to English`);
      setLanguageState('en');
    }
  };
  
  // Initialize with browser language detection on first mount
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized) {
      try {
        const detectedLanguage = detectBrowserLanguage();
        if (detectedLanguage !== language) {
          setLanguage(detectedLanguage);
        }
      } catch (error) {
        console.warn('Failed to detect browser language, using default:', error);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, language, setLanguage]);

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  // Update HTML lang attribute and page title when language changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.lang = language || 'en';
    }
    
    // Update page title
    try {
      const currentLang = language && translations[language] ? language : 'en';
      const appTitle = translations[currentLang]?.appTitle || 'TaskFlow';
      const appSubtitle = translations[currentLang]?.appSubtitle || 'Organize your life, one task at a time';
      document.title = `${appTitle} - ${appSubtitle}`;
    } catch (error) {
      console.warn('Failed to update page title:', error);
    }
  }, [language]);

  const t = (key: keyof Translations, params?: Record<string, string | number>): string => {
    try {
      // Ensure language is valid and fallback to English
      const currentLanguage = language && translations[language] ? language : 'en';
      const translation = translations[currentLanguage]?.[key] || translations['en']?.[key] || key as string;
      return params ? formatString(translation, params) : translation;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key as string;
    }
  };

  // Always provide a valid context value
  const contextValue = {
    language: language || 'en',
    setLanguage,
    t,
    availableLanguages,
    isLoaded: hasInitialized
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};