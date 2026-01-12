import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
//import { LocaleConfig } from "react-native-calendars";

import { DEFAULT_LANGUAGE_CODE, LANGUAGE_CODES, type LanguageCode } from "@i18n/types";

const STORAGE_KEY = "app-language";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const getDeviceLanguage = (): LanguageCode => {
  const locale = Localization.getLocales()?.[0]?.languageCode?.toLowerCase();
  return (locale && LANGUAGE_CODES.includes(locale as LanguageCode)) ? (locale as LanguageCode) : DEFAULT_LANGUAGE_CODE; // fallback
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getDeviceLanguage());
  const [isReady, setIsReady] = useState(false);

  // --- Load saved language ---
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGE_CODES.includes(saved as LanguageCode)) {
        setLanguage(saved as LanguageCode);
      }
      setIsReady(true);
    })();
  }, []);

  //useEffect(() => {
  //  // react-native-calendars attend une clé simple ("fr")
  //  LocaleConfig.defaultLocale = language;
  //}, [language]);

  // --- Change language ---
  const setLanguage = async (lang: LanguageCode) => {
    if (lang === language) return;
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  };

  return isReady ? (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  ) : null;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) 
    throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
