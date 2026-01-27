// utils.activity.utils.ts
import type { FeatureCollection, Point } from "geojson";
import { 
  Activity, 
  RunningActivity, 
  CyclingActivity, 
  SwimmingActivity, 
  TrailActivity,
  SPORT_TYPES,
  SportType 
} from "types/activity";
import { MapLocation } from "@components/matesMap";

export interface ActivityFeatureProperties {
  id: string,
  sport: SportType,
}

export function activitiesToFeatureCollection(list: Activity[]): FeatureCollection<Point, ActivityFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: list.map((item) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.location.lng, item.location.lat],
      },
      properties: {
        id: item.id,
        sport: item.sport,
      },
    })),
  };
}

// Helpers pour générer des valeurs réalistes
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(randomInRange(min, max));
};

const randomLocation = (
  center: MapLocation,
  amplitude: number
): MapLocation => ({
  lat: center.lat + (Math.random() - 0.5) * amplitude,
  lng: center.lng + (Math.random() - 0.5) * amplitude,
});

// Noms réalistes par sport
const RUNNING_NAMES = [
  "Footing matinal",
  "Sortie longue",
  "Fractionné",
  "Course cool",
  "Endurance fondamentale",
  "Sortie en groupe",
];

const CYCLING_NAMES = [
  "Sortie vélo route",
  "Balade à vélo",
  "Sortie gravel",
  "Tour cycliste",
  "Vélo en groupe",
];

const SWIMMING_NAMES = [
  "Séance natation",
  "Nage matinale",
  "Entraînement piscine",
  "Natation en eau libre",
  "Session crawl",
];

const TRAIL_NAMES = [
  "Trail en montagne",
  "Ultra trail",
  "Sortie trail",
  "Rando trail",
  "Trail nocturne",
];

// Générateurs spécifiques par sport
export function generateRunningActivity(
  id: string,
  center: MapLocation,
  amplitude: number
): RunningActivity {
  const distanceKm = randomInRange(3, 25);
  const allureMinKm = randomInRange(4, 7); // 4-7 min/km
  const hasElevation = Math.random() > 0.5;

  return {
    id,
    name: RUNNING_NAMES[randomInt(0, RUNNING_NAMES.length)],
    description: `Course de ${distanceKm.toFixed(1)} km`,
    sport: "running",
    location: randomLocation(center, amplitude),
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    allureMinKm: parseFloat(allureMinKm.toFixed(2)),
    ...(hasElevation && {
      elevationGainM: randomInt(50, 500),
    }),
  };
}

export function generateCyclingActivity(
  id: string,
  center: MapLocation,
  amplitude: number
): CyclingActivity {
  const distanceKm = randomInRange(20, 150);
  const avgSpeedKmh = randomInRange(18, 35);
  const hasElevation = Math.random() > 0.6;

  return {
    id,
    name: CYCLING_NAMES[randomInt(0, CYCLING_NAMES.length)],
    description: `Sortie vélo de ${distanceKm.toFixed(0)} km`,
    sport: "cycling",
    location: randomLocation(center, amplitude),
    distanceKm: parseFloat(distanceKm.toFixed(1)),
    avgSpeedKmh: parseFloat(avgSpeedKmh.toFixed(1)),
    ...(hasElevation && {
      elevationGainM: randomInt(200, 2000),
    }),
  };
}

export function generateSwimmingActivity(
  id: string,
  center: MapLocation,
  amplitude: number
): SwimmingActivity {
  const distanceM = randomInt(500, 5000);
  const durationMin = randomInt(15, 120);
  const pool = Math.random() > 0.3; // 70% piscine, 30% eau libre

  return {
    id,
    name: SWIMMING_NAMES[randomInt(0, SWIMMING_NAMES.length)],
    description: pool
      ? `Séance piscine de ${distanceM}m`
      : `Natation en eau libre - ${distanceM}m`,
    sport: "swimming",
    location: randomLocation(center, amplitude),
    distanceM: Math.round(distanceM / 50) * 50, // Arrondi à 50m
    durationMin,
    pool,
  };
}

export function generateTrailActivity(
  id: string,
  center: MapLocation,
  amplitude: number
): TrailActivity {
  const distanceKm = randomInRange(10, 100);
  const elevationGainM = randomInt(300, 3000);
  const elevationLossM = randomInt(
    elevationGainM * 0.8,
    elevationGainM * 1.2
  );
  const allureMinKm = randomInRange(6, 12); // Plus lent que running

  return {
    id,
    name: TRAIL_NAMES[randomInt(0, TRAIL_NAMES.length)],
    description: `Trail de ${distanceKm.toFixed(0)} km avec ${elevationGainM}m D+`,
    sport: "trail",
    location: randomLocation(center, amplitude),
    distanceKm: parseFloat(distanceKm.toFixed(1)),
    elevationGainM,
    elevationLossM,
    allureMinKm: parseFloat(allureMinKm.toFixed(2)),
  };
}

// Générateur principal qui dispatche selon le sport
export function generateActivity(
  id: string,
  sport: SportType,
  center: MapLocation,
  amplitude: number
): Activity {
  switch (sport) {
    case "running":
      return generateRunningActivity(id, center, amplitude);
    case "cycling":
      return generateCyclingActivity(id, center, amplitude);
    case "swimming":
      return generateSwimmingActivity(id, center, amplitude);
    case "trail":
      return generateTrailActivity(id, center, amplitude);
  }
}

// Générateur de multiples activités (nouvelle version)
export function generateActivities(
  count: number,
  center: MapLocation = { lat: 48.8566, lng: 2.3522 },
  amplitude = 0.2
): Activity[] {
  return Array.from({ length: count }).map((_, i) => {
    const sport = SPORT_TYPES[i % SPORT_TYPES.length];
    return generateActivity(`activity-${i}`, sport, center, amplitude);
  });
}
