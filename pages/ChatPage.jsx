import { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// BACKEND: import Firestore functions
import { listenToMessages, sendMessage } from "../services/chatService";
// (Make sure chatService.js is inside /services)

// ChatPage UI + backend integration
export default function ChatPage({ route }) {

  // BACKEND: extract chatId + userId from navigation params
  const { chatId, userId } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [renderError, setRenderError] = useState(null);

  // BACKEND: auto-scroll to bottom
  const scrollRef = useRef();

  useEffect(() => {
    console.log("ChatPage mounted. chatId =", chatId);

    // BACKEND: Listen to realtime messages
    if (chatId) {
      const unsubscribe = listenToMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  // 🔌 BACKEND: replace local-only send with Firestore send
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(chatId, userId, input.trim());
      setInput("");
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  // Defensive render
  try {
    if (renderError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: 'red' }]}>
              Error rendering chat: {String(renderError)}
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.senderId === userId ? styles.userMessage : styles.otherMessage
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  } catch (err) {
    console.error('ChatPage render error', err);
    setRenderError(err?.message || String(err));
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: 'red' }]}>
            Error rendering chat: {String(err)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#000' },

  messagesContainer: { flex: 1 },
  messagesContent: { paddingHorizontal: 16, paddingVertical: 12 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },

  messageBubble: {
    maxWidth: '80%',
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  messageText: { fontSize: 14, color: '#000' },

  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
