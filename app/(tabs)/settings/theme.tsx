// app/(tabs)/settings/theme.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

import { useT } from "@i18n/useT";
import { useAppTheme, ThemePreference } from "@context/ThemeContext";
import SafeTopAreaThemedView from "@themedComponents/SafeTopAreaThemedView";
import ThemedText from "@themedComponents/ThemedText";
import ThemedView from "@themedComponents/ThemedView";
import SelectionList, { SelectionOption } from "@components/settings/SelectionList";
import BackHeader from "@components/headers/BackHeader";
import Spacer from "@components/Spacer";

export default function ThemeSettingsScreen() {
  const { theme, themePreference, setPreference } = useAppTheme();
  const t = useT();

  const THEME_OPTIONS: SelectionOption<ThemePreference>[] = [
    { value: "system", label: t("settings_theme.system"), icon: "phone-portrait-outline" },
    { value: "light", label: t("settings_theme.light"), icon: "sunny-outline" },
    { value: "dark", label: t("settings_theme.dark"), icon: "moon-outline" },
  ];

  const getDescription = () => {
    switch (themePreference) {
      case "system":
        return t("settings_theme.systemDescription");
      case "light":
        return t("settings_theme.lightDescription");
      case "dark":
        return t("settings_theme.darkDescription");
    }
  };

  return (
    <SafeTopAreaThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <BackHeader title={t("settings_theme.title")} />
        <Spacer height={24}/>

        <SelectionList
          options={THEME_OPTIONS}
          selectedValue={themePreference}
          onSelect={setPreference}
          showSelectedIcon={false}
        />

        <View style={styles.descriptionContainer}>
          <ThemedText variant="secondary" style={styles.description}>
            {getDescription()}
          </ThemedText>
        </View>
      </ThemedView>
    </SafeTopAreaThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  descriptionContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
