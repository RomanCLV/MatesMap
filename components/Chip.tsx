import React, { useRef } from "react";
import { StyleSheet, View, ViewStyle, Pressable, Animated } from "react-native";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";
import CloseIcon from "@icons/close.svg"

type ColorVariant = "primary" | "secondary" | "accent" | "error" | "highlight";
type IntensityVariant = "light" | "solid";

interface ChipProps {
  children: React.ReactNode;
  variant?: ColorVariant;
  intensity?: IntensityVariant;
  style?: ViewStyle;
  onPress?: () => void;
  onClose?: () => void;
  animateScale?: boolean;
  animateOpacity?: boolean;
  pressedScale?: number;
  pressedOpacity?: number;
}

export default function Chip({ 
  children, 
  variant = "primary", 
  intensity = "light",
  style,
  onPress,
  onClose,
  animateScale = true,
  animateOpacity = true,
  pressedScale = 0.97,
  pressedOpacity = 0.85,
  
}: ChipProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const getColors = () => {
    // Intensité "solid" : couleur pleine avec texte blanc
    if (intensity === "solid") {
      switch (variant) {
        case "primary":
          return {
            background: theme.brand.primary,
            text: theme.text.onBrand,
          };
        case "secondary":
          return {
            background: theme.brand.secondary,
            text: theme.text.onBrand,
          };
        case "accent":
          return {
            background: theme.brand.accent,
            text: theme.text.onBrand,
          };
        case "error":
          return {
            background: theme.brand.error,
            text: theme.text.onBrand,
          };
        case "highlight":
          return {
            background: theme.background.highlight,
            text: theme.text.primary,
          };
        default:
          return {
            background: theme.brand.primary,
            text: theme.text.onBrand,
          };
      }
    }

    // Intensité "light" : couleur transparente avec texte coloré
    switch (variant) {
      case "primary":
        return {
          background: theme.brand.primary + "15",
          text: theme.brand.primary,
        };
      case "secondary":
        return {
          background: theme.brand.secondary + "15",
          text: theme.brand.secondary,
        };
      case "accent":
        return {
          background: theme.brand.accent + "15",
          text: theme.brand.accent,
        };
      case "error":
        return {
          background: theme.brand.error + "15",
          text: theme.brand.error,
        };
      case "highlight":
        return {
          background: theme.isDark 
            ? theme.background.highlight + "40" 
            : theme.background.highlight + "60",
          text: theme.text.secondary,
        };
      default:
        return {
          background: theme.brand.primary + "15",
          text: theme.brand.primary,
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

  const content = (
    <Animated.View
      style={[
        styles.chip,
        { backgroundColor: colors.background },
        style,
        {
          transform: animateScale ? [{ scale: scaleAnim }] : undefined,
          opacity: animateOpacity ? opacityAnim : undefined,
        },
      ]}
    >
      <View style={styles.content}>
        {typeof children === "string" || typeof children === "number" ? (
          <ThemedText style={[styles.text, { color: colors.text }]}>
            {children}
          </ThemedText>
        ) : (
          children
        )}

        {onClose && (
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.85 : 1 }],
            })}
          >
            <CloseIcon width={16} height={16} color={colors.text} />
          </Pressable>
        )}
      </View>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
