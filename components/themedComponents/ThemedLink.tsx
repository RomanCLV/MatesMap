import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Link, LinkProps } from "expo-router";

import { useTheme } from "@hooks/useTheme";

type ThemedLinkProps = LinkProps & {
  style?: StyleProp<TextStyle>;
  underline?: boolean;
};

const ThemedLink: React.FC<ThemedLinkProps> = ({
  style,
  underline = false,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Link
      {...props}
      style={[
        {
          color: theme.brand.primary,
          textDecorationLine: underline ? "underline" : "none",
          fontWeight: "500",
        },
        style,
      ]}
    />
  );
};

export default ThemedLink;
