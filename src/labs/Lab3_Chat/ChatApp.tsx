import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Dữ liệu mẫu danh sách cuộc trò chuyện (thuần text, không icon)
const INITIAL_CONVERSATIONS = [
  {
    id: '1',
    name: 'Lan Anh',
    lastMessage: 'Tối nay mấy giờ đi cafe nhỉ?',
    time: '10:30',
  },
  {
    id: '2',
    name: 'Minh Tuấn',
    lastMessage: 'Chiều mai ra sân đá bóng nhé!',
    time: '09:15',
  },
  {
    id: '3',
    name: 'Hoàng Nam',
    lastMessage: 'Tối làm ván game không ông?',
    time: 'Hôm qua',
  },
  {
    id: '4',
    name: 'Thu Hà',
    lastMessage: 'Gửi cho mình xin tài liệu bài học với',
    time: 'Thứ 2',
  },
];

// Dữ liệu tin nhắn mẫu riêng cho từng cuộc trò chuyện (theo id)
const INITIAL_MESSAGES: Record<string, { id: string; text: string; isMe: boolean }[]> = {
  '1': [
    { id: '1', text: 'Chào Lan Anh nhé!', isMe: true },
    { id: '2', text: 'Chào cậu, tối nay có rảnh không?', isMe: false },
    { id: '3', text: 'Tối nay mấy giờ đi cafe nhỉ?', isMe: false },
  ],
  '2': [
    { id: '1', text: 'Tuấn ơi, mai có đá bóng không?', isMe: true },
    { id: '2', text: 'Có chứ, hẹn 5h chiều sân số 3 nhé', isMe: false },
    { id: '3', text: 'Chiều mai ra sân đá bóng nhé!', isMe: false },
  ],
  '3': [
    { id: '1', text: 'Nam ơi game mới update rồi', isMe: true },
    { id: '2', text: 'Tối làm ván game không ông?', isMe: false },
  ],
  '4': [
    { id: '1', text: 'Hà làm xong bài tập chưa?', isMe: true },
    { id: '2', text: 'Mình làm được 1 nửa rồi', isMe: false },
    { id: '3', text: 'Gửi cho mình xin tài liệu bài học với', isMe: false },
  ],
};

export const ChatApp = () => {
  // Quản lý màn hình hiện tại: 'login' | 'chat_list' | 'chat_detail'
  const [currentScreen, setCurrentScreen] = useState<'login' | 'chat_list' | 'chat_detail'>('login');

  // Thông tin đăng nhập ở Màn 1
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Người đang chat cùng ở Màn 3
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null);

  // Lưu trữ tin nhắn theo ID của từng cuộc trò chuyện
  const [messagesByChat, setMessagesByChat] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Xử lý đăng nhập
  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tài khoản!');
      return;
    }
    setCurrentScreen('chat_list');
  };

  // Xử lý gửi tin nhắn (lưu vào đúng cuộc trò chuyện đang mở)
  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      isMe: true,
    };

    setMessagesByChat({
      ...messagesByChat,
      [selectedChat.id]: [...(messagesByChat[selectedChat.id] || []), newMessage],
    });
    setInputText('');
  };

  // ==========================================
  // MÀN HÌNH 1: ĐĂNG NHẬP (LOGIN)
  // ==========================================
  const renderLoginScreen = () => (
    <View style={styles.loginContainer}>
      <Text style={styles.appTitle}>Đăng Nhập</Text>

      {/* Ô nhập Tài khoản */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tài khoản</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên tài khoản..."
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      {/* Ô nhập Mật khẩu */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Nút Đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  // ==========================================
  // MÀN HÌNH 2: DANH SÁCH CHAT
  // ==========================================
  const renderChatListScreen = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đoạn chat</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách cuộc trò chuyện */}
      <FlatList
        data={INITIAL_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => {
              setSelectedChat(item);
              setCurrentScreen('chat_detail');
            }}
          >
            <View style={styles.chatInfo}>
              <View style={styles.chatTopRow}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // ==========================================
  // MÀN HÌNH 3: CHI TIẾT ĐOẠN CHAT (2 BÊN)
  // ==========================================
  const renderChatDetailScreen = () => {
    // Lấy danh sách tin nhắn riêng của người đang được chọn
    const currentMessages = selectedChat ? (messagesByChat[selectedChat.id] || []) : [];

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('chat_list')}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <Text style={styles.detailTitle}>{selectedChat?.name}</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Danh sách tin nhắn giữa 2 bên */}
        <FlatList
          data={currentMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.isMe ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.isMe ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
        />

        {/* Khung nhập tin nhắn */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Nhập tin nhắn..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'chat_list' && renderChatListScreen()}
      {currentScreen === 'chat_detail' && renderChatDetailScreen()}
    </SafeAreaView>
  );
};

// ==========================================
// CSS / STYLES ĐƠN GIẢN
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // --- MÀN HÌNH 1: LOGIN ---
  loginContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    color: '#0084FF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  loginButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- MÀN HÌNH 2: LIST CHAT ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutBtn: {
    padding: 4,
  },
  logoutBtnText: {
    color: '#ff4d4f',
    fontSize: 14,
  },
  chatItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  chatInfo: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  chatTime: {
    fontSize: 12,
    color: '#888888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666666',
  },

  // --- MÀN HÌNH 3: DETAIL CHAT ---
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  backButton: {
    padding: 6,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0084FF',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerPlaceholder: {
    width: 60,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 2,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4E6EB',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084FF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
