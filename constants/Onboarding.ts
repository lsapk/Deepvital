export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'select' | 'text' | 'number' | 'multi-select';
  options?: string[];
  category: 'biometry' | 'metabolism' | 'lifestyle' | 'goals' | 'history';
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'goal_priority',
    question: 'Quel est votre objectif prioritaire ?',
    type: 'select',
    options: ['Longévité', 'Performance sportive', 'Perte de poids', 'Réduction du stress', 'Santé mentale'],
    category: 'goals'
  },
  {
    id: 'metabolism_type',
    question: 'Comment décririez-vous votre métabolisme ?',
    type: 'select',
    options: ['Tendance à prendre du poids facilement', 'Métabolisme rapide (toujours "électrique")', 'Équilibré'],
    category: 'metabolism'
  },
  {
    id: 'diet_type',
    question: 'Quel est votre régime alimentaire principal ?',
    type: 'select',
    options: ['Omnivore', 'Végétalien (Vegan)', 'Keto', 'Jeûne intermittent', 'Végétarien'],
    category: 'lifestyle'
  },
  {
    id: 'sleep_quality',
    question: 'Comment évaluez-vous la qualité de votre sommeil ?',
    type: 'select',
    options: ['Excellent', 'Bon, mais peut mieux faire', 'Fatigué au réveil', 'Insomnies fréquentes'],
    category: 'lifestyle'
  },
  {
    id: 'stress_level',
    question: 'Quel est votre niveau de stress professionnel (1 à 10) ?',
    type: 'number',
    category: 'lifestyle'
  },
  {
    id: 'stimulants',
    question: 'Consommez-vous des stimulants ?',
    type: 'multi-select',
    options: ['Caféine', 'Nicotine', 'Boissons énergisantes', 'Aucun'],
    category: 'lifestyle'
  },
  {
    id: 'last_stimulant_time',
    question: 'À quelle heure est votre dernière prise de stimulant en général ?',
    type: 'text',
    category: 'lifestyle'
  },
  {
    id: 'activity_level',
    question: 'Quel est votre niveau d\'activité physique ?',
    type: 'select',
    options: ['Sédentaire', 'Actif (3 séances/semaine)', 'Athlète (5+ séances/semaine)'],
    category: 'lifestyle'
  },
  {
    id: 'work_environment',
    question: 'Dans quel environnement travaillez-vous ?',
    type: 'select',
    options: ['Bureau / Sédentaire', 'Terrain / Actif', 'Extérieur / Nature', 'Ville polluée'],
    category: 'lifestyle'
  },
  {
    id: 'chronotype',
    question: 'Êtes-vous plutôt du matin ou du soir ?',
    type: 'select',
    options: ['Matin (Alouette)', 'Soir (Hibou)', 'Neutre'],
    category: 'metabolism'
  },
  {
    id: 'digestion_health',
    question: 'Comment qualifieriez-vous votre digestion ?',
    type: 'select',
    options: ['Excellente', 'Ballonnements fréquents', 'Lente', 'Sensibilités alimentaires'],
    category: 'metabolism'
  },
  {
    id: 'hydration',
    question: 'Combien de litres d\'eau buvez-vous par jour ?',
    type: 'select',
    options: ['Moins de 1L', '1L à 2L', 'Plus de 2L'],
    category: 'lifestyle'
  },
  {
    id: 'alcohol_freq',
    question: 'Fréquence de consommation d\'alcool ?',
    type: 'select',
    options: ['Jamais', 'Occasionnel', 'Régulier (plusieurs fois par semaine)'],
    category: 'lifestyle'
  },
  {
    id: 'meditation_breathing',
    question: 'Pratiquez-vous la méditation ou la cohérence cardiaque ?',
    type: 'select',
    options: ['Quotidiennement', 'Parfois', 'Jamais'],
    category: 'lifestyle'
  },
  {
    id: 'medical_history',
    question: 'Avez-vous des conditions médicales chroniques ?',
    type: 'text',
    category: 'history'
  },
  {
    id: 'injuries',
    question: 'Blessures passées ou zones de fragilité ?',
    type: 'text',
    category: 'history'
  },
  {
    id: 'age',
    question: 'Quel est votre âge ?',
    type: 'number',
    category: 'biometry'
  },
  {
    id: 'gender',
    question: 'Sexe biologique ?',
    type: 'select',
    options: ['Homme', 'Femme'],
    category: 'biometry'
  },
  {
    id: 'focus_area',
    question: 'Sur quoi voulez-vous que l\'IA se concentre le plus ?',
    type: 'select',
    options: ['Énergie physique', 'Clarté mentale', 'Qualité du sommeil', 'Récupération'],
    category: 'goals'
  },
  {
    id: 'data_privacy_mode',
    question: 'Préférence d\'analyse ?',
    type: 'select',
    options: ['Performance (Gemini Cloud)', 'Confidentialité Totale (IA Locale)'],
    category: 'goals'
  }
];
