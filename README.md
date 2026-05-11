# DeepVital - Intelligence Biomédicale Personnelle

DeepVital est une application mobile de santé révolutionnaire conçue avec React Native Expo. Elle centralise toutes vos données biomédicales via Health Connect et les transforme en analyses exploitables grâce à une intelligence artificielle hybride (Gemini + Modèles Locaux).

## 🚀 Fonctionnalités Clés

- **Centralisation Totale** : Accès à plus de 15 métriques de santé (V02max, Sommeil, BPM, SpO2, Nutrition, etc.) via Health Connect.
- **Intelligence Artificielle Hybride** :
  - **Mode Performance** : Utilise Gemini 1.5 Flash pour des analyses croisées complexes.
  - **Mode Confidentialité** : Support pour modèles locaux (Llama 3.2, Gemma) pour une vie privée totale.
- **Database Agent (Style Camel AI)** : Une IA capable d'interroger votre base de données SQLite locale pour répondre à des questions précises sur vos tendances de santé.
- **Design Minimaliste Apple** : Une interface fluide avec support complet du Mode Sombre (Dark Mode) et graphiques techniques haute précision.
- **Onboarding Stratégique** : 20 questions clés pour personnaliser votre expérience dès le premier jour.

## 🛠 Stack Technique

- **Framework** : Expo (React Native)
- **Navigation** : Expo Router (Tabs)
- **Base de données** : SQLite (`expo-sqlite`)
- **Santé** : `react-native-health-connect`
- **IA** : Google Generative AI (Gemini) & `react-native-llama` (plumbing)
- **Graphiques** : `react-native-wagmi-charts`

## 📦 Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-compte/DeepVital.git
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre clé API Gemini dans un fichier `.env` :
   ```env
   GEMINI_API_KEY=votre_cle_ici
   ```

4. Lancez le projet :
   ```bash
   npx expo start
   ```

## 🔐 Confidentialité

DeepVital est conçu avec une approche "Privacy-First". Vos données de santé brutes ne quittent jamais votre téléphone si vous activez le mode IA locale. En mode Cloud, les données sont traitées de manière éphémère par l'API Gemini sans stockage persistant sur leurs serveurs.

---
*DeepVital n'est pas un dispositif médical. Consultez toujours un professionnel de santé pour tout diagnostic.*
