import React from "react";
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@hooks/useTheme";

type ThemedViewProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const ThemedView : React.FC<ThemedViewProps> = ({ style, ...props }) => {
  const theme = useTheme();
  return (
    <View
      {...props}
       style={[{ backgroundColor: theme.background.primary }, style]}
    />
  );
}

export default ThemedView;
