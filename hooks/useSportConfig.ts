// hooks/useSportConfig.ts
import { useMemo } from "react";
import { SportType } from "types/activity";
import { SPORT_FORM_CONFIGS, SPORT_DISPLAY_CONFIGS } from "types/sports-config";

export function useSportFormConfig(sport: SportType) {
  return useMemo(() => SPORT_FORM_CONFIGS[sport], [sport]);
}

export function useSportDisplayConfig(sport: SportType) {
  return useMemo(() => SPORT_DISPLAY_CONFIGS[sport], [sport]);
}
