// components/themedComponents/ThemedPicker.tsx
import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { FontAwesome } from "@expo/vector-icons";

import { useTheme } from "@hooks/useTheme";
import ThemedText from "@themedComponents/ThemedText";
import ThemedBottomSheetModal from "@themedComponents/ThemedBottomSheetModal";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";

export interface PickerItem {
  label: string;
  value: any;
}

interface ThemedPickerProps {
  items: PickerItem[];
  selectedValue: any;
  onValueChange: (value: any) => void;
  modalTitle?: string;
  placeholder?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function ThemedPicker({
  items,
  selectedValue,
  onValueChange,
  modalTitle = "Sélectionner",
  placeholder = "Sélectionner",
  style,
  headerStyle,
  contentStyle,
}: ThemedPickerProps) {
  const theme = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(selectedValue);
  useEffect(() => setTempValue(selectedValue), [selectedValue]);
  const selectedItem = items.find((i) => i.value === selectedValue);
  
  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.selector,
          {
            backgroundColor: theme.background.surface,
            borderColor: theme.border.light,
          },
          style,
        ]}
      >
        <ThemedText
          style={[
            styles.selectedText,
            !selectedItem && { color: theme.text.tertiary },
          ]}
        >
          {selectedItem ? (selectedItem.label.length > 2 ? capitalizeFirstLetter(selectedItem.label) : selectedItem.label) : placeholder}
        </ThemedText>
        <FontAwesome name="angle-down" color={theme.text.tertiary} size={20} />
      </TouchableOpacity>

      <ThemedBottomSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        height={300}
        header={{
          title: modalTitle,
          onCancel: () => {
            setTempValue(selectedValue);
            setModalVisible(false);
          },
          onConfirm: () => {
            onValueChange(tempValue);
            setModalVisible(false);
          },
        }}
        headerStyle={headerStyle}
        contentStyle={contentStyle}
      >
        <WheelPicker
          data={items}
          value={tempValue}
          onValueChanged={({item}: any) => setTempValue(item.value)}
          itemHeight={48}
          visibleItemCount={5}
          itemTextStyle={{ color: theme.text.primary, fontSize: 18 }}
        />
      </ThemedBottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
});
