// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@hooks/useTheme";
import { useT } from "@i18n/useT";
import SettingsIcon from "@assets/icons/settings.svg";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const t = useT();
  
  return (
    <Tabs
      screenOptions={{
        sceneStyle: {backgroundColor: theme.background.primary },
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarActiveTintColor: theme.brand.secondary,
        tabBarStyle: { 
          backgroundColor: theme.background.secondary,
          borderTopWidth: 1,
          borderColor: theme.border.light + "10",
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}
      safeAreaInsets={{...insets, bottom: insets.bottom > 0 ? insets.bottom : 12 }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabBar.home"),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabBar.settings"),
          tabBarIcon: ({ color, size }) => <SettingsIcon width={size} height={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
