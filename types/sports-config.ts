// config/sports-config.ts
import { SportFormConfig, SportDisplayConfig } from "./form-config";
import { CyclingActivity, RunningActivity, SportType, SwimmingActivity, TrailActivity } from "./activity";

// Configuration des formulaires par sport
export const SPORT_FORM_CONFIGS: Record<SportType, SportFormConfig> = {
  running: {
    sport: "running",
    fields: {
      distanceKm: {
        type: "number",
        name: "distanceKm",
        label: "Distance",
        icon: "📏",
        required: true,
        min: 0,
        max: 1000,
        step: 0.01,
        unit: "km",
      },
      allureMinKm: {
        type: "number",
        name: "allureMinKm",
        label: "Allure",
        icon: "⏱️",
        required: true,
        min: 0,
        max: 30,
        step: 0.01,
        unit: "min/km",
      },
      elevationGainM: {
        type: "number",
        name: "elevationGainM",
        label: "Dénivelé positif",
        icon: "⛰️",
        required: false,
        min: 0,
        max: 10000,
        step: 1,
        unit: "m",
      },
    },
  },
  
  cycling: {
    sport: "cycling",
    fields: {
      distanceKm: {
        type: "number",
        name: "distanceKm",
        label: "Distance",
        icon: "📏",
        required: true,
        min: 0,
        max: 500,
        step: 0.1,
        unit: "km",
      },
      avgSpeedKmh: {
        type: "number",
        name: "avgSpeedKmh",
        label: "Vitesse moyenne",
        icon: "🚴",
        required: true,
        min: 0,
        max: 80,
        step: 0.1,
        unit: "km/h",
      },
      elevationGainM: {
        type: "number",
        name: "elevationGainM",
        label: "Dénivelé positif",
        icon: "⛰️",
        required: false,
        min: 0,
        max: 5000,
        step: 1,
        unit: "m",
      },
    },
  },

  swimming: {
    sport: "swimming",
    fields: {
      distanceM: {
        type: "number",
        name: "distanceM",
        label: "Distance",
        icon: "🏊",
        required: true,
        min: 0,
        max: 10000,
        step: 50,
        unit: "m",
      },
      durationMin: {
        type: "number",
        name: "durationMin",
        label: "Durée",
        icon: "⏱️",
        required: true,
        min: 0,
        max: 300,
        step: 1,
        unit: "min",
      },
      pool: {
        type: "boolean",
        name: "pool",
        label: "Piscine",
        icon: "🏊‍♂️",
        required: false,
        defaultValue: true,
      },
    },
  },

  trail: {
    sport: "trail",
    fields: {
      distanceKm: {
        type: "number",
        name: "distanceKm",
        label: "Distance",
        icon: "📏",
        required: true,
        min: 0,
        max: 300,
        step: 0.1,
        unit: "km",
      },
      elevationGainM: {
        type: "number",
        name: "elevationGainM",
        label: "D+",
        icon: "⬆️",
        required: true,
        min: 0,
        max: 15000,
        step: 1,
        unit: "m",
      },
      elevationLossM: {
        type: "number",
        name: "elevationLossM",
        label: "D-",
        icon: "⬇️",
        required: true,
        min: 0,
        max: 15000,
        step: 1,
        unit: "m",
      },
      allureMinKm: {
        type: "number",
        name: "allureMinKm",
        label: "Allure",
        icon: "⏱️",
        required: false,
        min: 0,
        max: 30,
        step: 0.01,
        unit: "min/km",
      },
    },
  },
};

// Configuration de l'affichage par sport
export const SPORT_DISPLAY_CONFIGS: Record<SportType, SportDisplayConfig> = {
  running: {
    sport: "running",
    fields: {
      distanceKm: {
        label: "Distance",
        icon: "📏",
        format: (value) => `${value.toFixed(2)} km`,
      },
      allureMinKm: {
        label: "Allure",
        icon: "⏱️",
        format: (value) => {
          const min = Math.floor(value);
          const sec = Math.round((value - min) * 60);
          return `${min}'${sec.toString().padStart(2, "0")}" /km`;
        },
      },
      elevationGainM: {
        label: "D+",
        icon: "⛰️",
        format: (value) => (value ? `${value} m` : "—"),
      },
    },
    summary: (activity) => {
      const a = activity as RunningActivity;
      return `${a.distanceKm.toFixed(2)} km • ${a.allureMinKm.toFixed(2)} min/km`;
    },
  },

  cycling: {
    sport: "cycling",
    fields: {
      distanceKm: {
        label: "Distance",
        icon: "📏",
        format: (value) => `${value.toFixed(1)} km`,
      },
      avgSpeedKmh: {
        label: "Vitesse moy.",
        icon: "🚴",
        format: (value) => `${value.toFixed(1)} km/h`,
      },
      elevationGainM: {
        label: "D+",
        icon: "⛰️",
        format: (value) => (value ? `${value} m` : "—"),
      },
    },
    summary: (activity) => {
      const a = activity as CyclingActivity;
      return `${a.distanceKm.toFixed(1)} km • ${a.avgSpeedKmh.toFixed(1)} km/h`;
    },
  },

  swimming: {
    sport: "swimming",
    fields: {
      distanceM: {
        label: "Distance",
        icon: "🏊",
        format: (value) => `${value} m`,
      },
      durationMin: {
        label: "Durée",
        icon: "⏱️",
        format: (value) => `${value} min`,
      },
      pool: {
        label: "Type",
        icon: "🏊‍♂️",
        format: (value) => (value ? "Piscine" : "Eau libre"),
      },
    },
    summary: (activity) => {
      const a = activity as SwimmingActivity;
      return `${a.distanceM} m • ${a.durationMin} min`;
    },
  },

  trail: {
    sport: "trail",
    fields: {
      distanceKm: {
        label: "Distance",
        icon: "📏",
        format: (value) => `${value.toFixed(1)} km`,
      },
      elevationGainM: {
        label: "D+",
        icon: "⬆️",
        format: (value) => `${value} m`,
      },
      elevationLossM: {
        label: "D-",
        icon: "⬇️",
        format: (value) => `${value} m`,
      },
      allureMinKm: {
        label: "Allure",
        icon: "⏱️",
        format: (value) => `${value.toFixed(2)} min/km`,
      },
    },
    summary: (activity) => {
      const a = activity as TrailActivity;
      return `${a.distanceKm.toFixed(1)} km • D+ ${a.elevationGainM} m`;
    },
  },
};