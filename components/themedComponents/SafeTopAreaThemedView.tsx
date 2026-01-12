import React from "react";
import { ViewProps, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemedView from "./ThemedView";

type SafeTopAreaThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const SafeTopAreaThemedView: React.FC<SafeTopAreaThemedViewProps> = ({ style, ...props }) => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={[{ paddingTop: insets.top }, style]}
      {...props}
    />
  );
};

export default SafeTopAreaThemedView;
