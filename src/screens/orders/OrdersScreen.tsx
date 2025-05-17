import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 注文ステータスの型定義
type OrderStatus = '受付済' | '調理中' | '準備完了' | '受取済';
type TabValue = 'all' | 'pending' | 'preparing' | 'ready' | 'completed';

// 注文データの型定義
interface Order {
  id: string;
  nickname: string;
  status: OrderStatus;
  scheduledTime: string;
  createdAt: string;
  items: string;
  totalAmount: number;
}

// モック注文データ
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    nickname: "田中",
    status: "受付済",
    scheduledTime: "10:30",
    createdAt: "2023-05-17 10:15",
    items: "カフェラテ x1, クロワッサン x1",
    totalAmount: 850,
  },
  {
    id: "ORD-002",
    nickname: "佐藤",
    status: "調理中",
    scheduledTime: "10:25",
    createdAt: "2023-05-17 10:10",
    items: "アメリカーノ x2",
    totalAmount: 700,
  },
  {
    id: "ORD-003",
    nickname: "鈴木",
    status: "準備完了",
    scheduledTime: "10:15",
    createdAt: "2023-05-17 10:00",
    items: "カプチーノ x1, チョコレートケーキ x1",
    totalAmount: 950,
  },
  {
    id: "ORD-004",
    nickname: "高橋",
    status: "受取済",
    scheduledTime: "10:00",
    createdAt: "2023-05-17 09:45",
    items: "エスプレッソ x1",
    totalAmount: 350,
  },
  {
    id: "ORD-005",
    nickname: "伊藤",
    status: "受付済",
    scheduledTime: "10:45",
    createdAt: "2023-05-17 10:20",
    items: "抹茶ラテ x1, チーズケーキ x1",
    totalAmount: 1050,
  },
  {
    id: "ORD-006",
    nickname: "渡辺",
    status: "調理中",
    scheduledTime: "10:35",
    createdAt: "2023-05-17 10:18",
    items: "カフェモカ x1, ブラウニー x1",
    totalAmount: 900,
  },
];

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case '受付済': return '#F59E0B';
      case '調理中': return '#3B82F6';
      case '準備完了': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
};

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface OrderCardProps {
  order: Order;
  onPressDetail: (orderId: string) => void;
  onPressAction: (orderId: string, status: OrderStatus) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPressDetail, onPressAction }) => {
  const getActionLabel = (status: OrderStatus) => {
    switch (status) {
      case '受付済': return '調理開始';
      case '調理中': return '準備完了';
      case '準備完了': return '受取完了';
      default: return '';
    }
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{order.id}</Text>
          <StatusBadge status={order.status} />
        </View>
        <Text style={styles.orderCustomer}>
          {order.nickname}さん - {order.scheduledTime} 受取
        </Text>
        <Text style={styles.orderItems}>{order.items}</Text>
        <Text style={styles.orderAmount}>¥{order.totalAmount.toLocaleString()}</Text>
      </View>
      <View style={styles.orderActions}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => onPressDetail(order.id)}
        >
          <Text style={styles.detailButtonText}>詳細</Text>
        </TouchableOpacity>
        {order.status !== '受取済' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPressAction(order.id, order.status)}
          >
            <Text style={styles.actionButtonText}>
              {getActionLabel(order.status)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const filteredOrders = mockOrders.filter((order) => {
    switch (activeTab) {
      case 'pending':
        return order.status === '受付済';
      case 'preparing':
        return order.status === '調理中';
      case 'ready':
        return order.status === '準備完了';
      case 'completed':
        return order.status === '受取済';
      default:
        return true;
    }
  });

  const handlePressDetail = (orderId: string) => {
    console.log('注文詳細へ遷移:', orderId);
    // TODO: 注文詳細画面への遷移を実装
  };

  const handlePressAction = (orderId: string, status: OrderStatus) => {
    console.log('ステータス更新:', orderId, status);
    // TODO: 注文ステータスの更新を実装
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>注文管理</Text>
        <Text style={styles.subtitle}>注文の確認と状態の更新を行います</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsContent}>
          <TabButton
            label="受付済"
            isActive={activeTab === 'pending'}
            onPress={() => setActiveTab('pending')}
          />
          <TabButton
            label="調理中"
            isActive={activeTab === 'preparing'}
            onPress={() => setActiveTab('preparing')}
          />
          <TabButton
            label="準備完了"
            isActive={activeTab === 'ready'}
            onPress={() => setActiveTab('ready')}
          />
          <TabButton
            label="受取済"
            isActive={activeTab === 'completed'}
            onPress={() => setActiveTab('completed')}
          />
          <TabButton
            label="すべて"
            isActive={activeTab === 'all'}
            onPress={() => setActiveTab('all')}
          />
        </View>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>該当する注文がありません</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPressDetail={handlePressDetail}
              onPressAction={handlePressAction}
            />
          )}
          contentContainerStyle={styles.orderList}
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
    paddingBottom: 8,
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
  tabsContainer: {
    height: 44,
    overflow: 'scroll',
  },
  tabsContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    height: 44,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    height: 36,
  },
  tabButtonActive: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  orderList: {
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  detailButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#333333',
  },
  actionButtonText: {
    fontSize: 12,
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