import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  Animated,
  Dimensions,
} from "react-native";
import PagerView from "react-native-pager-view";

const screenWidth = Dimensions.get("window").width;
export type SwipeTabItem = {
  title?: string;
  icon?: string | ((props: { color: string; size: number }) => React.ReactNode);
  iconSelected?: string | ((props: { color: string; size: number }) => React.ReactNode);

  style?: ViewStyle;
  activeStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
  indicatorStyle?: ViewStyle;

  iconColor?: string;
  activeIconColor?: string;
  iconSize?: number;

  component: React.ReactNode;
};

type Props = {
  screens: SwipeTabItem[];
  initialIndex?: number;
  showTabBar?: boolean;
  tabBarPosition?: "top" | "bottom";
  showSelectedIndicator?: boolean;
  onIndexChange?: (index: number) => void;
  
  // Styles globaux
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;

  iconColor?: string;
  activeIconColor?: string;
  iconSize?: number;
};

export default function SwipeTabs(props: Props) {
  const {
    screens,
    initialIndex = 0,
    showTabBar = true,
    tabBarPosition = "top",
    showSelectedIndicator = true,
    onIndexChange,
    tabBarStyle,
    tabStyle,
    indicatorStyle,
    textStyle,
    activeTextStyle,
    iconColor = "#666",
    activeIconColor = "#000",
    iconSize = 22,
  } = props;

  const pagerRef = useRef<PagerView>(null);
  const [index, setIndex] = useState(initialIndex);

  // Animated values
  const pageIndex = useRef(new Animated.Value(initialIndex)).current; // integer page
  const scrollOffset = useRef(new Animated.Value(0)).current; // offset 0..1

  // geometry
  const tabWidth = screenWidth / screens.length;
  const indicatorWidth = tabWidth * 0.6;
  const indicatorCenterOffset = (tabWidth - indicatorWidth) / 2; // center under tab

  // translateX = (pageIndex + scrollOffset) * tabWidth + centerOffset
  const combined = Animated.add(pageIndex, scrollOffset); // animated node
  const translateX = Animated.add(
    Animated.multiply(combined, tabWidth),
    indicatorCenterOffset
  );

  useEffect(() => {
    // keep state index and pageIndex in sync initially
    pageIndex.setValue(initialIndex);
    setIndex(initialIndex);
  }, [initialIndex, pageIndex]);

  const handleChange = (i: number) => {
    pagerRef.current?.setPage(i);   // animation native
    onIndexChange?.(i);
  };

  const maxIconSize = Math.max(
    ...screens.map((s) => s.iconSize ?? iconSize ?? 22)
  );
  const iconContainerHeight = maxIconSize + 2;

  const renderIcon = (screen: SwipeTabItem, active?: boolean): React.ReactNode => {
    const icon = active && screen.iconSelected ? screen.iconSelected : screen.icon;
    if (!icon) return null;
    const color = active
      ? screen.activeIconColor ?? activeIconColor ?? "#000"
      : screen.iconColor ?? iconColor ?? "#666";
    const size = screen.iconSize ?? iconSize ?? 22;
    if (typeof icon === "string") {
      return (
        <Text style={{ fontSize: size, color, opacity: active ? 1 : 0.5 }}>
          {icon}
        </Text>
      );
    }
    return icon({ color, size });
  };

  // Fonction pour extraire la couleur de l'indicateur
  const getIndicatorColor = (tabIndex: number): string => {
    const tab = screens[tabIndex];
    if (tab?.indicatorStyle && 'backgroundColor' in tab.indicatorStyle) {
      return tab.indicatorStyle.backgroundColor as string;
    }
    if (indicatorStyle && 'backgroundColor' in indicatorStyle) {
      return indicatorStyle.backgroundColor as string;
    }
    return "#000"; // Couleur par défaut
  };

  // Créer l'interpolation de couleur
  const interpolateColor = () => {
    if (screens.length === 1) {
      return getIndicatorColor(0);
    }

    const inputRange: number[] = [];
    const outputRange: string[] = [];

    screens.forEach((_, i) => {
      inputRange.push(i);
      outputRange.push(getIndicatorColor(i));
    });

    return combined.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
  };

  const backgroundColor = interpolateColor();

  // Build tabBar
  const tabBar = (
    <View style={[styles.tabBar, tabBarStyle]}>
      {screens.map((tab, i) => {
        const active = i === index;
        const hasTitle = !!tab.title;
        const hasIcon = !!(tab.icon || tab.iconSelected);

        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleChange(i)}
            style={[styles.tab, tabStyle, tab.style, active && tab.activeStyle]}
          >
            <View style={styles.tabContent}>
              {hasIcon && (
                <View
                  style={[
                    styles.iconContainer,
                    { minHeight: iconContainerHeight },
                    hasTitle && styles.iconWithTitle,
                  ]}
                >
                  {renderIcon(tab, active)}
                </View>
              )}
              {hasTitle && (
                <Text
                  style={[
                    styles.tabText,
                    textStyle,
                    tab.textStyle,
                    active && [
                      styles.activeTabText,
                      activeTextStyle,
                      tab.activeTextStyle,
                    ],
                  ]}
                >
                  {tab.title}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Single animated indicator overlay */}
      {
      showSelectedIndicator && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeIndicator,
            indicatorStyle,                 // global
            screens[index]?.indicatorStyle, // local
            {
              width: indicatorWidth,
              backgroundColor, // Couleur interpolée !
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {showTabBar && tabBarPosition === "top" && tabBar}
      <PagerView
        style={{ flex: 1 }}
        ref={pagerRef}
        initialPage={initialIndex}
        onPageSelected={(e) => {
          const pos = e.nativeEvent.position;
          setIndex(pos);
          onIndexChange?.(pos);
        }}
        onPageScroll={(e) => {
          // position: nearest integer page, offset: 0..1
          const { position, offset } = e.nativeEvent;
          // update animated values
          pageIndex.setValue(position);
          scrollOffset.setValue(offset);
        }}
      >
        {screens.map((tab, i) => (
          <View key={i} style={{ flex: 1 }}>
            {tab.component}
          </View>
        ))}
      </PagerView>
      {showTabBar && tabBarPosition === "bottom" && tabBar}
    </View>
  );
}

// styles (slightly adjusted for indicator overlay)
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative", // important for absolutely positioned indicator
  },
  tab: {
    backgroundColor: "transparent",
    flex: 1,
    position: "relative",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWithTitle: {
    marginBottom: 2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0, // left is handled by translateX
    height: 2,
    backgroundColor: "#000",
    borderRadius: 1,
  },
  tabText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
});
