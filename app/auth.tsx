import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '@/services/supabase';
import { useTheme } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  async function handleAuth() {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert('Succès', 'Vérifiez votre email pour confirmer votre compte !');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>DeepVital</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {isSignUp ? 'Créez votre compte santé' : 'Bienvenue dans votre laboratoire personnel'}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Email"
            placeholderTextColor={theme.secondaryText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder="Mot de passe"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <Text style={styles.buttonText}>{isSignUp ? 'S\'inscrire' : 'Se connecter'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchButton}>
            <Text style={[styles.switchText, { color: theme.primary }]}>
              {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    gap: 15,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
