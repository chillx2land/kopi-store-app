import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import BusinessHoursSection from '../../../components/ui/BusinessHoursSection';

type TabType = 'store-info' | 'business-hours' | 'special-days' | 'order-settings';

// 特別営業日の型定義を追加
interface SpecialBusinessDay {
  id: string;
  date: Date;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  note: string;
}

interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  description: string;
  maxOrdersPer15Min: number;
  storeImage: string | null;
  storeIcon: string | null;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  specialBusinessDays: SpecialBusinessDay[]; // 特別営業日の配列を追加
}

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('store-info');
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "Kopi 渋谷店",
    address: "東京都渋谷区渋谷1-1-1",
    phone: "03-1234-5678",
    description: "渋谷駅から徒歩5分のカフェです。こだわりのコーヒーと手作りスイーツをご提供しています。",
    maxOrdersPer15Min: 5,
    storeImage: null,
    storeIcon: null,
    openingHours: {
      monday: { open: "08:00", close: "20:00", isOpen: true },
      tuesday: { open: "08:00", close: "20:00", isOpen: true },
      wednesday: { open: "08:00", close: "20:00", isOpen: true },
      thursday: { open: "08:00", close: "20:00", isOpen: true },
      friday: { open: "08:00", close: "21:00", isOpen: true },
      saturday: { open: "09:00", close: "21:00", isOpen: true },
      sunday: { open: "09:00", close: "19:00", isOpen: true },
    },
    specialBusinessDays: [
      {
        id: "special-1",
        date: new Date(2025, 0, 1), // 2025年1月1日（元日）
        isOpen: false,
        openTime: "",
        closeTime: "",
        note: "元日のため休業",
      },
      {
        id: "special-2",
        date: new Date(2025, 4, 5), // 2025年5月5日（こどもの日）
        isOpen: true,
        openTime: "10:00",
        closeTime: "16:00",
        note: "こどもの日特別営業時間",
      },
    ],
  });

  // 新規特別営業日の状態
  const [isAddingSpecialDay, setIsAddingSpecialDay] = useState(false);
  const [newSpecialDay, setNewSpecialDay] = useState<Omit<SpecialBusinessDay, "id">>({
    date: new Date(),
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    note: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImagePick = async (type: 'storeImage' | 'storeIcon') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('画像を選択するためには、カメラロールへのアクセス許可が必要です。');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'storeImage' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setStoreInfo(prev => ({
        ...prev,
        [type]: result.assets[0].uri,
      }));
    }
  };

  const handleUpdateBusinessHours = (newHours: StoreInfo['openingHours']) => {
    setStoreInfo(prev => ({
      ...prev,
      openingHours: newHours,
    }));
  };

  // 日付が既に特別営業日として登録されているかチェック
  const isDateAlreadySpecial = (date: Date) => {
    return storeInfo.specialBusinessDays.some(
      (day) => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // 特別営業日の追加
  const handleAddSpecialDay = () => {
    if (!newSpecialDay.date) return;

    if (isDateAlreadySpecial(newSpecialDay.date)) {
      Alert.alert(
        '日付が重複しています',
        'この日付は既に特別営業日として登録されています',
        [{ text: 'OK' }]
      );
      return;
    }

    const newId = `special-${Date.now()}`;
    const newSpecialDayWithId = {
      ...newSpecialDay,
      id: newId,
    };

    setStoreInfo(prev => ({
      ...prev,
      specialBusinessDays: [...prev.specialBusinessDays, newSpecialDayWithId],
    }));

    setNewSpecialDay({
      date: new Date(),
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
      note: "",
    });
    setIsAddingSpecialDay(false);

    Alert.alert(
      '特別営業日を追加しました',
      `${format(newSpecialDay.date, 'yyyy年MM月dd日')}の特別設定を追加しました`,
      [{ text: 'OK' }]
    );
  };

  // 特別営業日の削除
  const handleDeleteSpecialDay = (id: string) => {
    Alert.alert(
      '特別営業日の削除',
      '本当にこの特別営業日を削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setStoreInfo(prev => ({
              ...prev,
              specialBusinessDays: prev.specialBusinessDays.filter(day => day.id !== id),
            }));
            Alert.alert('削除完了', '特別営業日を削除しました');
          },
        },
      ]
    );
  };

  const renderStoreInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>基本情報</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>店舗名</Text>
        <TextInput
          style={styles.input}
          value={storeInfo.name}
          onChangeText={(text) => setStoreInfo(prev => ({ ...prev, name: text }))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>住所</Text>
        <TextInput
          style={styles.input}
          value={storeInfo.address}
          onChangeText={(text) => setStoreInfo(prev => ({ ...prev, address: text }))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>電話番号</Text>
        <TextInput
          style={styles.input}
          value={storeInfo.phone}
          onChangeText={(text) => setStoreInfo(prev => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>店舗説明</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={storeInfo.description}
          onChangeText={(text) => setStoreInfo(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>店舗画像</Text>
        <View style={styles.imageContainer}>
          <Text style={styles.label}>店舗の写真</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => handleImagePick('storeImage')}
          >
            {storeInfo.storeImage ? (
              <Image
                source={{ uri: storeInfo.storeImage }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>タップして画像を選択</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.label}>店舗のアイコン</Text>
          <TouchableOpacity
            style={[styles.imagePickerButton, styles.iconPickerButton]}
            onPress={() => handleImagePick('storeIcon')}
          >
            {storeInfo.storeIcon ? (
              <Image
                source={{ uri: storeInfo.storeIcon }}
                style={styles.previewIcon}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>タップして画像を選択</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderBusinessHours = () => (
    <View style={styles.section}>
      <BusinessHoursSection
        businessHours={storeInfo.openingHours}
        onUpdate={handleUpdateBusinessHours}
      />
    </View>
  );

  const renderSpecialDays = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>特別営業日</Text>
      
      {isAddingSpecialDay ? (
        <View style={styles.specialDayForm}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>新規特別営業日</Text>
            <TouchableOpacity
              onPress={() => setIsAddingSpecialDay(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>日付</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                {format(newSpecialDay.date, 'yyyy年MM月dd日(E)', { locale: ja })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newSpecialDay.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewSpecialDay(prev => ({ ...prev, date: selectedDate }));
                  }
                }}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>営業する</Text>
              <Switch
                value={newSpecialDay.isOpen}
                onValueChange={(value) => 
                  setNewSpecialDay(prev => ({ ...prev, isOpen: value }))
                }
              />
            </View>

            {newSpecialDay.isOpen && (
              <View style={styles.timeContainer}>
                <View style={styles.timeInput}>
                  <Text style={styles.label}>開店時間</Text>
                  <TextInput
                    style={styles.input}
                    value={newSpecialDay.openTime}
                    onChangeText={(text) => 
                      setNewSpecialDay(prev => ({ ...prev, openTime: text }))
                    }
                    placeholder="09:00"
                  />
                </View>
                <Text style={styles.timeSeparator}>〜</Text>
                <View style={styles.timeInput}>
                  <Text style={styles.label}>閉店時間</Text>
                  <TextInput
                    style={styles.input}
                    value={newSpecialDay.closeTime}
                    onChangeText={(text) => 
                      setNewSpecialDay(prev => ({ ...prev, closeTime: text }))
                    }
                    placeholder="18:00"
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>メモ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newSpecialDay.note}
              onChangeText={(text) => 
                setNewSpecialDay(prev => ({ ...prev, note: text }))
              }
              placeholder="特別営業日の理由や備考"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsAddingSpecialDay(false)}
            >
              <Text style={styles.buttonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddSpecialDay}
            >
              <Text style={[styles.buttonText, styles.addButtonText]}>追加</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addSpecialDayButton}
          onPress={() => setIsAddingSpecialDay(true)}
        >
          <Text style={styles.addSpecialDayButtonText}>＋ 特別営業日を追加</Text>
        </TouchableOpacity>
      )}

      <View style={styles.specialDaysList}>
        <Text style={styles.subsectionTitle}>登録済み特別営業日</Text>
        {storeInfo.specialBusinessDays.length === 0 ? (
          <Text style={styles.emptyText}>特別営業日は登録されていません</Text>
        ) : (
          storeInfo.specialBusinessDays
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((day) => (
              <View key={day.id} style={styles.specialDayItem}>
                <View style={styles.specialDayInfo}>
                  <Text style={styles.specialDayDate}>
                    {format(day.date, 'yyyy年MM月dd日(E)', { locale: ja })}
                  </Text>
                  <Text style={[
                    styles.specialDayStatus,
                    day.isOpen ? styles.openStatus : styles.closedStatus
                  ]}>
                    {day.isOpen 
                      ? `営業: ${day.openTime} 〜 ${day.closeTime}`
                      : '休業'
                    }
                  </Text>
                  {day.note && (
                    <Text style={styles.specialDayNote}>{day.note}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSpecialDay(day.id)}
                >
                  <Text style={styles.deleteButtonText}>削除</Text>
                </TouchableOpacity>
              </View>
            ))
        )}
      </View>
    </View>
  );

  const renderOrderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>注文設定</Text>
      <Text style={styles.sectionDescription}>
        注文の受付に関する設定を行います
      </Text>

      <View style={styles.settingGroup}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingTitle}>15分あたりの上限注文数</Text>
          <Text style={styles.settingDescription}>
            15分間に受け付ける最大の注文数を設定します。これを超える注文はアプリ上で「混雑中」と表示され、受付が制限されます。
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.currentValue}>
            {storeInfo.maxOrdersPer15Min === 0 ? "無制限" : `${storeInfo.maxOrdersPer15Min}件まで`}
          </Text>
          <TextInput
            style={styles.input}
            value={storeInfo.maxOrdersPer15Min.toString()}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              setStoreInfo(prev => ({ ...prev, maxOrdersPer15Min: value }));
            }}
            keyboardType="number-pad"
            placeholder="0"
          />
          <Text style={styles.helperText}>
            0に設定すると上限なし（無制限）になります
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'store-info':
        return renderStoreInfo();
      case 'business-hours':
        return renderBusinessHours();
      case 'special-days':
        return renderSpecialDays();
      case 'order-settings':
        return renderOrderSettings();
      default:
        return renderStoreInfo();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>店舗設定</Text>
      <Text style={styles.subtitle}>店舗情報と営業設定を管理します</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'store-info' && styles.activeTab]}
          onPress={() => setActiveTab('store-info')}
        >
          <Text style={[styles.tabText, activeTab === 'store-info' && styles.activeTabText]}>店舗情報</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'business-hours' && styles.activeTab]}
          onPress={() => setActiveTab('business-hours')}
        >
          <Text style={[styles.tabText, activeTab === 'business-hours' && styles.activeTabText]}>営業時間</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'special-days' && styles.activeTab]}
          onPress={() => setActiveTab('special-days')}
        >
          <Text style={[styles.tabText, activeTab === 'special-days' && styles.activeTabText]}>特別営業日</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'order-settings' && styles.activeTab]}
          onPress={() => setActiveTab('order-settings')}
        >
          <Text style={[styles.tabText, activeTab === 'order-settings' && styles.activeTabText]}>注文設定</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  imageSection: {
    marginTop: 24,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  iconPickerButton: {
    height: 120,
    width: 120,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
  },
  specialDayForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  formGroup: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    marginHorizontal: 8,
    marginBottom: 12,
    color: '#666',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
  },
  addButtonText: {
    color: '#fff',
  },
  addSpecialDayButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  addSpecialDayButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  specialDaysList: {
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  specialDayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  specialDayInfo: {
    flex: 1,
  },
  specialDayDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  specialDayStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  openStatus: {
    color: '#4CAF50',
  },
  closedStatus: {
    color: '#F44336',
  },
  specialDayNote: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderColor: '#ff4444',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 14,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  settingGroup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  settingHeader: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  currentValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 