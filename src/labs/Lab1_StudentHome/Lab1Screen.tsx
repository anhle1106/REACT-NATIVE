import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation } from './components/BottomNavigation';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StatsOverview } from './components/StatsOverview';
import { SubjectCard } from './components/SubjectCard';
import { darkColors, lightColors } from './constants/colors';
import { mockStats, mockStudent, mockSubjects } from './constants/mockData';
import { styles } from './styles';
import { BottomTabKey, SubjectItem } from './types';

export const Lab1Screen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? darkColors : lightColors;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockSubjects;
    }
    const query = searchQuery.toLowerCase().trim();
    return mockSubjects.filter(
      (sub) =>
        sub.name.toLowerCase().includes(query) ||
        sub.code.toLowerCase().includes(query) ||
        sub.instructor.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handlePressSubject = (subject: SubjectItem) => {
    Alert.alert(
      subject.name,
      `Mã môn: ${subject.code}\n` +
      `Giảng viên: ${subject.instructor}\n` +
      `Tiến độ: ${subject.completedLessons}/${subject.lessonCount} bài (${subject.progressPercent}%)\n` +
      `Trạng thái: ${subject.progressPercent >= 100 ? '✅ Đã hoàn thành' : '⏳ Đang học'}`,
      [{ text: 'Đóng', style: 'cancel' }]
    );
  };

  const handlePressNotification = () => {
    Alert.alert(
      'Thông báo mới',
      `Bạn có ${mockStudent.unreadNotifications} thông báo chưa đọc.`,
      [{ text: 'Đã hiểu' }]
    );
  };

  const renderListHeader = () => (
    <View>
      <Header
        student={mockStudent}
        colors={colors}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onPressNotification={handlePressNotification}
      />
      <StatsOverview stats={mockStats} colors={colors} />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        colors={colors}
      />
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Danh sách môn học
        </Text>
        <Text
          style={[
            styles.subjectCountBadge,
            {
              color: colors.primary,
              backgroundColor: colors.primaryLight,
            },
          ]}
        >
          {filteredSubjects.length} môn
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
        Không tìm thấy môn học
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Không có môn nào khớp với từ khóa "{searchQuery}".{'\n'}Vui lòng thử tìm với từ khóa khác.
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <FlatList
        data={filteredSubjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            colors={colors}
            onPress={handlePressSubject}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        colors={colors}
      />
    </SafeAreaView>
  );
};
