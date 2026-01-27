// components/activities/CardActivity.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedText from "@themedComponents/ThemedText";
import ThemedView from "@themedComponents/ThemedView";
import { Activity, SPORT_ICONS } from "types/activity";
import { useSportDisplayConfig } from "@hooks/useSportConfig";

interface CardActivityProps {
  activity: Activity;
  onPress?: () => void;
}

export function CardActivity({ activity, onPress }: CardActivityProps) {
  const config = useSportDisplayConfig(activity.sport);

  // Récupérer les 2-3 champs les plus importants pour la card
  const mainFields = Object.entries(config.fields)
    .filter(([_, fieldConfig]) => !fieldConfig.hidden)
    .slice(0, 3);

  return (
    <ThemedView style={styles.card}>
      {/* Header avec sport icon */}
      <View style={styles.header}>
        <ThemedText style={styles.sportIcon}>
          {SPORT_ICONS[activity.sport]}
        </ThemedText>
        <View style={styles.headerText}>
          <ThemedText style={styles.title}>{activity.name}</ThemedText>
          <ThemedText style={styles.description} numberOfLines={1}>
            {activity.description}
          </ThemedText>
        </View>
      </View>

      {/* Résumé rapide */}
      {config.summary && (
        <ThemedText style={styles.summary}>
          {config.summary(activity)}
        </ThemedText>
      )}

      {/* Détails principaux */}
      <View style={styles.details}>
        {mainFields.map(([key, fieldConfig]) => {
          const value = (activity as any)[key];
          if (value === undefined || value === null) return null;

          return (
            <View key={key} style={styles.detailItem}>
              {fieldConfig.icon && (
                <ThemedText style={styles.detailIcon}>
                  {fieldConfig.icon}
                </ThemedText>
              )}
              <View style={styles.detailText}>
                <ThemedText style={styles.detailLabel}>
                  {fieldConfig.label}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {fieldConfig.format ? fieldConfig.format(value) : value}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sportIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  summary: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    opacity: 0.9,
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "45%",
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
