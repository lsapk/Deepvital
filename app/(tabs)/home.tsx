import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityRing } from '@/components/ui/ActivityRing';
import { User, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { HealthService } from '@/services/health';
import { useTheme } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Dummy data for visual development
const dummyData = [
  { timestamp: 1, value: 65 },
  { timestamp: 2, value: 72 },
  { timestamp: 3, value: 68 },
  { timestamp: 4, value: 85 },
  { timestamp: 5, value: 78 },
  { timestamp: 6, value: 92 },
  { timestamp: 7, value: 70 },
];

export default function HomeScreen() {
  const theme = useTheme();

  useEffect(() => {
    async function syncHealth() {
      try {
        const isReady = await HealthService.setup();
        if (isReady) {
          await HealthService.requestPermissions();
          await HealthService.syncData();
        }
      } catch (error) {
        console.error("Health sync error on mount:", error);
      }
    }
    syncHealth();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>HOME</Text>
          <TouchableOpacity style={[styles.profileButton, { backgroundColor: theme.border }]}>
            <User color={theme.secondaryText} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateSelector}>
          <ChevronLeft color={theme.text} size={20} />
          <Text style={[styles.dateText, { color: theme.text }]}>Today</Text>
          <ChevronRight color={theme.text} size={20} />
        </View>

        <View style={styles.ringsContainer}>
          <ActivityRing percentage={98} color="#FF9500" label="Energy" size={100} />
          <ActivityRing percentage={91} color="#5856D6" label="Sleep" size={100} />
          <ActivityRing percentage={89} color="#4CD964" label="Sport" size={100} />
        </View>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightTitle, { color: theme.text }]}>Al Insight</Text>
          <Text style={[styles.insightText, { color: theme.text }]}>
            "Ton énergie est à 92%, idéal pour une séance intense ce soir. Ton sommeil profond a augmenté de 15%."
          </Text>
        </View>

        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <View style={styles.chartHeader}>
            <ChevronLeft color={theme.secondaryText} size={20} />
            <Text style={[styles.chartTitle, { color: theme.text }]}>BPM</Text>
            <ChevronRight color={theme.secondaryText} size={20} />
          </View>

          <LineChart.Provider data={dummyData}>
            <LineChart height={150} width={width - 80}>
              <LineChart.Path color={theme.accent} />
              <LineChart.CursorCrosshair color={theme.accent} />
            </LineChart>
          </LineChart.Provider>

          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>2R</Text>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>1h30</Text>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>15H</Text>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>NOW</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  insightCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
