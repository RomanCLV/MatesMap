import { LanguageSet } from "../types";

const fr: LanguageSet = {
  tabBar: {
    home: "Home",
    settings: "Réglages",
  },

  navigation: {
    back: "Retour"
  },

  global: {
    confirm: "Confirmer",
    cancel: "Annuler",
    delete: "Supprimer",
    success: "Succès",
    error: "Erreur",
    ok: "OK",
    select: "Sélectionner",
    close: "Fermer",
    chooseDate: "Choisir une date",
    selectDate: "Sélectionner une date",
    modifySchedule: "Modifier l'horaire",
    deleteData: "Supprimer les données",
  },

  itemSelection: {
    noSelection: "Aucune sélection",
    nSelected: {
      one: "{n} élément sélectionné",
      other: "{n} éléments sélectionnés",
    }
  },

  hours: {
    hh: "{h}h",
    hhmm: "{h}h{m}",
    hh2dmm: "{h}:{m}",
  },

  calendar: {
    monthNames: {
      january: "Janvier",
      february: "Février",
      march: "Mars",
      april: "Avril",
      may: "Mai",
      june: "Juin",
      july: "Juillet",
      august: "Août",
      september: "Septembre",
      octember: "Octobre",
      november: "Novembre",
      december: "Décembre",
    },
    monthShortNames: {
      january: "Janv.",
      february: "Févr.",
      march: "Mars",
      april: "Avr.",
      may: "Mai",
      june: "Juin",
      july: "Juil.",
      august: "Août",
      september: "Sept.",
      octember: "Oct.",
      november: "Nov.",
      december: "Déc.",
    },
    dayNames: {
      sunday: "Dimanche",
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
    },
    dayShortNames: {
      sunday: "Dim.",
      monday: "Lun.",
      tuesday: "Mar.",
      wednesday: "Mer.",
      thursday: "Jeu.",
      friday: "Ven.",
      saturday: "Sam.",
    },
    today: "Aujourd'hui",
  },

  home: {
    title: "Bienvenue",
  },

  settings: {
    title: "Paramètres",

    preferences: {
      title: "Préférences",
      theme: "Thème",
      language: "Langue",
    },

    help: {
      title: "Aide & Support",
      contactUs: "Nous contacter",
    },

    version: "Version {version}",
  },

  settings_theme: {
    title: "Choisir le thème",
    system: "Système",
    light: "Clair",
    dark: "Sombre",
    systemDescription: "S'adapte automatiquement au thème du système.",
    lightDescription: "L'application utilisera toujours le thème clair.",
    darkDescription: "L'application utilisera toujours le thème sombre.",
  },

  settings_language: {
    title: "Choisir la langue",
    description: "La langue sélectionnée sera appliquée à l'ensemble de l'application.",
    fr: "Français",
    en: "Anglais",
  },
};

export default fr;
