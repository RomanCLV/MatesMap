import React, { useRef } from "react";
import {
  Pressable,
  PressableProps,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Animated,
  StyleProp
} from "react-native";
import { useTheme } from "@hooks/useTheme";

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "error";
type ButtonSize = "small" | "medium" | "large";
type TextAlignment = "center" | "left" | "right";

type ThemedButtonProps = Omit<PressableProps, "children" | "style"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  alignment?: TextAlignment;
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** Active l'animation de scale au press (défaut: true) */
  animateScale?: boolean;
  /** Active l'animation d'opacité au press (défaut: true) */
  animateOpacity?: boolean;
  /** Valeur du scale en état pressé (défaut: 0.95) */
  pressedScale?: number;
  /** Valeur de l'opacité en état pressé (défaut: 0.85) */
  pressedOpacity?: number;

  containerStyle?: StyleProp<ViewStyle>; // layout (flex, margin, width)
  buttonStyle?: StyleProp<ViewStyle>;    // visuel (background, border)
  textStyle?: StyleProp<TextStyle>;

  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({
  variant = "primary",
  size = "medium",
  alignment = "center",
  loading = false,
  disabled = false,
  containerStyle,
  buttonStyle,
  textStyle,
  icon,
  children,
  animateScale = true,
  animateOpacity = true,
  pressedScale = 0.97,
  pressedOpacity = 0.85,
  numberOfLines,
  ellipsizeMode,
  ...props
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Styles selon la variante
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    if (disabled) {
      return {
        container: {
          backgroundColor: theme.button.disabled.background,
        },
        text: {
          color: theme.button.disabled.text,
        },
      };
    }

    switch (variant) {
      case "primary":
        return {
          container: {
            backgroundColor: theme.button.primary.background,
          },
          text: {
            color: theme.button.primary.text,
          },
        };

      case "secondary":
        return {
          container: {
            backgroundColor: theme.button.secondary.background,
          },
          text: {
            color: theme.button.secondary.text,
          },
        };

      case "accent":
        return {
          container: {
            backgroundColor: theme.button.accent.background,
          },
          text: {
            color: theme.button.accent.text,
          },
        };

      case "error":
        return {
          container: {
            backgroundColor: theme.button.error.background,
          },
          text: {
            color: theme.button.error.text,
          },
        };

      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: theme.brand.primary,
          },
          text: {
            color: theme.brand.primary,
          },
        };

      case "ghost":
        return {
          container: {
            backgroundColor: "transparent",
          },
          text: {
            color: theme.text.primary,
          },
        };

      default:
        return {
          container: {
            backgroundColor: theme.button.primary.background,
          },
          text: {
            color: theme.button.primary.text,
          },
        };
    }
  };

  // Styles selon la taille
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case "small":
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 16,
          },
          text: {
            fontSize: 14,
          },
        };

      case "medium":
        return {
          container: {
            paddingVertical: 12,
            paddingHorizontal: 24,
          },
          text: {
            fontSize: 16,
          },
        };

      case "large":
        return {
          container: {
            paddingVertical: 16,
            paddingHorizontal: 32,
          },
          text: {
            fontSize: 18,
          },
        };
    }
  };

  // Styles selon l'alignement du texte
  const getAlignmentStyle = (): ViewStyle => {
    switch (alignment) {
      case "left":
        return { justifyContent: "flex-start" };
      case "right":
        return { justifyContent: "flex-end" };
      case "center":
      default:
        return { justifyContent: "center" };
    }
  };

  const handlePressIn = () => {
    if (disabled || loading) return;

    const animations = [];
    
    if (animateScale) {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: pressedScale,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        })
      );
    }
    
    if (animateOpacity) {
      animations.push(
        Animated.timing(opacityAnim, {
          toValue: pressedOpacity,
          duration: 100,
          useNativeDriver: true,
        })
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    const animations = [];
    
    if (animateScale) {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        })
      );
    }
    
    if (animateOpacity) {
      animations.push(
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const alignmentStyle = getAlignmentStyle();

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={containerStyle}
    >
      <Animated.View
        style={[
          styles.button,
          variantStyles.container,
          sizeStyles.container,
          (disabled || loading) && [styles.disabled, (variant === "ghost" && styles.disabledGhost)],
          buttonStyle,
          {
            transform: animateScale ? [{ scale: scaleAnim }] : undefined,
            opacity: animateOpacity ? opacityAnim : undefined,
          },
        ]}
      >
        <View style={[styles.content, alignmentStyle]}>
          {loading ? (
            <ActivityIndicator color={variantStyles.text.color} size="small" />
          ) : (
            <>
              {icon}
              <Text
                style={[
                  variantStyles.text,
                  sizeStyles.text,
                  textStyle,
                ]}
                numberOfLines={numberOfLines}
                ellipsizeMode={ellipsizeMode}
              >
                {children}
              </Text>
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledGhost: {
    backgroundColor: "transparent"
  },
});

export default ThemedButton;
