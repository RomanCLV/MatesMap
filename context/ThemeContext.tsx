import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import { Theme, Themes } from "../constants/colors";
import { useColorSchemeSafe } from "../hooks/useColorSchemeSafe";

const STORAGE_KEY = "theme-preference";

export type ThemePreference =  "system" | "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  themePreference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorSchemeSafe();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);

  const theme = Themes[preference === "system" ? systemScheme : preference];

  // Charger la préférence stockée au démarrage
  useEffect(() => {
    (async () => {
      const uiStyle = Constants.expoConfig?.userInterfaceStyle;
      let theme: string | null = null;

      if (uiStyle === "light" || uiStyle === "dark") {
        // 1. app.json impose le thème
        theme = uiStyle;
      } 
      else {
        // 2. automatic -> regarder la préférence utilisateur
        theme = await AsyncStorage.getItem(STORAGE_KEY);
        if (!theme) 
          theme = "system";
      }

      // 3. Validation et fallback
      if (theme !== "light" && theme !== "dark" && theme !== "system") 
        theme = "system";

      setPreferenceState(theme as ThemePreference);
      setIsReady(true);
      })();
  }, []);

  const setPreference = async (value: ThemePreference) => {
    if (value === preference) return;
    setPreferenceState(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  return isReady ? (
    <ThemeContext.Provider value={{ theme, themePreference: preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  ) : null;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useAppTheme must be used inside ThemeProvider");
  return context;
};
