import React, { useRef } from "react";
import { StyleSheet, ViewStyle, Pressable, Animated } from "react-native";
import { useTheme } from "@hooks/useTheme";

type ColorVariant = "primary" | "secondary" | "accent" | "error" | "highlight";
type IntensityVariant = "light" | "solid";

interface ChipIconProps {
  icon: (props: { color: string; size: number }) => React.ReactNode;
  variant?: ColorVariant;
  intensity?: IntensityVariant;
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
  animateScale?: boolean;
  animateOpacity?: boolean;
  pressedScale?: number;
  pressedOpacity?: number;
}

export default function ChipIcon({
  icon,
  variant = "primary",
  intensity = "light",
  size = 40,
  style,
  onPress,
  animateScale = true,
  animateOpacity = true,
  pressedScale = 0.97,
  pressedOpacity = 0.85,
}: ChipIconProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const getColors = () => {
    // Intensité "solid" : couleur pleine avec icône blanche
    if (intensity === "solid") {
      switch (variant) {
        case "primary":
          return {
            background: theme.brand.primary,
            icon: theme.text.onBrand,
          };
        case "secondary":
          return {
            background: theme.brand.secondary,
            icon: theme.text.onBrand,
          };
        case "accent":
          return {
            background: theme.brand.accent,
            icon: theme.text.onBrand,
          };
        case "error":
          return {
            background: theme.brand.error,
            icon: theme.text.onBrand,
          };
        case "highlight":
          return {
            background: theme.background.highlight,
            icon: theme.text.primary,
          };
        default:
          return {
            background: theme.brand.primary,
            icon: theme.text.onBrand,
          };
      }
    }

    // Intensité "light" : couleur transparente avec icône colorée
    switch (variant) {
      case "primary":
        return {
          background: theme.brand.primary + "15",
          icon: theme.brand.primary,
        };
      case "secondary":
        return {
          background: theme.brand.secondary + "15",
          icon: theme.brand.secondary,
        };
      case "accent":
        return {
          background: theme.brand.accent + "15",
          icon: theme.brand.accent,
        };
      case "error":
        return {
          background: theme.brand.error + "15",
          icon: theme.brand.error,
        };
      case "highlight":
        return {
          background: theme.isDark
            ? theme.background.highlight + "40"
            : theme.background.highlight + "60",
          icon: theme.text.secondary,
        };
      default:
        return {
          background: theme.brand.primary + "15",
          icon: theme.brand.primary,
        };
    }
  };

  const colors = getColors();

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.parallel([
      animateScale &&
        Animated.spring(scaleAnim, {
          toValue: pressedScale,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
      animateOpacity &&
        Animated.timing(opacityAnim, {
          toValue: pressedOpacity,
          duration: 100,
          useNativeDriver: true,
        }),
    ].filter(Boolean) as Animated.CompositeAnimation[]).start();
  };
  
  const handlePressOut = () => {
    if (!onPress) return;
    Animated.parallel([
      animateScale &&
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
      animateOpacity &&
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
    ].filter(Boolean) as Animated.CompositeAnimation[]).start();
  };

  const iconSize = size * 0.5; // L"icône fait 50% de la taille du cercle

  const content = (
    <Animated.View
      style={[
        styles.chip,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.background,
          transform: animateScale ? [{ scale: scaleAnim }] : undefined,
          opacity: animateOpacity ? opacityAnim : undefined,
        },
        style,
      ]}
    >
      {icon({ color: colors.icon, size: iconSize })}
    </Animated.View>
  );

  return onPress ? 
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {content}
    </Pressable>
  : content;
}

const styles = StyleSheet.create({
  chip: {
    justifyContent: "center",
    alignItems: "center",
  },
});
