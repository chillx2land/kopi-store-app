"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 注文ステータスの型定義
type OrderStatus = "受付済" | "調理中" | "準備完了" | "受取済"

// 注文データの型定義
interface Order {
  id: string
  nickname: string
  status: OrderStatus
  scheduledTime: string
  createdAt: string
  items: string
  totalAmount: number
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
]

// ステータスに応じたバッジのバリアントを返す関数
function getStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "受付済":
      return "secondary"
    case "調理中":
      return "default"
    case "準備完了":
      return "success"
    case "受取済":
      return "outline"
    default:
      return "outline"
  }
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  // フィルタリングを適用した注文リストを取得
  const filteredOrders = mockOrders.filter((order) => {
    // タブフィルターに一致するか確認
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && order.status === "受付済") ||
      (activeTab === "preparing" && order.status === "調理中") ||
      (activeTab === "ready" && order.status === "準備完了") ||
      (activeTab === "completed" && order.status === "受取済")

    return matchesTab
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">注文管理</h1>
        <p className="text-muted-foreground">注文の確認と状態の更新を行います</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">受付済</TabsTrigger>
          <TabsTrigger value="preparing">調理中</TabsTrigger>
          <TabsTrigger value="ready">準備完了</TabsTrigger>
          <TabsTrigger value="completed">受取済</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <OrderList orders={filteredOrders} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <OrderList orders={filteredOrders} />
        </TabsContent>
        <TabsContent value="preparing" className="mt-4">
          <OrderList orders={filteredOrders} />
        </TabsContent>
        <TabsContent value="ready" className="mt-4">
          <OrderList orders={filteredOrders} />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <OrderList orders={filteredOrders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <p className="text-center text-muted-foreground">該当する注文がありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.id}</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.nickname}さん - {order.scheduledTime} 受取
                </p>
                <p className="text-sm">{order.items}</p>
                <p className="text-sm font-medium">¥{order.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row">
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </Link>
                {order.status !== "受取済" && (
                  <Button size="sm">
                    {order.status === "受付済" ? "調理開始" : order.status === "調理中" ? "準備完了" : "受取完了"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
