import React, { useState } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@hooks/useTheme";

interface ThemedTextInputProps extends Omit<TextInputProps, "onChange"> {
  value: string;
  onChangeText: (text: string) => void;
  type?: "text" | "number";
}

export default function ThemedTextInput({
  value,
  onChangeText,
  type = "text",
  style,
  ...props
}: ThemedTextInputProps) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  const handleChangeText = (text: string) => {
    setHasError(false);
    
    if (type === "number") {
      // Accepte vide, nombres entiers et décimaux en cours de saisie
      if (text === "" || text === "." || /^\d*\.?\d*$/.test(text)) {
        onChangeText(text);
      }
    } else {
      onChangeText(text);
    }
  };

  const handleBlur = () => {
    if (type === "number" && value !== "") {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        setHasError(true);
        // Optionnel : réinitialiser à une valeur par défaut
        onChangeText("");
      } 
      else if (value.endsWith(".")) {
        // Nettoie le point final
        onChangeText(value.slice(0, -1));
      }
    }
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      keyboardType={type === "number" ? "numeric" : "default"}
      style={[
        styles.input,
        {
          backgroundColor: theme.background.secondary,
          borderColor: hasError ? theme.brand.error : theme.border.light,
          color: theme.text.primary,
        },
        style,
      ]}
      placeholderTextColor={theme.text.tertiary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});
