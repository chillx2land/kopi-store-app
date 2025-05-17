import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// モックデータ
const orderSummary = {
  total: 12,
  pending: 3,
  preparing: 5,
  ready: 2,
  completed: 2,
};

const recentOrders = [
  {
    id: "ORD-001",
    nickname: "田中",
    status: "受付済",
    time: "10:30",
    items: "カフェラテ x1, クロワッサン x1",
  },
  {
    id: "ORD-002",
    nickname: "佐藤",
    status: "調理中",
    time: "10:25",
    items: "アメリカーノ x2",
  },
  {
    id: "ORD-003",
    nickname: "鈴木",
    status: "準備完了",
    time: "10:15",
    items: "カプチーノ x1, チョコレートケーキ x1",
  },
];

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <MaterialCommunityIcons name={icon} size={16} color="#666666" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

interface StatusBadgeProps {
  status: string;
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

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ダッシュボード</Text>
        <Text style={styles.subtitle}>店舗ID: {user?.id} - 本日の注文状況と店舗管理</Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          title="本日の注文数"
          value={orderSummary.total}
          subtitle="前日比 +15%"
          icon="clipboard-list"
        />
        <SummaryCard
          title="売上"
          value="¥24,500"
          subtitle="前日比 +20%"
          icon="currency-jpy"
        />
        <SummaryCard
          title="準備中の注文"
          value={orderSummary.preparing}
          subtitle="平均調理時間 5分"
          icon="coffee"
        />
        <SummaryCard
          title="受取待ち"
          value={orderSummary.ready}
          subtitle="最長待ち時間 10分"
          icon="clock-outline"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最新の注文</Text>
          <Text style={styles.sectionSubtitle}>直近の注文を確認して対応しましょう</Text>
        </View>

        <View style={styles.orderList}>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <StatusBadge status={order.status} />
                </View>
                <Text style={styles.orderCustomer}>
                  {order.nickname}さん - {order.time} 受取
                </Text>
                <Text style={styles.orderItems}>{order.items}</Text>
              </View>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>詳細</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>注文ステータス</Text>
          <Text style={styles.sectionSubtitle}>現在の注文状況</Text>
        </View>

        <View style={styles.statusList}>
          <View style={styles.statusItem}>
            <View style={styles.statusLabel}>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
              <Text>受付済</Text>
            </View>
            <Text style={styles.statusValue}>{orderSummary.pending}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusLabel}>
              <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
              <Text>調理中</Text>
            </View>
            <Text style={styles.statusValue}>{orderSummary.preparing}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusLabel}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text>準備完了</Text>
            </View>
            <Text style={styles.statusValue}>{orderSummary.ready}</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={styles.statusLabel}>
              <View style={[styles.statusDot, { backgroundColor: '#6B7280' }]} />
              <Text>受取済</Text>
            </View>
            <Text style={styles.statusValue}>{orderSummary.completed}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666666',
  },
  cardContent: {
    marginTop: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#333333',
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
  detailButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  statusList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
}); 