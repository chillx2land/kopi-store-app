"use client"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Clock, Coffee, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const { staff } = useAuth()

  // 注文のサマリーデータ（モック）
  const orderSummary = {
    total: 12,
    pending: 3,
    preparing: 5,
    ready: 2,
    completed: 2,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">店舗ID: {staff?.storeId} - 本日の注文状況と店舗管理</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日の注文数</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderSummary.total}</div>
            <p className="text-xs text-muted-foreground">前日比 +15%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">売上</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥24,500</div>
            <p className="text-xs text-muted-foreground">前日比 +20%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">準備中の注文</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderSummary.preparing}</div>
            <p className="text-xs text-muted-foreground">平均調理時間 5分</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">受取待ち</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderSummary.ready}</div>
            <p className="text-xs text-muted-foreground">最長待ち時間 10分</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最新の注文</CardTitle>
            <CardDescription>直近の注文を確認して対応しましょう</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "ORD-001",
                  nickname: "田中",
                  status: "受付済",
                  time: "10:30",
                  items: "カフェラテ x1, クロワッサン x1",
                },
                { id: "ORD-002", nickname: "佐藤", status: "調理中", time: "10:25", items: "アメリカーノ x2" },
                {
                  id: "ORD-003",
                  nickname: "鈴木",
                  status: "準備完了",
                  time: "10:15",
                  items: "カプチーノ x1, チョコレートケーキ x1",
                },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.nickname}さん - {order.time} 受取
                    </p>
                    <p className="text-sm">{order.items}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>注文ステータス</CardTitle>
            <CardDescription>現在の注文状況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span>受付済</span>
                </div>
                <span className="font-medium">{orderSummary.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>調理中</span>
                </div>
                <span className="font-medium">{orderSummary.preparing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>準備完了</span>
                </div>
                <span className="font-medium">{orderSummary.ready}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <span>受取済</span>
                </div>
                <span className="font-medium">{orderSummary.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
