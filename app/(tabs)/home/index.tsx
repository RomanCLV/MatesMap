// app/home/index.tsx
import React, { useMemo, useRef, useState } from "react";
import MatesMap, { MapLocation, MatesMapHandle } from "@components/matesMap";
import { activitiesToFeatureCollection, generateActivities } from "utils/activity.utils";

import matesMapStyle from "@assetsMap/styles/matesMapStyle.json";
import MarkerRed from "@assetsMap/icons/marker-red.png";
import MarkerGreen from "@assetsMap/icons/marker-green.png";
import MarkerBlue from "@assetsMap/icons/marker-blue.png";
import { Activity } from "types/activity";
import ThemedView from "@components/themedComponents/ThemedView";
import ThemedBottomSheetModal from "@components/themedComponents/ThemedBottomSheetModal";
import { CardActivity } from "@components/map/CardActivity";
import { useT } from "@i18n/useT";

const PARIS_COORDINATES: MapLocation = { lat: 48.8566, lng: 2.3522 };

const activities = generateActivities(
  1000,
  PARIS_COORDINATES,
  0.6
);

export default function Home() {
  const mapRef = useRef<MatesMapHandle>(null);
  const t = useT();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const activityById = useMemo(() => {
    return Object.fromEntries(activities.map((a) => [a.id, a]));
  }, []);

  const onPressFeature = (feature: GeoJSON.Feature) => {
    const id = feature.properties?.id;
    if (!id) return;

    const activity = activityById[id];
    if (!activity) 
      return;

    // Centrer la caméra sur l'activité
    mapRef.current?.focusOn({
      lat: activity.location.lat,
      lng: activity.location.lng,
      minZoom: 13,
      animationDuration: 500,
    });

    setSelectedActivity(activity);
  };

  const closeActivity = () => setSelectedActivity(null);

  return (
    <ThemedView style={{ flex: 1 }}>
      <MatesMap
        ref={mapRef}
        data={activities}
        toFeatureCollection={activitiesToFeatureCollection}
        mapStyle={matesMapStyle}
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

      <ThemedBottomSheetModal
        visible={!!selectedActivity}
        onClose={closeActivity}
        header={{
          title: selectedActivity?.name,
          cancelText: t("global.close"),
          confirmText: t("global.ok"),
          onCancel: closeActivity,
          onConfirm: closeActivity,
        }}
        contentStyle={{ flex: 1, alignItems: "stretch", padding: 16 }}
      >
        {selectedActivity && <CardActivity activity={selectedActivity} /> }
      </ThemedBottomSheetModal>
    </ThemedView>
  );
}
