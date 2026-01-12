import { LanguageSet } from "../types";

const en: LanguageSet = {
  tabBar: {
    home: "Home",
    settings: "Settings",
  },

  navigation: {
    back: "Back"
  },

  global: {
    confirm: "Confirm",
    cancel: "Cancel",
    delete: "Delete",
    success: "Success",
    error: "Error",
    ok: "OK",
    select: "Select",
    close: "Close",
    chooseDate: "Choose a date",
    selectDate: "Select a date",
    modifySchedule: "Modify schedule",
    deleteData: "Delete data",
  },

  itemSelection: {
    noSelection: "No selection",
    nSelected: {
      one: "{n} item selected",
      other: "{n} items selected",
    }
  },

  hours: {
    hh: "{h}h",
    hhmm: "{h}h{m}",
    hh2dmm: "{h}:{m}",
  },

  calendar: {
    monthNames: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      octember: "October",
      november: "November",
      december: "December",
    },
    monthShortNames: {
      january: "Jan.",
      february: "Feb.",
      march: "Mar.",
      april: "Apr.",
      may: "May",
      june: "Jun.",
      july: "Jul.",
      august: "Aug.",
      september: "Sep.",
      octember: "Oct.",
      november: "Nov.",
      december: "Dec.",
    },
    dayNames: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
    dayShortNames: {
      sunday: "Sun.",
      monday: "Mon.",
      tuesday: "Tue.",
      wednesday: "Wed.",
      thursday: "Thu.",
      friday: "Fri.",
      saturday: "Sat.",
    },
    today: "Today",
  },

  home: {
    title: "Home",
  },

  settings: {
    title: "Settings",

    preferences: {
      title: "Preferences",
      theme: "Theme",
      language: "Language",
    },

    help: {
      title: "Help & Support",
      contactUs: "Contact us",
    },

    version: "Version {version}",
  },

  settings_theme: {
    title: "Choose theme",
    system: "System",
    light: "Light",
    dark: "Dark",
    systemDescription: "Automatically adapts to the system theme.",
    lightDescription: "The app will always use the light theme.",
    darkDescription: "The app will always use the dark theme.",
  },

  settings_language: {
    title: "Choose language",
    description: "The selected language will be applied throughout the app.",
    fr: "French",
    en: "English",
  },
};

export default en;
