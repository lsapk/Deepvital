import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, TrendingUp, FlaskConical, ChevronRight, Database, History } from 'lucide-react-native';
import { useTheme } from '@/constants/Colors';
import { getDatabase } from '@/services/database';

export default function HealthScreen() {
  const theme = useTheme();
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'insights' | 'raw'>('insights');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = await getDatabase();

      // 1. Fetch Correlations (Simplified logic for now)
      const logs = await db.getAllAsync('SELECT * FROM health_logs ORDER BY timestamp DESC LIMIT 50');
      setRawLogs(logs);

      // AI-like Correlation detection (Dummy logic that checks if data exists)
      const hrvData = logs.filter(l => l.type === 'HeartRateVariabilityRmssd');
      const sleepData = logs.filter(l => l.type === 'SleepSession');

      const foundCorrelations = [];
      if (hrvData.length > 0 && sleepData.length > 0) {
        foundCorrelations.push({
          title: "HRV vs Sommeil",
          description: "Ta variabilité cardiaque est 15% plus élevée après une nuit de plus de 7h.",
          impact: "Positif",
          score: 92
        });
      }

      if (logs.filter(l => l.type === 'Steps').length > 5) {
        foundCorrelations.push({
          title: "Activité vs BPM",
          description: "Ton rythme cardiaque au repos diminue les jours de forte activité.",
          impact: "Excellent",
          score: 88
        });
      }

      setCorrelations(foundCorrelations);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderRawItem = ({ item }: { item: any }) => (
    <View style={[styles.rawItem, { borderBottomColor: theme.border }]}>
      <View>
        <Text style={[styles.rawType, { color: theme.text }]}>{item.type}</Text>
        <Text style={[styles.rawTime, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleString('fr-FR')}
        </Text>
      </View>
      <Text style={[styles.rawValue, { color: theme.primary }]}>
        {item.value} <Text style={styles.rawUnit}>{item.unit}</Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>LABORATOIRE</Text>
        <View style={[styles.toggleContainer, { backgroundColor: theme.card }]}>
           <TouchableOpacity
             style={[styles.toggleBtn, view === 'insights' && { backgroundColor: theme.primary }]}
             onPress={() => setView('insights')}
           >
             <Brain size={16} color={view === 'insights' ? '#FFF' : theme.secondaryText} />
             <Text style={[styles.toggleText, { color: view === 'insights' ? '#FFF' : theme.secondaryText }]}>Insights</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={[styles.toggleBtn, view === 'raw' && { backgroundColor: theme.primary }]}
             onPress={() => setView('raw')}
           >
             <Database size={16} color={view === 'raw' ? '#FFF' : theme.secondaryText} />
             <Text style={[styles.toggleText, { color: view === 'raw' ? '#FFF' : theme.secondaryText }]}>Données</Text>
           </TouchableOpacity>
        </View>
      </View>

      {view === 'insights' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Corrélations IA</Text>
            </View>

            {isLoading ? (
              <ActivityIndicator color={theme.primary} />
            ) : correlations.length > 0 ? (
              correlations.map((item, index) => (
                <View key={index} style={[styles.card, { backgroundColor: theme.card }]}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                    <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
                      <Text style={[styles.badgeText, { color: theme.primary }]}>{item.score}% match</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardDesc, { color: theme.secondaryText }]}>{item.description}</Text>
                </View>
              ))
            ) : (
              <View style={[styles.card, { backgroundColor: theme.card, alignItems: 'center' }]}>
                 <Brain size={40} color={theme.border} />
                 <Text style={[styles.cardDesc, { color: theme.secondaryText, marginTop: 10, textAlign: 'center' }]}>
                   Pas assez de données pour établir des corrélations.
                 </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FlaskConical size={20} color={theme.accent} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Plans d'Action IA</Text>
            </View>

            <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.actionRow}>
                <View>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>Optimisation Sommeil</Text>
                  <Text style={[styles.cardDesc, { color: theme.secondaryText }]}>Protocole basé sur ton HRV actuel</Text>
                </View>
                <ChevronRight color={theme.secondaryText} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.rawContainer}>
          <FlatList
            data={rawLogs}
            renderItem={renderRawItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.rawListContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <History size={48} color={theme.border} />
                <Text style={{ color: theme.secondaryText, marginTop: 10 }}>Aucune donnée brute trouvée</Text>
              </View>
            }
          />
        </View>
      )}
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
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rawContainer: {
    flex: 1,
  },
  rawListContent: {
    paddingBottom: 120,
  },
  rawItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  rawType: {
    fontSize: 14,
    fontWeight: '700',
  },
  rawTime: {
    fontSize: 12,
    marginTop: 2,
  },
  rawValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  rawUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  }
});
