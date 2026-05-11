import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { ONBOARDING_QUESTIONS } from '@/constants/Onboarding';
import { getDatabase } from '@/services/database';
import { HealthService } from '@/services/health';
import { useRouter } from 'expo-router';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const router = useRouter();
  const theme = useTheme();

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const nextStep = async () => {
    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await saveAnswers();
      // Initialize health on finish
      try {
        const isReady = await HealthService.setup();
        if (isReady) {
          await HealthService.requestPermissions();
          await HealthService.syncData();
        }
      } catch (e) {
        console.error("Health sync error on onboarding finish:", e);
      }
      router.replace('/(tabs)/home');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveAnswers = async () => {
    const db = await getDatabase();
    for (const question of ONBOARDING_QUESTIONS) {
      const answer = answers[question.id];
      if (answer !== undefined) {
        await db.runAsync(
          'INSERT OR REPLACE INTO user_profile (question_id, answer, category) VALUES (?, ?, ?)',
          [question.id, JSON.stringify(answer), question.category]
        );
      }
    }
    await db.runAsync('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', ['onboarding_completed', 'true']);
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'select':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  answers[currentQuestion.id] === option && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={[
                  styles.optionText,
                  { color: theme.text },
                  answers[currentQuestion.id] === option && { color: theme.primary }
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'multi-select':
        const currentAnswers = answers[currentQuestion.id] || [];
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  currentAnswers.includes(option) && { borderColor: theme.primary, backgroundColor: theme.primary + '10' }
                ]}
                onPress={() => {
                  const newAnswers = currentAnswers.includes(option)
                    ? currentAnswers.filter((a: string) => a !== option)
                    : [...currentAnswers, option];
                  handleAnswer(newAnswers);
                }}
              >
                <Text style={[
                  styles.optionText,
                  { color: theme.text },
                  currentAnswers.includes(option) && { color: theme.primary }
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'number':
        return (
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            keyboardType="numeric"
            value={answers[currentQuestion.id]?.toString() || ''}
            onChangeText={(text) => handleAnswer(text)}
            placeholder="Entrez un nombre"
            placeholderTextColor={theme.secondaryText}
          />
        );
      case 'text':
        return (
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            value={answers[currentQuestion.id] || ''}
            onChangeText={(text) => handleAnswer(text)}
            placeholder="Votre réponse"
            placeholderTextColor={theme.secondaryText}
            multiline
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100}%`, backgroundColor: theme.primary }
            ]}
          />
        </View>
        <Text style={[styles.stepIndicator, { color: theme.secondaryText }]}>{currentStep + 1} / {ONBOARDING_QUESTIONS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.categoryLabel, { color: theme.primary }]}>{currentQuestion.category.toUpperCase()}</Text>
        <Text style={[styles.questionText, { color: theme.text }]}>{currentQuestion.question}</Text>
        {renderInput()}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft color={currentStep === 0 ? theme.secondaryText : theme.text} size={24} />
          <Text style={[styles.navButtonText, { color: theme.text }, currentStep === 0 && { color: theme.secondaryText }]}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.text }]}
          onPress={nextStep}
        >
          <Text style={[styles.nextButtonText, { color: theme.background }]}>
            {currentStep === ONBOARDING_QUESTIONS.length - 1 ? 'Terminer' : 'Suivant'}
          </Text>
          <ChevronRight color={theme.background} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepIndicator: {
    fontSize: 14,
    textAlign: 'right',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  input: {
    padding: 20,
    borderRadius: 16,
    fontSize: 18,
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginRight: 5,
  },
  disabledButton: {
    opacity: 0.3,
  },
});
