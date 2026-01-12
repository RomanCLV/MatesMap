// components/settings/SelectionList.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";
import ThemedButton from "@themedComponents/ThemedButton";

export type SelectionOption<T = string> = {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  leftContent?: React.ReactNode;
};

type SelectionListProps<T = string> = {
  options: SelectionOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  showSelectedIcon?: boolean
};

function SelectionList<T = string>({
  options,
  selectedValue,
  onSelect,
  showSelectedIcon = true
}: SelectionListProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <ThemedButton
            key={String(option.value)}
            variant={isSelected ? "primary" : "ghost"}
            alignment="left"
            onPress={() => onSelect(option.value)}
            buttonStyle={[styles.optionButton, !isSelected ? { backgroundColor: theme.background.card } : undefined]}
          >
            <View style={styles.optionContent}>
              {option.leftContent ? (
                option.leftContent
              ) : option.icon ? (
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={isSelected ? theme.button.primary.text : theme.text.primary}
                />
              ) : null}
              <ThemedText
                variant={isSelected ? "onBrand" : "primary"}
                style={styles.optionLabel}
              >
                {option.label}
              </ThemedText>
            {showSelectedIcon && isSelected && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={theme.button.primary.text}
              />
            )}
            </View>
          </ThemedButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  optionButton: {
    marginBottom: 0,
    borderRadius: 12,
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SelectionList;