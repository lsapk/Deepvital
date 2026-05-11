import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, LogOut, Moon, Sun, Info } from 'lucide-react-native';
import { useTheme } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

export default function MoreScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: async () => await signOut() }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>PARAMÈTRES</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
             <User color="#FFF" size={32} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.email || "Utilisateur"}</Text>
            <Text style={[styles.profileStatus, { color: theme.secondaryText }]}>Membre Premium</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>COMPTE</Text>
          <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}>
            <View style={styles.itemLeft}>
              <User size={20} color={theme.text} />
              <Text style={[styles.itemText, { color: theme.text }]}>Profil Personnel</Text>
            </View>
            <Info size={18} color={theme.border} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}>
            <View style={styles.itemLeft}>
              <Bell size={20} color={theme.text} />
              <Text style={[styles.itemText, { color: theme.text }]}>Notifications</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>PRÉFÉRENCES</Text>
          <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}>
            <View style={styles.itemLeft}>
              <Sun size={20} color={theme.text} />
              <Text style={[styles.itemText, { color: theme.text }]}>Thème</Text>
            </View>
            <Text style={[styles.itemValue, { color: theme.secondaryText }]}>Système</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, { backgroundColor: theme.card }]}>
            <View style={styles.itemLeft}>
              <Shield size={20} color={theme.text} />
              <Text style={[styles.itemText, { color: theme.text }]}>Confidentialité</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: theme.border }]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: theme.secondaryText }]}>DeepVital v1.0.0 (Stable)</Text>
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 12,
  }
});
