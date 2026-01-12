import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import ThemedText from "@themedComponents/ThemedText";

interface GenericHeaderProps {
  title: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  style?: ViewStyle;
}

export default function GenericHeader({
  title,
  leftButton,
  rightButton,
  style,
}: GenericHeaderProps) {

  return (
    <View style={[styles.header, style]}>
      {/* Icône gauche */}
      <View style={styles.iconContainer}>
        { leftButton ? leftButton : <View style={styles.placeholder} />}
      </View>

      {/* Titre */}
      <ThemedText style={styles.title}>{title}</ThemedText>

      {/* Icône droite */}
      <View style={styles.iconContainer}>
        { rightButton ? rightButton : <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40
  },
  iconContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
});
