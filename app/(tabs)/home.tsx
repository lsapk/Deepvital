import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityRing } from '@/components/ui/ActivityRing';
import { User, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { HealthService } from '@/services/health';
import { getDatabase } from '@/services/database';
import { useTheme } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type MetricData = { timestamp: number; value: number };

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeMetric, setActiveMetric] = useState<'HeartRate' | 'OxygenSaturation' | 'SleepSession'>('HeartRate');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartData, setChartData] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rings, setRings] = useState({ energy: 0, sleep: 0, sport: 0 });

  const fetchRealData = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch chart data
      const records = await db.getAllAsync<{ timestamp: string; value: number }>(
        'SELECT timestamp, value FROM health_logs WHERE type = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp ASC',
        [activeMetric, startOfDay.toISOString(), endOfDay.toISOString()]
      );

      const formattedData = records.map(r => ({
        timestamp: new Date(r.timestamp).getTime(),
        value: r.value
      }));
      setChartData(formattedData);

      // Calculate Rings (Energy, Sleep, Sport)
      // Energy: Calories burned / Target (2500)
      const energyData = await db.getFirstAsync<{ total: number }>(
        'SELECT SUM(value) as total FROM health_logs WHERE type = ? AND timestamp BETWEEN ? AND ?',
        ['ActiveCaloriesBurned', startOfDay.toISOString(), endOfDay.toISOString()]
      );

      // Sleep: Sleep duration in minutes / Target (8h = 480min)
      const sleepData = await db.getFirstAsync<{ total: number }>(
        'SELECT SUM(value) as total FROM health_logs WHERE type = ? AND timestamp BETWEEN ? AND ?',
        ['SleepSession', startOfDay.toISOString(), endOfDay.toISOString()]
      );

      // Sport: Active minutes (ExerciseSession) / Target (60 min)
      const sportData = await db.getFirstAsync<{ total: number }>(
        'SELECT SUM(value) as total FROM health_logs WHERE type = ? AND timestamp BETWEEN ? AND ?',
        ['ExerciseSession', startOfDay.toISOString(), endOfDay.toISOString()]
      );

      setRings({
        energy: Math.min(Math.round(((energyData?.total || 0) / 2500) * 100), 100),
        sleep: Math.min(Math.round(((sleepData?.total || 0) / 480) * 100), 100),
        sport: Math.min(Math.round(((sportData?.total || 0) / 60) * 100), 100),
      });

    } catch (error) {
      console.error("Error fetching real data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeMetric, currentDate]);

  useEffect(() => {
    async function syncAndFetch() {
      try {
        const isReady = await HealthService.setup();
        if (isReady) {
          await HealthService.requestPermissions();
          await HealthService.syncData();
        }
      } catch (error) {
        console.warn("Health sync degraded:", error);
      } finally {
        fetchRealData();
      }
    }
    syncAndFetch();
  }, [fetchRealData]);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const cycleMetric = (dir: number) => {
    const metrics: ('HeartRate' | 'OxygenSaturation' | 'SleepSession')[] = ['HeartRate', 'OxygenSaturation', 'SleepSession'];
    const currIndex = metrics.indexOf(activeMetric);
    const nextIndex = (currIndex + dir + metrics.length) % metrics.length;
    setActiveMetric(metrics[nextIndex]);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getMetricLabel = (m: string) => {
    if (m === 'HeartRate') return 'BPM';
    if (m === 'OxygenSaturation') return 'SpO2';
    if (m === 'SleepSession') return 'SLEEP';
    return m;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>DEEPVITAL</Text>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: theme.border }]}
            onPress={() => router.push('/(tabs)/more')}
          >
            <User color={theme.secondaryText} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate(-1)}>
            <ChevronLeft color={theme.text} size={20} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(currentDate)}</Text>
          <TouchableOpacity
            onPress={() => changeDate(1)}
            disabled={currentDate.toDateString() === new Date().toDateString()}
          >
            <ChevronRight color={currentDate.toDateString() === new Date().toDateString() ? theme.border : theme.text} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.ringsContainer}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
            <ActivityRing percentage={rings.energy} color="#FF9500" label="Energy" size={100} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
            <ActivityRing percentage={rings.sleep} color="#5856D6" label="Sleep" size={100} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/health')}>
            <ActivityRing percentage={rings.sport} color="#4CD964" label="Sport" size={100} />
          </TouchableOpacity>
        </View>

        <View style={[styles.insightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.insightTitle, { color: theme.text }]}>Daily Insight</Text>
          {isLoading ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Text style={[styles.insightText, { color: theme.text }]}>
              {rings.energy > 50
                ? "Excellent niveau d'activité aujourd'hui ! Continue comme ça."
                : "N'oublie pas de bouger un peu plus pour atteindre tes objectifs d'énergie."}
            </Text>
          )}
        </View>

        <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
          <View style={styles.chartHeader}>
            <TouchableOpacity
              onPress={() => cycleMetric(-1)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft color={theme.secondaryText} size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => cycleMetric(1)}>
              <Text style={[styles.chartTitle, { color: theme.text }]}>{getMetricLabel(activeMetric)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cycleMetric(1)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronRight color={theme.secondaryText} size={20} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.emptyChart}>
               <ActivityIndicator color={theme.primary} />
            </View>
          ) : chartData.length > 1 ? (
            <LineChart.Provider data={chartData}>
              <LineChart height={150} width={width - 80}>
                <LineChart.Path color={theme.accent}>
                   <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair color={theme.accent} />
              </LineChart>
            </LineChart.Provider>
          ) : (
            <View style={styles.emptyChart}>
              <AlertCircle color={theme.secondaryText} size={32} />
              <Text style={[styles.emptyText, { color: theme.secondaryText }]}>Pas de données disponibles pour cette période</Text>
            </View>
          )}

          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>00:00</Text>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>12:00</Text>
            <Text style={[styles.chartLabelText, { color: theme.secondaryText }]}>23:59</Text>
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
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
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
    gap: 15,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 100,
    textAlign: 'center',
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
    minHeight: 250,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'center',
  },
  emptyChart: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
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
