import { StyleSheet } from "react-native"
import React from "react"
import ThemedText from "@themedComponents/ThemedText"

type Props = {
  title: string;
};

const TitlePage = ({ title }: Props) => <ThemedText style={styles.title}>{title}</ThemedText>;

export default TitlePage;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
