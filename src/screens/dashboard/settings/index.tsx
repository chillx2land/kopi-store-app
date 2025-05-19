import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BusinessHoursSection from '../../../components/ui/BusinessHoursSection';

type TabType = 'store-info' | 'business-hours' | 'special-days' | 'order-settings';

interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  description: string;
  maxOrdersPer15Min: number;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
}

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('store-info');
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "Kopi 渋谷店",
    address: "東京都渋谷区渋谷1-1-1",
    phone: "03-1234-5678",
    description: "渋谷駅から徒歩5分のカフェです。こだわりのコーヒーと手作りスイーツをご提供しています。",
    maxOrdersPer15Min: 5,
    openingHours: {
      monday: { open: "08:00", close: "20:00", isOpen: true },
      tuesday: { open: "08:00", close: "20:00", isOpen: true },
      wednesday: { open: "08:00", close: "20:00", isOpen: true },
      thursday: { open: "08:00", close: "20:00", isOpen: true },
      friday: { open: "08:00", close: "21:00", isOpen: true },
      saturday: { open: "09:00", close: "21:00", isOpen: true },
      sunday: { open: "09:00", close: "19:00", isOpen: true },
    },
  });

  const handleUpdateBusinessHours = (newHours: StoreInfo['openingHours']) => {
    setStoreInfo(prev => ({
      ...prev,
      openingHours: newHours,
    }));
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
      <Text style={styles.placeholder}>特別営業日の設定は準備中です</Text>
    </View>
  );

  const renderOrderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>注文設定</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>15分あたりの最大注文数</Text>
        <TextInput
          style={styles.input}
          value={storeInfo.maxOrdersPer15Min.toString()}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            setStoreInfo(prev => ({ ...prev, maxOrdersPer15Min: value }));
          }}
          keyboardType="number-pad"
        />
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
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
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
}); 