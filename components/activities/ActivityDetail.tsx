// components/activities/ActivityDetail.tsx
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import ThemedText from "@themedComponents/ThemedText";
import ThemedView from "@themedComponents/ThemedView";
import { Activity, SPORT_ICONS, SPORT_LABELS } from "types/activity";
import { useSportDisplayConfig } from "@hooks/useSportConfig";

interface ActivityDetailProps {
  activity: Activity;
}

export function ActivityDetail({ activity }: ActivityDetailProps) {
  const config = useSportDisplayConfig(activity.sport);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Hero section */}
        <View style={styles.hero}>
          <ThemedText style={styles.sportIcon}>
            {SPORT_ICONS[activity.sport]}
          </ThemedText>
          <ThemedText style={styles.sportLabel}>
            {SPORT_LABELS[activity.sport]}
          </ThemedText>
          <ThemedText style={styles.title}>{activity.name}</ThemedText>
          {config.summary && (
            <ThemedText style={styles.summary}>
              {config.summary(activity)}
            </ThemedText>
          )}
        </View>

        {/* Description */}
        {activity.description && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>
              {activity.description}
            </ThemedText>
          </View>
        )}

        {/* Statistiques détaillées */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Statistiques</ThemedText>
          <View style={styles.statsGrid}>
            {Object.entries(config.fields).map(([key, fieldConfig]) => {
              const value = (activity as any)[key];
              if (value === undefined || value === null || fieldConfig.hidden) {
                return null;
              }

              return (
                <View key={key} style={styles.statItem}>
                  <View style={styles.statHeader}>
                    {fieldConfig.icon && (
                      <ThemedText style={styles.statIcon}>
                        {fieldConfig.icon}
                      </ThemedText>
                    )}
                    <ThemedText style={styles.statLabel}>
                      {fieldConfig.label}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.statValue}>
                    {fieldConfig.format ? fieldConfig.format(value) : value}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Localisation</ThemedText>
          <View style={styles.locationCard}>
            <ThemedText style={styles.locationIcon}>📍</ThemedText>
            <View style={styles.locationText}>
              <ThemedText style={styles.locationLabel}>
                Coordonnées
              </ThemedText>
              <ThemedText style={styles.locationValue}>
                {activity.location.lat.toFixed(6)}, {activity.location.lng.toFixed(6)}
              </ThemedText>
            </View>
          </View>
          {/* TODO: Ajouter une mini-map ici si nécessaire */}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  sportIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  sportLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  summary: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  statsGrid: {
    gap: 12,
  },
  statItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  locationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
