// app/(tabs)/home/index.tsx
import React from "react";
import MatesMap from "@components/matesMap";
import { activitiesToFeatureCollection, generateActivities } from "utils/activity.utils";

import MarkerRed from "@assetsMap/marker-red.png";
import MarkerGreen from "@assetsMap/marker-green.png";
import MarkerBlue from "@assetsMap/marker-blue.png";

const activities = generateActivities(1000, { lat: 48.8566, lng: 2.3522 }, 0.4);

export default function Home() {
  return (
    <MatesMap
      data={activities}
      toFeatureCollection={activitiesToFeatureCollection}
      startupLocation={{
        location: {
          lat: 48.8566,
          lng: 2.3522,
        },
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
    />
  );
}
