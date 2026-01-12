// components/themedComponents/ThemedModal.tsx
import React from "react";
import { Modal, StyleSheet, Pressable, View } from "react-native";

import { useTheme } from "@hooks/useTheme";
import { useT } from "@i18n/useT";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";

type ThemedModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: "info" | "error" | "warning";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
};

export default function ThemedModal({
  visible,
  onClose,
  title,
  description,
  type = "info",
  confirmText,
  cancelText,
  onConfirm,
  showCancel = false,
}: ThemedModalProps) {
  const theme = useTheme();
  const t = useT();

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const getButtonVariant = () => {
    switch (type) {
      case "error":
        return "error";
      case "warning":
        return "accent";
      default:
        return "primary";
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: theme.background.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText variant="primary" style={styles.title}>
            {title}
          </ThemedText>

          {description && (
            <ThemedText variant="secondary" style={styles.description}>
              {description}
            </ThemedText>
          )}

          <View style={styles.buttons}>
            {showCancel && (
              <ThemedButton
                variant="ghost"
                onPress={onClose}
              >
                {cancelText || t("global.cancel")}
              </ThemedButton>
            )}
            <ThemedButton
              variant={getButtonVariant()}
              onPress={handleConfirm}
            >
              {confirmText || t("global.ok")}
            </ThemedButton>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    padding: 24,
    borderRadius: 20,
    width: "85%",
    maxWidth: 400,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
});
