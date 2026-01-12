// app/(tabs)/settings/language.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

import { useT } from "@i18n/useT";
import { LANGUAGE_CODES, LANGUAGE_FLAGS, LanguageCode } from "@i18n/types";
import { useLanguage } from "@context/LanguageContext";
import SafeTopAreaThemedView from "@themedComponents/SafeTopAreaThemedView";
import ThemedText from "@themedComponents/ThemedText";
import SelectionList from "@components/settings/SelectionList";
import BackHeader from "@components/headers/BackHeader";
import Spacer from "@components/Spacer";
import ThemedView from "@components/themedComponents/ThemedView";

export default function LanguageSettingsScreen() {
  const {language, setLanguage} = useLanguage();
  const t = useT();

  const languagesOptions = LANGUAGE_CODES.map((langCode) => ({
    value: langCode,
    label: t(`settings_language.${langCode}`),
    leftContent: (
      <ThemedText style={{fontSize: 24}}>
        {LANGUAGE_FLAGS[langCode]}
      </ThemedText>
    ),
  }));

  const _handleOnSelect = async (lang: LanguageCode) => {
    setLanguage(lang);
  }

  return (
    <SafeTopAreaThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <BackHeader title={t("settings_language.title")} />
        <Spacer height={24}/>
        
        <SelectionList
          options={languagesOptions}
          selectedValue={language}
          onSelect={_handleOnSelect}
          showSelectedIcon={false}
        />

        <View style={styles.infoContainer}>
          <ThemedText variant="secondary" style={styles.infoText}>
            {t("settings_language.description")}
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
  infoContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
