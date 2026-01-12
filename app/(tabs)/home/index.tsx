import React from "react";
import { StyleSheet } from "react-native";

import { useT } from "@i18n/useT";
import ThemedText from "@themedComponents/ThemedText";
import ThemedView from "@themedComponents/ThemedView";

export default function index() {
  const t = useT();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        {t("home.title")}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
