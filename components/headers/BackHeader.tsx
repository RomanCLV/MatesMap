// components/settings/SettingsHeader.tsx
import React from "react";
import { ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@hooks/useTheme";
import { useSafeNavigation } from "@hooks/useSafeNavigation";
import GenericHeader from "./GenericHeader";
import HeaderButton from "./HeaderButton";

type BackHeaderProps = {
  title: string;
  showBack?: boolean;
  style?: ViewStyle;
};

const BackHeader: React.FC<BackHeaderProps> = ({ 
  title, 
  showBack = true,
  style
}) => {
  const theme = useTheme();
  const { goBack } = useSafeNavigation();
  const backButton = showBack ? <HeaderButton icon={<Ionicons name="chevron-back" size={24} color={theme.text.primary} />} onPress={goBack()} /> : null;
  return <GenericHeader title={title} leftButton={backButton} style={style} />
};

export default BackHeader;
