import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;

  /** Styles optionnels sur le wrapper */
  style?: ViewStyle;

  /** Styles optionnels pour le label */
  labelStyle?: TextStyle;

  /** Styles optionnels pour la valeur */
  valueStyle?: TextStyle;
}

export default function InfoRow({
  label,
  value,
  style,
  labelStyle,
  valueStyle,
}: InfoRowProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ThemedText
        style={[
          styles.label,
          { color: theme.text.tertiary },
          labelStyle,
        ]}
      >
        {label}
      </ThemedText>

      <ThemedText
        style={[
          styles.value,
          { color: theme.text.primary },
          valueStyle,
        ]}
      >
        {value ?? "-"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
  },
});
