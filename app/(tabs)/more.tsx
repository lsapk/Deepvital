import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { User, Shield, Zap, Settings, ChevronRight, Info } from 'lucide-react-native';
import { getDatabase } from '@/services/database';

const SettingItem = ({ icon: Icon, title, value, type = 'link', onValueChange }: any) => (
  <TouchableOpacity style={styles.settingItem} disabled={type === 'switch'}>
    <View style={styles.settingLeft}>
      <View style={styles.iconContainer}>
        <Icon color="#1C1C1E" size={20} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <View style={styles.settingRight}>
      {type === 'link' && <ChevronRight color="#C7C7CC" size={20} />}
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
        />
      )}
      {type === 'text' && <Text style={styles.settingValueText}>{value}</Text>}
    </View>
  </TouchableOpacity>
);

export default function MoreScreen() {
  const [isLocalIA, setIsLocalIA] = useState(false);

  useEffect(() => {
    async function load() {
      const db = await getDatabase();
      const res = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['ai_local_mode']);
      if (res) setIsLocalIA(res.value === 'true');
    }
    load();
  }, []);

  const toggleLocalIA = async (val: boolean) => {
    setIsLocalIA(val);
    const db = await getDatabase();
    await db.runAsync('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', ['ai_local_mode', val.toString()]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>PARAMÈTRES</Text>

        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarLarge}>
              <User color="#8E8E93" size={40} />
            </View>
            <View>
              <Text style={styles.userName}>Utilisateur Oasis</Text>
              <Text style={styles.userBio}>Optimisation Longévité</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTELLIGENCE ARTIFICIELLE</Text>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={Shield}
              title="Mode Confidentialité (IA Locale)"
              type="switch"
              value={isLocalIA}
              onValueChange={toggleLocalIA}
            />
            <SettingItem
              icon={Zap}
              title="Modèle"
              type="text"
              value={isLocalIA ? "Llama 3.2 1B" : "Gemini 1.5 Flash"}
            />
            <SettingItem
              icon={Settings}
              title="Personnalité du Coach"
              type="text"
              value="Scientifique"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DONNÉES & SOURCES</Text>
          <View style={styles.settingsGroup}>
            <SettingItem icon={Shield} title="Santé Connect" type="text" value="Connecté" />
            <SettingItem icon={Info} title="Exporter mes données (JSON)" />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Réinitialiser l'application</Text>
        </TouchableOpacity>
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
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  userBio: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 10,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  logoutButton: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
