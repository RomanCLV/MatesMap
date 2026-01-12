// components/themedComponents/ThemedBottomSheetModal.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Pressable,
  Easing,
  Modal,
  Dimensions,
  ViewStyle,
} from "react-native";

import { useTheme } from "@hooks/useTheme";
import { useT } from "@i18n/useT";
import ThemedButton from "@themedComponents/ThemedButton";
import ThemedText from "@themedComponents/ThemedText";

interface ThemedBottomSheetHeaderProps {
  title?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  canConfirm?: boolean;
}

interface ThemedBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  header?: ThemedBottomSheetHeaderProps;
  children: React.ReactNode;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ThemedBottomSheetModal({
  visible,
  onClose,
  height = SCREEN_HEIGHT * 0.35,
  header,
  children,
  headerStyle,
  contentStyle,
}: ThemedBottomSheetModalProps) {
  const theme = useTheme();
  const translateY = useRef(new Animated.Value(height)).current;
  const canConfirm = header?.canConfirm ?? true;
  const t = useT();

  useEffect(() => {
    if (visible) {
      // Reset position before animating in
      translateY.setValue(height);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } 
    else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              height,
              transform: [{ translateY }],
              backgroundColor: theme.background.surface,
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[styles.handle, { backgroundColor: theme.border.light }]}
            />
          </View>

          {/* Header */}
          {header && (
            <View
              style={[
                styles.header,
                { borderBottomColor: theme.border.light },
                headerStyle,
              ]}
            >
              <View style={{ position: "absolute", width: "100%", alignItems: "center" }}>
                <ThemedText style={{ fontSize: 16, fontWeight: "600"}}>
                  {header.title ?? ""}
                </ThemedText>
              </View>

              <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
                <ThemedButton variant="ghost" onPress={header.onCancel}>
                  {header.cancelText ?? t("global.cancel")}
                </ThemedButton>

                <ThemedButton
                  variant="ghost"
                  onPress={canConfirm ? header.onConfirm : undefined}
                  disabled={!canConfirm}
                >
                  <ThemedText
                    style={{
                      color: canConfirm ? theme.brand.primary : theme.text.tertiary,
                      fontWeight: "600",
                    }}
                  >
                    {header.confirmText ?? t("global.ok")}
                  </ThemedText>
                </ThemedButton>
              </View>

            </View>
          )}

          {/* Content */}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  overlayTouchable: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  handleContainer: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  header: {
    height: 48,
    //paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});
