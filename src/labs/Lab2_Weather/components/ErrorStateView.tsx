import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateViewProps {
  errorMessage: string;
  onRetry: () => void;
  onUseDefaultCity?: () => void;
}

export const ErrorStateView: React.FC<ErrorStateViewProps> = ({
  errorMessage,
  onRetry,
  onUseDefaultCity,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.errorIcon}>📡⚠️</Text>
        <Text style={styles.title}>Không thể kết nối API Thời tiết</Text>
        <Text style={styles.message}>{errorMessage}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryBtnText}>🔄 Thử lại ngay</Text>
          </TouchableOpacity>

          {onUseDefaultCity && (
            <TouchableOpacity
              style={styles.defaultBtn}
              onPress={onUseDefaultCity}
              activeOpacity={0.8}
            >
              <Text style={styles.defaultBtnText}>Xem Hà Nội (Mặc định)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    width: '100%',
    maxWidth: 360,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F87171',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  actionRow: {
    width: '100%',
    gap: 10,
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  defaultBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  defaultBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
});
