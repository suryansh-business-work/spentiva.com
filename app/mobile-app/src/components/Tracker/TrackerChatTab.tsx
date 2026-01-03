import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  IconButton,
  Text,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { trackerService } from '../../services/trackerService';
import { ChatMessage } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface Props {
  trackerId: string;
}

export default function TrackerChatTab({ trackerId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
  }, [trackerId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const history = await trackerService.getChatHistory(trackerId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setSending(true);

    // Add user message optimistically
    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      trackerId,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await trackerService.sendChatMessage(trackerId, userMessage);
      setMessages((prev) => [...prev, response]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        trackerId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        <Card style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Card.Content>
            <Text variant="bodyMedium" style={isUser && styles.userText}>
              {item.content}
            </Text>
            <Text variant="bodySmall" style={[styles.timestamp, isUser && styles.userTimestamp]}>
              {formatRelativeTime(item.timestamp)}
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">Start a conversation</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Ask me to log expenses, view analytics, or answer questions about your spending
            </Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          style={styles.input}
          disabled={sending}
        />
        <IconButton
          icon="send"
          mode="contained"
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
          loading={sending}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#6200ee',
  },
  assistantBubble: {
    backgroundColor: '#f5f5f5',
  },
  userText: {
    color: 'white',
  },
  timestamp: {
    marginTop: 4,
    opacity: 0.6,
    fontSize: 11,
  },
  userTimestamp: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 24,
  },
  emptySubtext: {
    marginTop: 8,
    opacity: 0.6,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
});
