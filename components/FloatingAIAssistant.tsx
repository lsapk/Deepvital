import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Sparkles, Send, Maximize2, Minimize2, X } from 'lucide-react-native';
import { AIService } from '@/services/ai';
import { getDatabase } from '@/services/database';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_settings WHERE key = ?', ['ai_local_mode']);
      if (result) {
        setIsLocalMode(result.value === 'true');
      }
    }
    loadSettings();
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await AIService.processAgenticWorkflow(input, isLocalMode);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);

      // Save to DB
      const db = await getDatabase();
      await db.runAsync('INSERT INTO ai_conversations (role, content) VALUES (?, ?)', ['user', input]);
      await db.runAsync('INSERT INTO ai_conversations (role, content) VALUES (?, ?)', ['ai', response]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré une erreur." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.floatingButton} onPress={toggleOpen}>
        <Sparkles color="#fff" size={28} />
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.overlayPanel,
        isExpanded ? styles.expandedPanel : styles.compactPanel
      ]}
    >
      <View style={styles.panelHeader}>
        <View style={styles.headerLeft}>
          <Sparkles color="#007AFF" size={20} />
          <View>
            <Text style={styles.headerTitle}>DeepVital Assistant</Text>
            <Text style={styles.headerSubtitle}>{isLocalMode ? 'Mode Local (100% Privé)' : 'Mode Performance (Gemini)'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleExpand} style={styles.headerIcon}>
            {isExpanded ? <Minimize2 color="#8E8E93" size={20} /> : <Maximize2 color="#8E8E93" size={20} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleOpen} style={styles.headerIcon}>
            <X color="#8E8E93" size={20} />
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
            item.role === 'user' ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.role === 'user' ? styles.userText : styles.aiText
            ]}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={loading ? <Text style={styles.loadingText}>DeepVital réfléchit...</Text> : null}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Posez une question..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Send color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  overlayPanel: {
    position: 'absolute',
    right: 15,
    bottom: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  compactPanel: {
    width: 320,
    height: SCREEN_HEIGHT * 0.4,
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
    borderBottomColor: '#F2F2F7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#8E8E93',
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
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F2F2F7',
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
  aiText: {
    color: '#1C1C1E',
  },
  loadingText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
