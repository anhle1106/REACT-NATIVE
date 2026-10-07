import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LocationInfo } from '../types/weather';
import { POPULAR_CITIES } from '../constants/defaultCities';
import { searchCities } from '../services/geocodingApi';

interface SearchLocationsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationInfo) => void;
  onSelectCurrentLocation: () => void;
}

export const SearchLocationsModal: React.FC<SearchLocationsModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
  onSelectCurrentLocation,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim() || text.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchCities(text);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.dragIndicator} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Tìm kiếm địa điểm</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchBarContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nhập tên thành phố (Hà Nội, Tokyo, Paris...)"
                  placeholderTextColor="#94A3B8"
                  value={query}
                  onChangeText={handleSearch}
                  autoCorrect={false}
                  autoCapitalize="words"
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* GPS Quick Button */}
              <TouchableOpacity
                style={styles.gpsRow}
                onPress={() => {
                  onSelectCurrentLocation();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.gpsIconCircle}>
                  <Text style={styles.gpsEmoji}>🎯</Text>
                </View>
                <View style={styles.gpsTexts}>
                  <Text style={styles.gpsTitle}>Vị trí hiện tại của tôi</Text>
                  <Text style={styles.gpsSub}>Sử dụng định vị GPS từ thiết bị</Text>
                </View>
                <Text style={styles.arrowChevron}>›</Text>
              </TouchableOpacity>

              {/* Body: Search Results or Popular Cities */}
              {isSearching ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#38BDF8" />
                  <Text style={styles.loadingText}>Đang tìm kiếm dữ liệu API...</Text>
                </View>
              ) : hasSearched && searchResults.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🌍</Text>
                  <Text style={styles.emptyTitle}>Không tìm thấy địa điểm</Text>
                  <Text style={styles.emptySub}>
                    Thử tìm với tên không dấu hoặc chọn các thành phố phổ biến bên dưới.
                  </Text>
                </View>
              ) : hasSearched && searchResults.length > 0 ? (
                <View style={styles.listSection}>
                  <Text style={styles.sectionHeading}>
                    KẾT QUẢ TÌM KIẾM ({searchResults.length})
                  </Text>
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, idx) =>
                      `${item.name}-${item.latitude}-${idx}`
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.cityItem}
                        onPress={() => {
                          onSelectLocation(item);
                          onClose();
                        }}
                      >
                        <Text style={styles.cityPin}>📍</Text>
                        <View style={styles.cityTexts}>
                          <Text style={styles.cityNameText}>{item.name}</Text>
                          <Text style={styles.citySubText}>
                            {item.admin1 ? `${item.admin1}, ` : ''}
                            {item.country}
                          </Text>
                        </View>
                        <Text style={styles.arrowChevron}>›</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : (
                <View style={styles.listSection}>
                  <Text style={styles.sectionHeading}>
                    CÁC THÀNH PHỐ PHỔ BIẾN
                  </Text>
                  <FlatList
                    data={POPULAR_CITIES}
                    keyExtractor={(item) => `${item.name}-${item.country}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.cityItem}
                        onPress={() => {
                          onSelectLocation(item);
                          onClose();
                        }}
                      >
                        <Text style={styles.cityPin}>🏙️</Text>
                        <View style={styles.cityTexts}>
                          <Text style={styles.cityNameText}>{item.name}</Text>
                          <Text style={styles.citySubText}>
                            {item.admin1 ? `${item.admin1}, ` : ''}
                            {item.country}
                          </Text>
                        </View>
                        <Text style={styles.arrowChevron}>›</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    height: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dragIndicator: {
    width: 44,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  gpsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gpsEmoji: {
    fontSize: 18,
  },
  gpsTexts: {
    flex: 1,
  },
  gpsTitle: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
  },
  gpsSub: {
    color: '#6EE7B7',
    fontSize: 11,
    marginTop: 2,
  },
  arrowChevron: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '700',
  },
  listSection: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  cityPin: {
    fontSize: 18,
    marginRight: 12,
  },
  cityTexts: {
    flex: 1,
  },
  cityNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  citySubText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
