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
export type TransitionMode = "crossfade" | "slide" | "instant" | "custom";

interface SlidingPanelProps<T> {
  state: SlidingPanelState;
  onStateChange: (next: SlidingPanelState) => void;
  data: T[];
  index: number;
  onIndexChange: (nextIndex: number) => void;
  keyExtractor: (item: T, index: number) => string;
  
  /** Mode de transition entre reduced et full (default: "crossfade") */
  transitionMode?: TransitionMode;
  
  /** Utilisé pour les modes crossfade, instant, slide */
  renderReducedItem?: (item: T, index: number) => React.ReactNode;
  renderFullItem?: (item: T, index: number) => React.ReactNode;
  
  /** Utilisé uniquement pour le mode custom - progress va de 0 (reduced) à 1 (full) */
  renderCustomItem?: (item: T, index: number, progress: Animated.AnimatedInterpolation<number>) => React.ReactNode;
  
  reducedHeight?: number;
  fullHeight?: number;
  containerStyle?: ViewStyle;
  /** Marge en haut pour garder la zone de grab accessible en mode full (default: 60) */
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
  transitionMode = "crossfade",
  renderReducedItem,
  renderFullItem,
  renderCustomItem,
  reducedHeight,
  fullHeight,
  containerStyle,
  fullModeTopMargin = 60,
}: SlidingPanelProps<T>) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);

  // Validation des props selon le mode
  if (transitionMode === "custom" && !renderCustomItem) {
    console.warn("SlidingPanel: transitionMode is 'custom' but renderCustomItem is not provided");
  }
  if (transitionMode !== "custom" && (!renderReducedItem || !renderFullItem)) {
    console.warn("SlidingPanel: renderReducedItem and renderFullItem are required for non-custom modes");
  }

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
      full: fullModeTopMargin,
      reduced: height - resolvedReducedHeight,
      hidden: height,
    }),
    [height, resolvedReducedHeight, fullModeTopMargin]
  );

  const translateY = useRef(new Animated.Value(snapPoints.hidden)).current;
  const currentTranslateY = useRef(snapPoints.hidden);
  const dragStartY = useRef(snapPoints.hidden);
  const listRef = useRef<FlatList<T>>(null);

  // Progress animé : 0 = reduced, 1 = full
  const transitionProgress = useMemo(() => {
    return translateY.interpolate({
      inputRange: [snapPoints.full, snapPoints.reduced],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
  }, [translateY, snapPoints.full, snapPoints.reduced]);

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
          {renderReducedItem?.(item, itemIndex)}
        </View>
      )}
    />
  );

  const currentItem = data[index];

  // Rendu selon le mode de transition
  const renderContent = () => {
    if (!currentItem) return null;

    // Mode custom : un seul render avec progress
    if (transitionMode === "custom" && renderCustomItem) {
      return (
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.fullScroll}
          contentContainerStyle={styles.fullContent}
          showsVerticalScrollIndicator
          scrollEventThrottle={16}
          onScroll={onScrollFull}
          bounces={true}
        >
          {renderCustomItem(currentItem, index, transitionProgress)}
        </Animated.ScrollView>
      );
    }

    // Mode instant : affichage conditionnel classique
    if (transitionMode === "instant") {
      return (
        <>
          {state === "reduced" && renderReduced()}
          {state === "full" && (
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.fullScroll}
              contentContainerStyle={styles.fullContent}
              showsVerticalScrollIndicator
              scrollEventThrottle={16}
              onScroll={onScrollFull}
              bounces={true}
            >
              {renderFullItem?.(currentItem, index)}
            </Animated.ScrollView>
          )}
        </>
      );
    }

    // Mode crossfade : les deux vues avec opacité animée
    if (transitionMode === "crossfade") {
      const reducedOpacity = transitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      const fullOpacity = transitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      return (
        <>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { opacity: reducedOpacity },
            ]}
            pointerEvents={state === "reduced" ? "auto" : "none"}
          >
            {renderReduced()}
          </Animated.View>

          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { opacity: fullOpacity },
            ]}
            pointerEvents={state === "full" ? "auto" : "none"}
          >
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.fullScroll}
              contentContainerStyle={styles.fullContent}
              showsVerticalScrollIndicator
              scrollEventThrottle={16}
              onScroll={onScrollFull}
              bounces={true}
            >
              {renderFullItem?.(currentItem, index)}
            </Animated.ScrollView>
          </Animated.View>
        </>
      );
    }

    // Mode slide : reduced slide vers le haut, full slide depuis le bas
    if (transitionMode === "slide") {
      const reducedTranslateY = transitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -50],
      });

      const reducedOpacity = transitionProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.5, 0],
      });

      const fullTranslateY = transitionProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      });

      const fullOpacity = transitionProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      });

      return (
        <>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: reducedOpacity,
                transform: [{ translateY: reducedTranslateY }],
              },
            ]}
            pointerEvents={state === "reduced" ? "auto" : "none"}
          >
            {renderReduced()}
          </Animated.View>

          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: fullOpacity,
                transform: [{ translateY: fullTranslateY }],
              },
            ]}
            pointerEvents={state === "full" ? "auto" : "none"}
          >
            <Animated.ScrollView
              ref={scrollViewRef}
              style={styles.fullScroll}
              contentContainerStyle={styles.fullContent}
              showsVerticalScrollIndicator
              scrollEventThrottle={16}
              onScroll={onScrollFull}
              bounces={true}
            >
              {renderFullItem?.(currentItem, index)}
            </Animated.ScrollView>
          </Animated.View>
        </>
      );
    }

    return null;
  };

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

        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
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
  contentContainer: {
    flex: 1,
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
