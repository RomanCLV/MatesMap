// components/settings/SettingsItem.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";
import ThemedSwitch from "@themedComponents/ThemedSwitch";

type SettingsItemProps = {
  icon?: ((props: { color: string; size: number }) => React.ReactNode);
  label: string;
  onPress?: () => void;
  rightElement?: "chevron" | "switch" | "value" | "none";
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  value?: string;
};

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  label,
  onPress,
  rightElement = "none",
  switchValue,
  onSwitchChange,
  value,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.settingItem, { borderTopColor: theme.background.highlight }]}>
      <View style={styles.settingLeft}>
        {icon && icon({color: theme.text.secondary, size: 22})}
        
        <ThemedText variant="primary" style={styles.settingLabel}>
          {label}
        </ThemedText>
      </View>

      {rightElement === "switch" && <ThemedSwitch value={switchValue} onValueChange={onSwitchChange} /> }

      {rightElement === "value" && (
        <View style={styles.settingRight}>
          <ThemedText variant="tertiary" style={styles.settingValue}>
            {value}
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
        </View>
      )}

      {rightElement === "chevron" && (
        <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
});

export default SettingsItem;
