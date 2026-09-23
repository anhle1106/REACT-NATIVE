import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LABS, LabDefinition } from '../../labs';

interface LabSelectorProps {
  currentLabId: string;
  onSelectLab: (labId: string) => void;
}

export const LabSelector: React.FC<LabSelectorProps> = ({
  currentLabId,
  onSelectLab,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const currentLab = LABS.find((l) => l.id === currentLabId) || LABS[0];

  return (
    <>
      <View style={styles.bannerContainer}>
        <TouchableOpacity
          style={styles.bannerChip}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.statusDot} />
          <Text style={styles.bannerText}>
            <Text style={styles.bannerCode}>{currentLab.code}: </Text>
            {currentLab.title}
          </Text>
          <Text style={styles.arrowIcon}>▾</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Danh sách bài thực hành</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.labList}>
                  {LABS.map((lab: LabDefinition) => {
                    const isSelected = lab.id === currentLabId;
                    return (
                      <TouchableOpacity
                        key={lab.id}
                        style={[
                          styles.labItem,
                          isSelected && styles.labItemSelected,
                        ]}
                        onPress={() => {
                          onSelectLab(lab.id);
                          setModalVisible(false);
                        }}
                      >
                        <View style={styles.labCodeBadge}>
                          <Text style={styles.labCodeText}>{lab.code}</Text>
                        </View>
                        <View style={styles.labDetails}>
                          <Text
                            style={[
                              styles.labTitleText,
                              isSelected && styles.labTitleTextSelected,
                            ]}
                          >
                            {lab.title}
                          </Text>
                          <Text style={styles.labDescText}>
                            {lab.description}
                          </Text>
                        </View>
                        {isSelected && (
                          <Text style={styles.checkIcon}>✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  bannerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  bannerText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '500',
  },
  bannerCode: {
    fontWeight: '700',
    color: '#60A5FA',
  },
  arrowIcon: {
    color: '#94A3B8',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  labList: {
    gap: 10,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  labItemSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  labCodeBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  labCodeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  labDetails: {
    flex: 1,
  },
  labTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  labTitleTextSelected: {
    color: '#2563EB',
  },
  labDescText: {
    fontSize: 11,
    color: '#64748B',
  },
  checkIcon: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
