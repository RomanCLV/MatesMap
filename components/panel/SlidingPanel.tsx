import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";
import { useTheme } from "@hooks/useTheme";

export type SlidingPanelState = "hidden" | "reduced" | "full";

interface SlidingPanelProps<T> {
  state: SlidingPanelState;
  onStateChange: (next: SlidingPanelState) => void;
  data: T[];
  index: number;
  onIndexChange: (nextIndex: number) => void;
  keyExtractor: (item: T, index: number) => string;
  renderReducedItem: (item: T, index: number) => React.ReactNode;
  renderFullItem: (item: T, index: number) => React.ReactNode;
  reducedHeight?: number;
  fullHeight?: number;
  containerStyle?: ViewStyle;
  fullModeTopMargin?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function SlidingPanel<T>({
  state,
  onStateChange,
  data,
  index,
  onIndexChange,
  keyExtractor,
  renderReducedItem,
  renderFullItem,
  reducedHeight = 180,
  fullHeight,
  containerStyle,
  fullModeTopMargin = 60,
}: SlidingPanelProps<T>) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);

  // Hauteur maximale en mode full = hauteur écran - marge du haut
  const resolvedFullHeight = Math.max(
    0,
    (fullHeight ?? height - fullModeTopMargin) || 0
  );
  const resolvedReducedHeight = Math.min(
    resolvedFullHeight,
    reducedHeight ?? Math.round(resolvedFullHeight * 0.32)
  );

  const snapPoints = useMemo(
    () => ({
      full: fullModeTopMargin, // Position avec marge en haut
      reduced: height - resolvedReducedHeight,
      hidden: height,
    }),
    [height, resolvedReducedHeight, fullModeTopMargin]
  );

  const translateY = useRef(new Animated.Value(snapPoints.hidden)).current;
  const currentTranslateY = useRef(snapPoints.hidden);
  const dragStartY = useRef(snapPoints.hidden);
  const listRef = useRef<FlatList<T>>(null);

  useEffect(() => {
    const subId = translateY.addListener(({ value }) => {
      currentTranslateY.current = value;
    });
    return () => translateY.removeListener(subId);
  }, [translateY]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: snapPoints[state],
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  }, [snapPoints, state, translateY]);

  useEffect(() => {
    if (state !== "reduced") return;
    if (!listRef.current) return;
    listRef.current.scrollToOffset({
      offset: index * width,
      animated: false,
    });
  }, [index, state, width]);

  // Reset scroll position when opening in full mode
  useEffect(() => {
    if (state === "full") {
      scrollY.current = 0;
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [state]);

  const snapTo = (next: SlidingPanelState, velocityY?: number) => {
    Animated.spring(translateY, {
      toValue: snapPoints[next],
      useNativeDriver: true,
      tension: 90,
      friction: 12,
      velocity: velocityY,
    }).start();
    if (next !== state) onStateChange(next);
  };

  const decideSnap = (velocityY: number, positionY: number): SlidingPanelState => {
    if (velocityY > 0.8) {
      if (positionY < snapPoints.reduced) return "reduced";
      return "hidden";
    }
    if (velocityY < -0.8) {
      if (positionY > snapPoints.reduced) return "reduced";
      return "full";
    }

    const entries: Array<[SlidingPanelState, number]> = [
      ["full", snapPoints.full],
      ["reduced", snapPoints.reduced],
      ["hidden", snapPoints.hidden],
    ];

    let closest: SlidingPanelState = "hidden";
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const [key, value] of entries) {
      const dist = Math.abs(positionY - value);
      if (dist < bestDistance) {
        bestDistance = dist;
        closest = key;
      }
    }
    return closest;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          // En mode full, permettre le drag seulement si on est en haut du scroll
          if (state === "full" && scrollY.current > 5) {
            return false;
          }
          return Math.abs(gesture.dy) > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx);
        },
        onPanResponderGrant: () => {
          translateY.stopAnimation();
          dragStartY.current = currentTranslateY.current;
        },
        onPanResponderMove: (_, gesture) => {
          const nextY = clamp(
            dragStartY.current + gesture.dy,
            snapPoints.full,
            snapPoints.hidden
          );
          translateY.setValue(nextY);
        },
        onPanResponderRelease: (_, gesture) => {
          const next = decideSnap(gesture.vy, currentTranslateY.current);
          snapTo(next, gesture.vy);
        },
        onPanResponderTerminate: () => {
          snapTo(state);
        },
      }),
    [snapPoints.full, snapPoints.hidden, snapPoints.reduced, state, snapTo, translateY]
  );

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (nextIndex !== index) onIndexChange(nextIndex);
  };

  const onScrollFull = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  };

  const renderReduced = () => (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={keyExtractor}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={false}
      initialNumToRender={3}
      windowSize={3}
      maxToRenderPerBatch={3}
      getItemLayout={(_, i) => ({
        length: width,
        offset: width * i,
        index: i,
      })}
      onMomentumScrollEnd={onScrollEnd}
      onScrollToIndexFailed={({ index: failedIndex }) => {
        listRef.current?.scrollToOffset({
          offset: failedIndex * width,
          animated: false,
        });
      }}
      renderItem={({ item, index: itemIndex }) => (
        <View style={[styles.reducedItem, { width }]}>
          {renderReducedItem(item, itemIndex)}
        </View>
      )}
    />
  );

  const currentItem = data[index];

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents={state === "hidden" ? "none" : "auto"}
        style={[
          styles.sheet,
          containerStyle,
          {
            height: height - fullModeTopMargin,
            backgroundColor: theme.background.surface,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={[styles.handle, { backgroundColor: theme.border.light }]} />
        </View>

        {state === "reduced" && renderReduced()}

        {state === "full" && currentItem !== undefined && (
          <Animated.ScrollView
            ref={scrollViewRef}
            style={styles.fullScroll}
            contentContainerStyle={styles.fullContent}
            showsVerticalScrollIndicator
            scrollEventThrottle={16}
            onScroll={onScrollFull}
            bounces={true}
          >
            {renderFullItem(currentItem, index)}
          </Animated.ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  handleArea: {
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  reducedItem: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fullContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  fullScroll: {
    flex: 1,
  },
});
