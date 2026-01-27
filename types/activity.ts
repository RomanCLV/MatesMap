// types/activity.ts
import { MapLocation } from "@components/matesMap";

export const SPORT_TYPES = [
  "running",
  "cycling",
  "swimming",
  "trail",
] as const;

export type SportType = typeof SPORT_TYPES[number];

export const SPORT_ICONS: Record<SportType, string> = {
  running: "🏃",
  cycling: "🚴",
  swimming: "🏊",
  trail: "⛰️",
};

export const SPORT_LABELS: Record<SportType, string> = {
  running: "Course à pied",
  cycling: "Cyclisme",
  swimming: "Natation",
  trail: "Trail",
};

// Base commune à toutes les activités
export interface BaseActivity {
  id: string;
  name: string;
  description: string;
  sport: SportType;
  location: MapLocation;
}

// Activités typées par sport
export interface RunningActivity extends BaseActivity {
  sport: "running";
  distanceKm: number;
  allureMinKm: number;
  elevationGainM?: number;
}

export interface CyclingActivity extends BaseActivity {
  sport: "cycling";
  distanceKm: number;
  avgSpeedKmh: number;
  elevationGainM?: number;
}

export interface SwimmingActivity extends BaseActivity {
  sport: "swimming";
  distanceM: number;
  durationMin: number;
  pool: boolean;
}

export interface TrailActivity extends BaseActivity {
  sport: "trail";
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  allureMinKm: number;
}

// Union type pour toutes les activités
export type Activity =
  | RunningActivity
  | CyclingActivity
  | SwimmingActivity
  | TrailActivity;