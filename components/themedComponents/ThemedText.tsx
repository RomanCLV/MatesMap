import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";
import { useTheme } from "@hooks/useTheme";

type TextVariant = 
  | "primary"      // Texte principal (défaut)
  | "secondary"    // Texte secondaire
  | "tertiary"     // Métadonnées, timestamps
  | "disabled"     // États désactivés
  | "onBrand"      // Sur boutons/badges colorés
  | "inverse"      // Contraste maximal
  | "link"         // Liens cliquables
  | "error"        // Messages d'erreur
  | "success"      // Messages de succès
  | "warning";     // Avertissements

type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
};

const ThemedText: React.FC<ThemedTextProps> = ({ 
  variant = "primary", 
  style, 
  ...props 
}) => {
  const theme = useTheme();
  
  const getTextColor = (): string => {
    switch (variant) {
      case "primary":
        return theme.text.primary;
      case "secondary":
        return theme.text.secondary;
      case "tertiary":
        return theme.text.tertiary;
      case "disabled":
        return theme.text.disabled;
      case "onBrand":
        return theme.text.onBrand;
      case "inverse":
        return theme.text.inverse;
      case "link":
        return theme.text.link;
      case "error":
        return theme.text.error;
      case "success":
        return theme.text.success;
      case "warning":
        return theme.text.warning;
      default:
        return theme.text.primary;
    }
  };

  return (
    <Text
      {...props}
      style={[{ color: getTextColor() }, style]}
    />
  );
};

export default ThemedText;