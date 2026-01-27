// app/home/index.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import MatesMap, { MapLocation, MatesMapRef } from "@components/matesMap";
import { activitiesToFeatureCollection, generateActivities } from "utils/activity.utils";

import matesMapLightStyle from "@assetsMap/styles/matesMapLightStyle.json";
import matesMapDarkStyle from "@assetsMap/styles/matesMapDarkStyle.json";
import MarkerRed from "@assetsMap/icons/marker-red.png";
import MarkerGreen from "@assetsMap/icons/marker-green.png";
import MarkerBlue from "@assetsMap/icons/marker-blue.png";
import ThemedView from "@components/themedComponents/ThemedView";
import { CardActivity } from "@components/activities/CardActivity";
import { useTheme } from "@hooks/useTheme";
import SlidingPanel, { SlidingPanelState } from "@components/panel/SlidingPanel";
import { ActivityDetail } from "@components/activities/ActivityDetail";

const PARIS_COORDINATES: MapLocation = { lat: 48.8566, lng: 2.3522 };

const activities = generateActivities(
  1000,
  PARIS_COORDINATES,
  0.6
);

export default function Home() {
  const mapRef = useRef<MatesMapRef>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [panelState, setPanelState] = useState<SlidingPanelState>("hidden");
  const theme = useTheme();

  const activityById = useMemo(() => {
    return Object.fromEntries(activities.map((a, i) => [a.id, i]));
  }, []);

  const onPressFeature = (feature: GeoJSON.Feature) => {
    const id = feature.properties?.id;
    if (!id) 
      return;

    const activityIndex = activityById[id];
    if (activityIndex === undefined) return;

    setSelectedIndex(activityIndex);
    setPanelState("reduced");
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    const activity = activities[selectedIndex];
    if (!activity) return;
    mapRef.current?.camera.focusOn({
      lat: activity.location.lat,
      lng: activity.location.lng,
      minZoom: 14,
      animationDuration: 500,
    });
  }, [selectedIndex]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <MatesMap
        ref={mapRef}
        data={activities}
        toFeatureCollection={activitiesToFeatureCollection}
        mapStyle={theme.isDark ? matesMapDarkStyle : matesMapLightStyle}
        startupLocation={{
          location: PARIS_COORDINATES,
          zoom: 11,
        }}
        icons={{
          property: "sport",
          images: {
            running: MarkerRed,
            cycling: MarkerGreen,
            swimming: MarkerBlue,
            trail: MarkerGreen,
          },
          style: {
            iconSize: 0.05,
          },
        }}
        onPressFeature={onPressFeature}
      />

      {selectedIndex !== null && (
        <SlidingPanel
          state={panelState}
          onStateChange={setPanelState}
          data={activities}
          index={selectedIndex}
          onIndexChange={setSelectedIndex}
          keyExtractor={(item) => item.id}
          renderReducedItem={(item) => <CardActivity activity={item} />}
          renderFullItem={(item) => <ActivityDetail activity={item} />}
          reducedHeight={180}
        />
      )}
    </ThemedView>
  );
}

