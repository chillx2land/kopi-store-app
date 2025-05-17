import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

type Route = 'dashboard' | 'orders' | 'menu' | 'settings';

interface SidebarProps {
  activeRoute: Route;
  onChangeRoute: (route: Route) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onChangeRoute }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();

  const handleStoreStatusChange = (value: boolean) => {
    setIsOpen(value);
    // TODO: API呼び出しで店舗状態を更新
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="coffee" size={24} color="#333333" />
          <Text style={styles.logoText}>Kopi Store</Text>
        </View>
        <Text style={styles.welcomeText}>ようこそ、スタッフさん</Text>
        <View style={styles.storeStatus}>
          <View style={styles.switchContainer}>
            <Switch
              value={isOpen}
              onValueChange={handleStoreStatusChange}
              trackColor={{ false: '#E1E1E1', true: '#333333' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
            />
            <Text style={styles.switchLabel}>営業状態</Text>
          </View>
          <View
            style={[styles.badge, isOpen ? styles.badgeActive : styles.badgeInactive]}
          >
            <Text style={[styles.badgeText, isOpen ? styles.badgeTextActive : styles.badgeTextInactive]}>
              {isOpen ? '営業中' : '準備中'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.link, activeRoute === 'dashboard' && styles.linkActive]}
          onPress={() => onChangeRoute('dashboard')}
        >
          <MaterialCommunityIcons
            name="view-dashboard-outline"
            size={20}
            color={activeRoute === 'dashboard' ? '#FFFFFF' : '#666666'}
          />
          <Text style={[styles.linkText, activeRoute === 'dashboard' && styles.linkTextActive]}>
            ダッシュボード
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, activeRoute === 'orders' && styles.linkActive]}
          onPress={() => onChangeRoute('orders')}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={20}
            color={activeRoute === 'orders' ? '#FFFFFF' : '#666666'}
          />
          <Text style={[styles.linkText, activeRoute === 'orders' && styles.linkTextActive]}>
            注文管理
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, activeRoute === 'menu' && styles.linkActive]}
          onPress={() => onChangeRoute('menu')}
        >
          <MaterialCommunityIcons
            name="book-open-outline"
            size={20}
            color={activeRoute === 'menu' ? '#FFFFFF' : '#666666'}
          />
          <Text style={[styles.linkText, activeRoute === 'menu' && styles.linkTextActive]}>
            メニュー管理
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, activeRoute === 'settings' && styles.linkActive]}
          onPress={() => onChangeRoute('settings')}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={20}
            color={activeRoute === 'settings' ? '#FFFFFF' : '#666666'}
          />
          <Text style={[styles.linkText, activeRoute === 'settings' && styles.linkTextActive]}>
            店舗設定
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={20} color="#666666" />
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E1E1E1',
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333333',
  },
  welcomeText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  storeStatus: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: '#333333',
  },
  badgeInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666666',
  },
  badgeText: {
    fontSize: 12,
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
  badgeTextInactive: {
    color: '#666666',
  },
  navigation: {
    flex: 1,
    padding: 12,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  linkActive: {
    backgroundColor: '#333333',
  },
  linkText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666666',
  },
  linkTextActive: {
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666666',
  },
}); 