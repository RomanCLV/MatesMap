import React, { useMemo, useState } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { DatePicker } from "@quidone/react-native-wheel-picker";
import { FontAwesome } from "@expo/vector-icons";
import * as Localization from "expo-localization";

import { useCurrentLanguage } from "@hooks/useCurrentLanguage";
import { useTheme } from "@hooks/useTheme";
import { DEFAULT_LANGUAGE_TAG, LOCALE_MAP } from "@i18n/types";
import ThemedBottomSheetModal from "@themedComponents/ThemedBottomSheetModal";
import ThemedText from "./ThemedText";

// Helpers YYYY-MM-DD - CORRIGÉ pour gérer les fuseaux horaires
const toOnlyDateFormat = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromOnlyDateFormat = (s: string): Date => {
  // Parse manuel pour éviter les problèmes de timezone
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Midi pour éviter les changements de jour
};

// Comparer seulement les dates (année/mois/jour) sans l'heure
const isBeforeDay = (date1: Date, date2: Date): boolean => {
  return toOnlyDateFormat(date1) < toOnlyDateFormat(date2);
};

const isAfterDay = (date1: Date, date2: Date): boolean => {
  return toOnlyDateFormat(date1) > toOnlyDateFormat(date2);
};

const isDateValid = (
  date: string,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  const d = fromOnlyDateFormat(date);
  if (minDate && isBeforeDay(d, minDate)) return false;
  if (maxDate && isAfterDay(d, maxDate)) return false;
  return true;
};

export interface ThemedDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  modalTitle?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function ThemedDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Sélectionner une date",
  modalTitle = "Sélectionner une date",
  style,
  headerStyle,
  contentStyle,
}: ThemedDatePickerProps) {
  // ---------- Hooks ----------
  const theme = useTheme();
  
  const currentLang = useCurrentLanguage(); // "fr", "en", etc.
  const userLocale = 
    (currentLang ? LOCALE_MAP[currentLang] : null) ?? 
    Localization.getLocales()[0]?.languageTag ?? 
    DEFAULT_LANGUAGE_TAG; // ex: "fr-FR"

  const [visible, setVisible] = useState(false);

  // État temporaire du modal (YYYY-MM-DD)
  const [tempDate, setTempDate] = useState<string>(toOnlyDateFormat(value ?? new Date()));

  // ---------- Derived state ----------
  const canConfirm = useMemo(() => isDateValid(tempDate, minDate, maxDate), [tempDate, minDate, maxDate]);

  // ---------- Handlers ----------
  const openModal = () => {
    const initial = toOnlyDateFormat(value ?? new Date());
    setTempDate(initial);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const confirm = () => {
    if (!canConfirm) return;
    onChange(fromOnlyDateFormat(tempDate));
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        style={[
          styles.selector,
          {
            borderColor: theme.border.light,
            backgroundColor: theme.background.surface,
          },
          style,
        ]}
      >
        <ThemedText
          style={[
            styles.text,
            !value && { color: theme.text.tertiary },
          ]}
        >
          {value ? value.toLocaleDateString(userLocale) : placeholder}
        </ThemedText>

        <FontAwesome name="angle-down" color={theme.text.tertiary} size={20} />
      </TouchableOpacity>

      <ThemedBottomSheetModal
        visible={visible}
        onClose={() => setVisible(false)}
        height={300}
        header={{
          title: modalTitle,
          canConfirm: canConfirm,
          onCancel: closeModal,
          onConfirm: confirm,
        }}
        headerStyle={headerStyle}
        contentStyle={contentStyle}
      >
        <DatePicker
          date={tempDate}
          onDateChanged={({ date }) => setTempDate(date)}
          locale={userLocale}
          //minDate={minDate ? toOnlyDateFormat(minDate) : undefined}
          //maxDate={maxDate ? toOnlyDateFormat(maxDate) : undefined}
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
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});
