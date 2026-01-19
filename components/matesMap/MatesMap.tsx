import React, { useState } from "react";
import { MapView, PointAnnotation } from "@maplibre/maplibre-react-native";

import { StyleSheet, View, Image } from "react-native";
import type { Feature } from "geojson";

import MapMarker from "@assetsMap/marker.png"

export interface Coordinate {
  lgn: number,
  lat: number
}

export interface MatesMapProps {
  startupLocation?: Coordinate,
  coordinates?: Coordinate[];
  mapStyle?: string;
  icon?: any;
}

export default function MatesMap({ 
    startupLocation, 
    coordinates,
    mapStyle = "https://tiles.openfreemap.org/styles/liberty", 
    icon,
    } : MatesMapProps) {

  const [markers, setMarkers] = useState([
    { id: "marker-initial", coordinate: [2.3522, 48.8566] as [number, number] }
  ]);

  const handleMapPress = (feature: Feature) => {
    if (feature.geometry.type === 'Point') {
      const coordinates = feature.geometry.coordinates as [number, number];
      
      setMarkers([...markers, {
        id: `marker-${Date.now()}`,
        coordinate: coordinates
      }]);
    }
  };

  return (
    <MapView
      mapStyle={mapStyle}
      style={styles.map}
      onLongPress={handleMapPress}
    >
      {markers.map((marker) => (
        <PointAnnotation 
          key={marker.id}
          id={marker.id} 
          coordinate={marker.coordinate}
        >
          <View style={styles.markerContainer}>
            <Image source={MapMarker} style={{width: 48, height: 48}} />
          </View>
        </PointAnnotation>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: { 
    flex: 1 
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerEmoji: {
    fontSize: 30
  }
});