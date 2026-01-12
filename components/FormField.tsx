import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";

interface FormFieldProps {
  label: string;
  icon?: (props: { color: string; size: number }) => React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle | [ViewStyle];
}

export default function FormField({ label, icon, children, style }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelContainer}>
        {icon && (
          <View style={styles.iconWrapper}>
            {icon({ color: theme.text.secondary, size: 18 })}
          </View>
        )}
        <ThemedText style={[styles.label, { color: theme.text.secondary }]}>
          {label}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrapper: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
