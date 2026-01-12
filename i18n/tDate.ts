
import { useCurrentLanguage } from "@hooks/useCurrentLanguage";
import { parseDate } from "./parseDate";

export type tDateType = Date | string | number;

export const tDate = (
  input: tDateType,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = parseDate(input);
  if (!date) return "Invalid date";

  const lang = useCurrentLanguage();
  return new Intl.DateTimeFormat(lang, options).format(date);
};

tDate.full = (input: tDateType) => tDate(input, { dateStyle: "full" });
tDate.long = (input: tDateType) => tDate(input, { dateStyle: "long" });
tDate.medium = (input: tDateType) => tDate(input, { dateStyle: "medium" });
tDate.short = (input: tDateType) => tDate(input, { dateStyle: "short" });

tDate.weekday = (input: tDateType) => tDate(input, { weekday: "long", day: "numeric", month: "long" });

tDate.shortWeekday = (input: tDateType) => tDate(input, { weekday: "short", day: "numeric", month: "short" });
