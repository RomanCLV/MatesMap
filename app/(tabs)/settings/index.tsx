// app/(tabs)/settings/index.tsx
import React from "react";
import { StyleSheet, ScrollView, View, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "@context/LanguageContext";
import { useAppTheme } from "@context/ThemeContext";
import { useT } from "@i18n/useT";
import { useSafeNavigation } from "@hooks/useSafeNavigation";
import SafeTopAreaThemedView from "@themedComponents/SafeTopAreaThemedView";
import ThemedText from "@themedComponents/ThemedText";
import SettingsSection from "@components/settings/SettingsSection";
import SettingsItem from "@components/settings/SettingsItem";
import Spacer from "@components/Spacer";
import TitlePage from "@components/TitlePage";

export default function SettingsScreen() {
  const { navigate } = useSafeNavigation();
  const {theme, themePreference} = useAppTheme();
  const {language} = useLanguage();
  const t = useT();

  const handleContactPress = () => {
    Linking.openURL("mailto:roman.clavier.2001@gmail.com");
  };

  return (
    <SafeTopAreaThemedView style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background.primary }]}>
        <TitlePage title={t("settings.title")} />
        <Spacer height={24}/>

        {/* Section Préférences */}
        <SettingsSection title={t("settings.preferences.title").toUpperCase()}>
          <SettingsItem
            icon={({color, size}) => <Ionicons name="contrast-outline" color={color} size={size} />}
            label={t("settings.preferences.theme")}
            rightElement="value"
            value={t(`settings_theme.${themePreference}`)}
            onPress={navigate("settings/theme")}
          />
          <SettingsItem
            icon={({color, size}) => <Ionicons name="language-outline" color={color} size={size} />}
            label={t("settings.preferences.language")}
            rightElement="value"
            value={t(`settings_language.${language}`)}
            onPress={navigate("settings/language")}
          />
        </SettingsSection>
        <Spacer height={20}/>

        {/* Section Aide & Support */}
        <SettingsSection title={t("settings.help.title").toUpperCase()}>
          <SettingsItem
            icon={({color, size}) => <Ionicons name="chatbubble-outline" color={color} size={size} />}
            label={t("settings.help.contactUs")}
            rightElement="chevron"
            onPress={handleContactPress}
          />
        </SettingsSection>

        {/* Version */}
        <View style={styles.versionContainer}>
          <ThemedText variant="tertiary" style={styles.versionText}>
            {t("settings.version", { version: "1.0.0" })}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeTopAreaThemedView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
  },
});
