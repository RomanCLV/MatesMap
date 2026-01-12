import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import * as Localization from "expo-localization";
import { FontAwesome } from "@expo/vector-icons";

import { useCurrentLanguage } from "@hooks/useCurrentLanguage";
import { useTheme } from "@hooks/useTheme";
import { DEFAULT_LANGUAGE_TAG, LOCALE_MAP } from "@i18n/types";
import ThemedBottomSheetModal from "@themedComponents/ThemedBottomSheetModal";
import ThemedText from "@themedComponents/ThemedText";
import {toDayKey, normalizeDate} from "utils/dateHelper"
import { getFirstDayOfWeek } from "@utils/calendarWeek";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type CalendarSelectionMode = "single" | "range";

export interface CalendarRange {
  startDate: Date;
  endDate: Date | null;
}

export type SinglePayload = {
    mode: "single",
    date: Date | null
}

export type RangePayload = {
    mode: "range",
    range: CalendarRange
}

export type OnChangePayload = SinglePayload | RangePayload;

export interface ThemedCalendarPickerProps {
  mode: CalendarSelectionMode;
  value?: Date | null;
  range?: CalendarRange;

  onChange: (payload: OnChangePayload) => void;

  minDate?: Date;
  maxDate?: Date;

  allowOpenEndedRange?: boolean;

  accentColor?: string;

  /** Labels */
  modalTitle?: string;
  fromLabel?: string;
  toLabel?: string;
  placeholder?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function ThemedCalendarPicker({
  mode,
  value,
  range,
  onChange,
  minDate,
  maxDate,
  allowOpenEndedRange = true,
  accentColor,
  modalTitle = "Choisir une date",
  fromLabel = "Du",
  toLabel = "Au",
  placeholder = "—",
}: ThemedCalendarPickerProps) {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [activeField, setActiveField] = useState<"start" | "end" | null>(null);

  const [tempRange, setTempRange] = useState<CalendarRange>({
    startDate: range?.startDate ?? normalizeDate(new Date()),
    endDate: range?.endDate ?? null,
  });
  
  const currentLang = useCurrentLanguage();
  const userLocale =
    (currentLang ? LOCALE_MAP[currentLang] : null) ??
    Localization.getLocales()[0]?.languageTag ??
    DEFAULT_LANGUAGE_TAG;
  const firstDay = getFirstDayOfWeek(userLocale);

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return toDayKey(a) === toDayKey(b);
  };

  const effectiveMode: CalendarSelectionMode =
    mode === "range" &&
    tempRange.startDate &&
    tempRange.endDate &&
    isSameDay(tempRange.startDate, tempRange.endDate) ? "single": mode;

  /* ------------------------------------------------------------------------ */
  /*                              MARKED DATES                                */
  /* ------------------------------------------------------------------------ */

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    const color = accentColor ?? theme.brand.primary;

    if (effectiveMode === "single") {
      const date =
        tempRange.startDate ??
        value ??
        null;

      if (!date)
        return marks;

      marks[toDayKey(date)] = {
        selected: true,
        selectedColor: color,
      };

      return marks;
    }

    if (mode === "range" && tempRange.startDate) {
      const startKey = toDayKey(tempRange.startDate);
      const endKey = tempRange.endDate
        ? toDayKey(tempRange.endDate)
        : null;

      marks[startKey] = {
        startingDay: true,
        color,
        textColor: theme.text.primary,
      };

      if (endKey) {
        let current = new Date(tempRange.startDate);
        current.setDate(current.getDate() + 1);

        while (toDayKey(current) < endKey) {
          marks[toDayKey(current)] = {
            color: color + "33",
            textColor: theme.text.primary,
          };
          current.setDate(current.getDate() + 1);
        }

        marks[endKey] = {
          endingDay: true,
          color,
          textColor: theme.text.primary,
        };
      }
    }

    return marks;
  }, [mode, value, tempRange, accentColor, theme]);

  /* ------------------------------------------------------------------------ */
  /*                              DAY HANDLER                                 */
  /* ------------------------------------------------------------------------ */

  const handleDayPress = (day: DateData) => {
    const date = normalizeDate(new Date(day.dateString));
    if (mode === "single") {
        onChange({ mode: "single", date });
        setVisible(false);
        return;
    }

    const { startDate, endDate } = tempRange;

    // ─────────────────────────────────────────────
    // ÉDITION DE LA DATE DE DÉBUT
    // ─────────────────────────────────────────────
    if (activeField === "start") {
        // si endDate existe et devient incohérente -> on la décale
        if (endDate && date > endDate) {
          setTempRange({
            startDate: date,
            endDate: date,
          });
        } 
        else {
          setTempRange({
              startDate: date,
              endDate,
          });
        }
        return;
    }

    // ─────────────────────────────────────────────
    // ÉDITION DE LA DATE DE FIN
    // ─────────────────────────────────────────────
    if (activeField === "end") {
        if (!startDate) {
          // sécurité : on pose les deux
          setTempRange({
              startDate: date,
              endDate: allowOpenEndedRange ? null : date,
            });
          return;
        }

        // si la date de fin passe avant le début -> on décale le début
        if (date < startDate) {
          setTempRange({
              startDate: date,
              endDate: date,
          });
        } 
        else {
          setTempRange({
              startDate,
              endDate: date,
          });
        }
    }
    };

  const confirm = () => {
    if (!tempRange.startDate) return;
    if (!tempRange.endDate && !allowOpenEndedRange) return;

    onChange({
      mode: "range",
      range: tempRange,
    });

    setVisible(false);
    setActiveField(null);
  };

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                   */
  /* ------------------------------------------------------------------------ */

  const renderInput = (
    label: string,
    date: Date | null,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.selector,
        {
          //borderColor: theme.border.light,
          borderColor: activeField === "start" ? theme.brand.primary : theme.border.light,
          backgroundColor: theme.background.surface,
        },
      ]}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText
        style={!date && { color: theme.text.tertiary }}
      >
        {date ? date.toLocaleDateString() : placeholder}
      </ThemedText>
      <FontAwesome name="angle-down" size={18} color={theme.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.row}>
        {renderInput(fromLabel, tempRange.startDate, () => {
          setActiveField("start");
          setVisible(true);
        })}

        {renderInput(toLabel, tempRange.endDate, () => {
          setActiveField("end");
          setVisible(true);
        })}
      </View>

      <ThemedBottomSheetModal
        visible={visible}
        onClose={() => setVisible(false)}
        height={480}
        header={{
          title: modalTitle,
          onCancel: () => setVisible(false),
          onConfirm: confirm,
        }}
      >
        <CalendarList
          firstDay={firstDay}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType={effectiveMode === "range" ? "period" : "dot"}
          allowSelectionOutOfRange={true}
          minDate={minDate ? toDayKey(minDate) : undefined}
          maxDate={maxDate ? toDayKey(maxDate) : undefined}
          pastScrollRange={12}
          futureScrollRange={12}
          theme={{
            calendarBackground: theme.background.surface,
            dayTextColor: theme.text.primary,
            monthTextColor: theme.text.primary,
            todayTextColor: theme.brand.primary,
            arrowColor: theme.text.primary,
          }}
        />
      </ThemedBottomSheetModal>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  selector: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    opacity: 0.7,
  },
});
