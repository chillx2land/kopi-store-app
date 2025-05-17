import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Route = 'dashboard' | 'orders' | 'menu' | 'settings';

interface SidebarLinkProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
}) => (
  <TouchableOpacity
    style={[styles.link, isActive && styles.linkActive]}
    onPress={onPress}
  >
    <MaterialCommunityIcons
      name={icon}
      size={20}
      color={isActive ? '#FFFFFF' : '#666666'}
    />
    <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState<Route>('dashboard');

  const handleStoreStatusChange = (value: boolean) => {
    setIsOpen(value);
    // TODO: API呼び出しで店舗状態を更新
  };

  const handleNavigation = (route: Route) => {
    setActiveRoute(route);
    // TODO: 画面遷移の実装
  };

  return (
    <View style={styles.container}>
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
        <SidebarLink
          icon="view-dashboard-outline"
          label="ダッシュボード"
          onPress={() => handleNavigation('dashboard')}
          isActive={activeRoute === 'dashboard'}
        />
        <SidebarLink
          icon="clipboard-text-outline"
          label="注文管理"
          onPress={() => handleNavigation('orders')}
          isActive={activeRoute === 'orders'}
        />
        <SidebarLink
          icon="book-open-outline"
          label="メニュー管理"
          onPress={() => handleNavigation('menu')}
          isActive={activeRoute === 'menu'}
        />
        <SidebarLink
          icon="cog-outline"
          label="店舗設定"
          onPress={() => handleNavigation('settings')}
          isActive={activeRoute === 'settings'}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <MaterialCommunityIcons name="logout" size={20} color="#666666" />
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>
    </View>
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
  },
  header: {
    padding: 16,
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