import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Sparkles, Send, Maximize2, Minimize2, X } from 'lucide-react-native';
import { useSegments } from 'expo-router';
import { AIService } from '@/services/ai';
import { getDatabase } from '@/services/database';
import { useTheme } from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FloatingAIAssistant = () => {
  const segments = useSegments();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const theme = useTheme();

  const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'onboarding';

  useEffect(() => {
    async function loadHistory() {
      try {
        const db = await getDatabase();
        const settings = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['ai_local_mode']);
        if (settings) {
          setIsLocalMode(settings.value === 'true');
        }

        const history = await db.getAllAsync<{ role: 'user' | 'ai', content: string }>(
          'SELECT role, content FROM ai_conversations ORDER BY timestamp ASC LIMIT 50'
        );
        if (history.length > 0) {
          setMessages(history);
        }
      } catch (e) {
        console.error("Failed to load AI history:", e);
      }
    }
    if (isOpen) loadHistory();
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (!inAuthGroup) return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = { role: 'user' as const, content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await AIService.processAgenticWorkflow(userText, isLocalMode);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);

      const db = await getDatabase();
      await db.runAsync('INSERT INTO ai_conversations (role, content) VALUES (?, ?)', ['user', userText]);
      await db.runAsync('INSERT INTO ai_conversations (role, content) VALUES (?, ?)', ['ai', response]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré une erreur technique." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.text, bottom: Platform.OS === 'ios' ? 110 : 90 }]}
        onPress={toggleOpen}
        activeOpacity={0.8}
      >
        <Sparkles color={theme.background} size={28} />
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.overlayPanel,
        { backgroundColor: theme.surface, borderColor: theme.border, bottom: Platform.OS === 'ios' ? 100 : 80 },
        isExpanded ? styles.expandedPanel : styles.compactPanel
      ]}
    >
      <View style={[styles.panelHeader, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Sparkles color={theme.primary} size={20} />
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>DeepVital Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>{isLocalMode ? 'Mode Local (100% Privé)' : 'Mode Performance (Gemini)'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleExpand} style={styles.headerIcon}>
            {isExpanded ? <Minimize2 color={theme.secondaryText} size={20} /> : <Maximize2 color={theme.secondaryText} size={20} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleOpen} style={styles.headerIcon}>
            <X color={theme.secondaryText} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.role === 'user' ? [styles.userBubble, { backgroundColor: theme.primary }] : [styles.aiBubble, { backgroundColor: theme.border }]
          ]}>
            <Text style={[
              styles.messageText,
              item.role === 'user' ? styles.userText : { color: theme.text }
            ]}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.secondaryText }]}>DeepVital analyse vos données...</Text>
          </View>
        ) : null}
      />

      <View style={[styles.inputArea, { borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.border, color: theme.text }]}
          placeholder="Posez une question..."
          placeholderTextColor={theme.secondaryText}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: input.trim() ? theme.text : theme.border }]}
          onPress={sendMessage}
          disabled={loading || !input.trim()}
        >
          <Send color={input.trim() ? theme.background : theme.secondaryText} size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
  },
  overlayPanel: {
    position: 'absolute',
    right: 15,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 9999,
  },
  compactPanel: {
    width: 320,
    height: SCREEN_HEIGHT * 0.45,
  },
  expandedPanel: {
    width: '95%',
    height: SCREEN_HEIGHT * 0.8,
    left: '2.5%',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerIcon: {
    padding: 5,
  },
  messageList: {
    padding: 15,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
