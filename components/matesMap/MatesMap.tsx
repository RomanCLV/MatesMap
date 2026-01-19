import React, { useState, useCallback } from "react";
import { MapView, PointAnnotation } from "@maplibre/maplibre-react-native";

import { StyleSheet, View, Image } from "react-native";

import MapMarker from "@assetsMap/marker.png"

type LngLat = [number, number];

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

  const parisCoordinate: LngLat = [2.3522, 48.8566];
  const [markers, setMarkers] = useState([
    { id: "marker-initial", coordinate: parisCoordinate },
  ]);

  const handleLongPress = useCallback((e: any) => {
    // e.geometry.coordinates est le plus fiable pour récupérer la position pressée
    const pressed = e?.geometry?.coordinates as LngLat | undefined;
    if (!pressed || pressed.length !== 2) return;

    setMarkers((prev) => [
      ...prev,
      { id: `marker-${Date.now()}`, coordinate: pressed },
    ]);
  }, []);

  return (
    <MapView
      mapStyle={mapStyle}
      style={styles.map}
      onLongPress={handleLongPress}
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