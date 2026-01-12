export const LANGUAGE_CODES = ["fr", "en"] as const;
//export const LANGUAGE_CODES = ["fr"] as const;
export type LanguageCode = typeof LANGUAGE_CODES[number];

export const DEFAULT_LANGUAGE_CODE = "en";
export const DEFAULT_LANGUAGE_TAG = "en-EN";

export const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
} as const;

export const LOCALE_MAP: Record<LanguageCode, string> = {
  fr: "fr-FR",
  en: "en-US",
} as const;

export type LanguageSet = {
  tabBar: {
    home: string,
    settings: string,
  },
  navigation: {
    back: string,
  },
  global: {
    confirm: string,
    cancel: string,
    delete: string,
    success: string,
    error: string,
    ok: string,
    select: string,
    close: string,
    chooseDate: string,
    selectDate: string,
    modifySchedule: string,
    deleteData: string,
  },
  itemSelection: {
    noSelection: string,
    nSelected: {
      one: string,
      other: string,
    }
  },
  hours: {
    hh: string,
    hhmm: string,
    hh2dmm: string,
  },
  calendar: {
    monthNames: {
      january: string,
      february: string,
      march: string,
      april: string,
      may: string,
      june: string,
      july: string,
      august: string,
      september: string,
      octember: string,
      november: string,
      december: string,
    },
    monthShortNames: {
      january: string,
      february: string,
      march: string,
      april: string,
      may: string,
      june: string,
      july: string,
      august: string,
      september: string,
      octember: string,
      november: string,
      december: string,
    },
    dayNames: {
      sunday: string,
      monday: string,
      tuesday: string,
      wednesday: string,
      thursday: string,
      friday: string,
      saturday: string,
    },
    dayShortNames: {
      sunday: string,
      monday: string,
      tuesday: string,
      wednesday: string,
      thursday: string,
      friday: string,
      saturday: string,
    },
    today: string,
  },
  home: {
    title: string,
  },
  settings: {
    title: string,
    preferences: {
      title: string,
      theme: string,
      language: string,
    },
    help: {
      title: string,
      contactUs: string,
    },
    version: string,
  },
  settings_theme: {
    title: string,
    system: string,
    light: string,
    dark: string,
    systemDescription: string,
    lightDescription: string,
    darkDescription: string,
  },
  settings_language: {
    title: string,
    description: string,
    fr: string,
    en: string,
  },
};
