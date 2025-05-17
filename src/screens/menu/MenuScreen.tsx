import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// メニューカテゴリーの型定義
type MenuStatus = '販売中' | '在庫切れ' | '非表示';

// メニューアイテムの型定義
interface MenuItem {
  id: string;
  name: string;
  category: '食べ物' | 'ドリンク';
  price: number;
  description: string;
  imageUrl: string | null;
  status: MenuStatus;
  stock: number;
}

// モックデータ
const mockMenuItems: MenuItem[] = [
  {
    id: 'MENU-001',
    name: 'カフェラテ',
    category: 'ドリンク',
    price: 480,
    description: '濃厚なエスプレッソと滑らかなミルクの組み合わせ',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800',
    status: '販売中',
    stock: 100,
  },
  {
    id: 'MENU-002',
    name: 'アメリカーノ',
    category: 'ドリンク',
    price: 400,
    description: 'すっきりとした味わいのブラックコーヒー',
    imageUrl: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800',
    status: '在庫切れ',
    stock: 0,
  },
  {
    id: 'MENU-003',
    name: 'クロワッサン',
    category: '食べ物',
    price: 280,
    description: 'バターの香り豊かなサクサクのクロワッサン',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
    status: '販売中',
    stock: 8,
  },
  {
    id: 'MENU-004',
    name: 'チョコレートケーキ',
    category: '食べ物',
    price: 480,
    description: '濃厚なチョコレートの味わい',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    status: '非表示',
    stock: 0,
  },
  {
    id: 'MENU-005',
    name: 'カプチーノ',
    category: 'ドリンク',
    price: 450,
    description: 'ふんわり泡立てたミルクフォームとエスプレッソ',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
    status: '販売中',
    stock: 100,
  },
  {
    id: 'MENU-006',
    name: 'ベーグル',
    category: '食べ物',
    price: 320,
    description: 'もちもちした食感のプレーンベーグル',
    imageUrl: 'https://images.unsplash.com/photo-1585445490387-f47934b73b54?w=800',
    status: '販売中',
    stock: 15,
  },
  {
    id: 'MENU-007',
    name: 'アイスコーヒー',
    category: 'ドリンク',
    price: 380,
    description: '香り高い豆を使用した本格アイスコーヒー',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
    status: '販売中',
    stock: 100,
  },
  {
    id: 'MENU-008',
    name: 'チーズケーキ',
    category: '食べ物',
    price: 450,
    description: 'なめらかな口当たりのベイクドチーズケーキ',
    imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800',
    status: '販売中',
    stock: 12,
  },
];

interface CategoryTabProps {
  label: MenuStatus;
  isActive: boolean;
  onPress: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryTab, isActive && styles.categoryTabActive]}
    onPress={onPress}
  >
    <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface MenuItemCardProps {
  item: MenuItem;
  onPressEdit: (id: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onPressEdit,
}) => (
  <View style={styles.menuItemCard}>
    <View style={styles.menuItemContent}>
      <Image
        source={{ uri: item.imageUrl || 'https://source.unsplash.com/featured/?food' }}
        style={styles.menuItemImage}
      />
      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <View style={[
            styles.statusBadge,
            styles[`statusBadge${item.status}`]
          ]}>
            <Text style={styles.statusBadgeText}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.menuItemCategory}>{item.category}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>¥{item.price.toLocaleString()}</Text>
          <Text style={styles.menuItemStock}>在庫数: {item.stock}</Text>
        </View>
      </View>
      <View style={styles.menuItemActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onPressEdit(item.id)}
        >
          <MaterialCommunityIcons name="pencil" size={16} color="#666666" />
          <Text style={styles.editButtonText}>編集</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const MenuScreen: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<MenuStatus>('販売中');

  const filteredMenuItems = mockMenuItems.filter((item) => {
    return item.status === activeStatus;
  });

  const handlePressEdit = (id: string) => {
    console.log('メニュー編集:', id);
    // TODO: メニュー編集画面への遷移を実装
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>メニュー管理</Text>
          <Text style={styles.subtitle}>メニューの確認と編集を行います</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>新規メニュー</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesContent}>
          <CategoryTab
            label="販売中"
            isActive={activeStatus === '販売中'}
            onPress={() => setActiveStatus('販売中')}
          />
          <CategoryTab
            label="在庫切れ"
            isActive={activeStatus === '在庫切れ'}
            onPress={() => setActiveStatus('在庫切れ')}
          />
          <CategoryTab
            label="非表示"
            isActive={activeStatus === '非表示'}
            onPress={() => setActiveStatus('非表示')}
          />
        </View>
      </View>

      {filteredMenuItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>該当するメニューがありません</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMenuItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onPressEdit={handlePressEdit}
            />
          )}
          contentContainerStyle={styles.menuList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    paddingTop: 24,
    paddingRight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  categoriesContainer: {
    height: 44,
    overflow: 'scroll',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    height: 36,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  categoryTabActive: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666666',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  menuList: {
    padding: 16,
    paddingTop: 8,
  },
  menuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  menuItemCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  menuItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  menuItemStock: {
    fontSize: 14,
    color: '#666666',
  },
  menuItemActions: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  editButtonText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadge販売中: {
    backgroundColor: '#059669',
  },
  statusBadge在庫切れ: {
    backgroundColor: '#DC2626',
  },
  statusBadge非表示: {
    backgroundColor: '#6B7280',
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
}); 