import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Activity, Zap, Moon, Utensils, Heart, TrendingUp } from 'lucide-react-native';

const HealthMetricCard = ({ title, value, unit, icon: Icon, color, correlation }: any) => (
  <TouchableOpacity style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <View style={styles.metricBody}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
    {correlation && (
      <View style={styles.correlationBadge}>
        <TrendingUp color="#4CD964" size={14} />
        <Text style={styles.correlationText}>{correlation}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function HealthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>LE LABORATOIRE</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyse de Corrélation</Text>
          <View style={styles.metricsGrid}>
            <HealthMetricCard
              title="Sommeil & Activité"
              value="8.2"
              unit="h"
              icon={Moon}
              color="#5856D6"
              correlation="+15% qualité"
            />
            <HealthMetricCard
              title="BPM & Stress"
              value="62"
              unit="bpm"
              icon={Heart}
              color="#FF2D55"
              correlation="-5% vs hier"
            />
            <HealthMetricCard
              title="V02 Max"
              value="48"
              unit="ml/kg"
              icon={Zap}
              color="#FF9500"
            />
            <HealthMetricCard
              title="Nutrition"
              value="2100"
              unit="kcal"
              icon={Utensils}
              color="#4CD964"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plans d'Action IA</Text>
          <TouchableOpacity style={styles.actionPlanCard}>
            <View style={styles.actionPlanContent}>
              <Text style={styles.actionPlanTitle}>Protocole Sommeil Profond</Text>
              <Text style={styles.actionPlanDesc}>Basé sur votre baisse de magnésium et votre activité tardive.</Text>
            </View>
            <Zap color="#FFCC00" size={24} fill="#FFCC00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionPlanCard}>
            <View style={styles.actionPlanContent}>
              <Text style={styles.actionPlanTitle}>Rééquilibrage Métabolique</Text>
              <Text style={styles.actionPlanDesc}>Optimisation de l'apport en glucides pour vos séances de cardio.</Text>
            </View>
            <Activity color="#007AFF" size={24} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F6',
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  metricBody: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  metricUnit: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  correlationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FFF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 4,
  },
  correlationText: {
    fontSize: 10,
    color: '#4CD964',
    fontWeight: '700',
  },
  actionPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionPlanContent: {
    flex: 1,
  },
  actionPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  actionPlanDesc: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
});
