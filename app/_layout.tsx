// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useAppTheme } from "@context/ThemeContext";
import { LanguageProvider } from "@context/LanguageContext";

const RootLayoutContent = () => {
  const { theme } = useAppTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Slot /> 
    </>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RootLayoutContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
