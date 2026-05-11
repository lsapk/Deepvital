import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Zap, Settings, ChevronRight, Info } from 'lucide-react-native';
import { getDatabase } from '@/services/database';
import { useTheme } from '@/constants/Colors';

const SettingItem = ({ icon: Icon, title, value, type = 'link', onValueChange, theme }: any) => (
  <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} disabled={type === 'switch'}>
    <View style={styles.settingLeft}>
      <View style={[styles.iconContainer, { backgroundColor: theme.border }]}>
        <Icon color={theme.text} size={20} />
      </View>
      <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
    </View>
    <View style={styles.settingRight}>
      {type === 'link' && <ChevronRight color={theme.secondaryText} size={20} />}
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
        />
      )}
      {type === 'text' && <Text style={[styles.settingValueText, { color: theme.secondaryText }]}>{value}</Text>}
    </View>
  </TouchableOpacity>
);

export default function MoreScreen() {
  const [isLocalIA, setIsLocalIA] = useState(false);
  const theme = useTheme();

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>PARAMÈTRES</Text>

        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <View style={styles.profileInfo}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.border }]}>
              <User color={theme.secondaryText} size={40} />
            </View>
            <View>
              <Text style={[styles.userName, { color: theme.text }]}>Utilisateur DeepVital</Text>
              <Text style={[styles.userBio, { color: theme.secondaryText }]}>Optimisation Longévité</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.border }]}>
            <Text style={[styles.editButtonText, { color: theme.text }]}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.secondaryText }]}>INTELLIGENCE ARTIFICIELLE</Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
            <SettingItem
              icon={Shield}
              title="Mode Confidentialité (IA Locale)"
              type="switch"
              value={isLocalIA}
              onValueChange={toggleLocalIA}
              theme={theme}
            />
            <SettingItem
              icon={Zap}
              title="Modèle"
              type="text"
              value={isLocalIA ? "Llama 3.2 1B" : "Gemini 1.5 Flash"}
              theme={theme}
            />
            <SettingItem
              icon={Settings}
              title="Personnalité du Coach"
              type="text"
              value="Scientifique"
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.secondaryText }]}>DONNÉES & SOURCES</Text>
          <View style={[styles.settingsGroup, { backgroundColor: theme.card }]}>
            <SettingItem icon={Shield} title="Santé Connect" type="text" value="Connecté" theme={theme} />
            <SettingItem icon={Info} title="Exporter mes données (JSON)" theme={theme} />
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
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  profileSection: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userBio: {
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingsGroup: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 14,
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
