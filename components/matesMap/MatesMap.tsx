// components/matesMap/MatesMap.tsx
import React, {
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { StyleSheet } from "react-native";
import {
  MapView,
  ShapeSource,
  SymbolLayer,
  CircleLayer,
  Images,
  Camera,
  OnPressEvent,
  CameraRef,
  CameraStop,
  MapViewRef
} from "@maplibre/maplibre-react-native";
import { CameraStops } from "node_modules/@maplibre/maplibre-react-native/lib/typescript/module/src/components/Camera";

import type { Feature, FeatureCollection } from "geojson";

import {
  ClusterConfig,
  IconConfig,
  StartupLocation,
  ToFeatureCollection,
  FocusOptions,
} from "./map.types";

import {
  defaultClusterCircle,
  defaultClusterText,
  defaultSymbolStyle,
} from "./defaultStyles";

const DEFAULT_ZOOM = 10;

export interface MatesMapRef {
  map: MapViewRef;
  camera: CameraRef & {
    focusOn: (options: FocusOptions) => Promise<void>;
    resetCamera: () => void;
  };
}

export interface MatesMapProps<T = any> {
  featureCollection?: FeatureCollection;

  /** données brutes + callback */
  data?: T[];
  toFeatureCollection?: ToFeatureCollection<T>;

  mapStyle?: string | object;
  startupLocation?: StartupLocation;
  icons?: IconConfig;
  clusters?: ClusterConfig;

  onPressFeature?: (feature: Feature) => void;
  onPressCluster?: (cluster: Feature) => void;
}

/* =========================
  Component
========================= */

const MatesMap = forwardRef<MatesMapRef, MatesMapProps>(
  (
    {
      featureCollection,
      data = [],
      toFeatureCollection,
      mapStyle = "https://tiles.openfreemap.org/styles/liberty",
      startupLocation,
      icons,
      clusters,
      onPressFeature,
      onPressCluster,
    }: MatesMapProps,
    ref
  ) => {
    const cameraRef = useRef<CameraRef>(null);
    const mapViewRef = useRef<MapViewRef>(null);

    const geojson: FeatureCollection | undefined = useMemo(() => {
      if (featureCollection)
        return featureCollection;

      if (data.length && toFeatureCollection)
        return toFeatureCollection(data);

      return undefined;
    }, [featureCollection, data, toFeatureCollection]);

    // Exposition des méthodes via useImperativeHandle
    useImperativeHandle(ref, () => ({
      map: mapViewRef.current!,
      camera: {
        ...cameraRef.current!,
        focusOn: async ({ lat, lng, minZoom = 13, animationDuration = 1000 }: FocusOptions) => {
          // Récupérer le zoom actuel
          const currentZoom = await mapViewRef.current?.getZoom();
          
          // On zoom seulement si le zoom actuel est inférieur au minZoom demandé
          const targetZoom = currentZoom !== undefined ? Math.max(currentZoom, minZoom) : minZoom;
          
          cameraRef.current?.setCamera({
            centerCoordinate: [lng, lat],
            zoomLevel: targetZoom,
            animationDuration,
          });
        },
        resetCamera: () => {
          if (startupLocation) {
            cameraRef.current?.setCamera({
              centerCoordinate: [
                startupLocation.location.lng,
                startupLocation.location.lat,
              ],
              zoomLevel: startupLocation.zoom ?? DEFAULT_ZOOM,
              animationDuration: 1000,
            });
          }
        },
      }
    }));

    const onShapePressed = (event: OnPressEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const isCluster = feature.properties?.point_count != null;
      if (isCluster) {
        onPressCluster?.(feature);
      }
      else {
        onPressFeature?.(feature);
      }
    };

    return (
      <MapView 
        ref={mapViewRef}
        style={styles.map}
        mapStyle={mapStyle}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={
            startupLocation
              ? {
                  zoomLevel: startupLocation.zoom ?? DEFAULT_ZOOM,
                  centerCoordinate: [
                    startupLocation.location.lng,
                    startupLocation.location.lat,
                  ],
                }
              : undefined
          }
        />

        {icons && <Images images={icons.images} />}

        <ShapeSource
          id="source"
          shape={geojson}
          cluster
          clusterRadius={clusters?.radius ?? 50}
          clusterMaxZoomLevel={clusters?.maxZoom ?? 14}
          onPress={onShapePressed}
        >
          <CircleLayer
            id="clusters"
            filter={["has", "point_count"]}
            style={{
              ...defaultClusterCircle,
              ...clusters?.styles?.circle,
            }}
          />

          <SymbolLayer
            id="cluster-count"
            filter={["has", "point_count"]}
            style={{
              ...defaultClusterText,
              ...clusters?.styles?.countText,
            }}
          />

          {icons && (
            <SymbolLayer
              id="markers"
              filter={["!", ["has", "point_count"]]}
              style={{
                ...defaultSymbolStyle,
                ...icons.style,
                iconImage: ["get", icons.property],
              }}
            />
          )}
        </ShapeSource>
      </MapView>
    );
  }
);

MatesMap.displayName = "MatesMap";

export default MatesMap;

const styles = StyleSheet.create({
  map: { flex: 1 },
});
