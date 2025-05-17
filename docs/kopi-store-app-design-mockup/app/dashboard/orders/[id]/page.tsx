"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Clock, Coffee, User } from "lucide-react"

// 注文ステータスの型定義
type OrderStatus = "受付済" | "調理中" | "準備完了" | "受取済"

// 注文アイテムの型定義
interface OrderItem {
  name: string
  price: number
  quantity: number
  options?: { name: string; value: string }[]
}

// 注文詳細の型定義
interface OrderDetail {
  id: string
  nickname: string
  status: OrderStatus
  scheduledTime: string
  createdAt: string
  items: OrderItem[]
  totalAmount: number
  couponCode?: string
  couponDiscount?: number
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // モック注文詳細データ
  const orderDetail: OrderDetail = {
    id: params.id,
    nickname: "田中",
    status: "調理中",
    scheduledTime: "10:30",
    createdAt: "2023-05-17 10:15",
    items: [
      {
        name: "カフェラテ",
        price: 450,
        quantity: 1,
        options: [
          { name: "サイズ", value: "M" },
          { name: "ミルク", value: "豆乳" },
          { name: "氷", value: "少なめ" },
        ],
      },
      {
        name: "クロワッサン",
        price: 400,
        quantity: 1,
      },
    ],
    totalAmount: 850,
    couponCode: "WELCOME10",
    couponDiscount: 100,
  }

  // 次のステータスを取得する関数
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "受付済":
        return "調理中"
      case "調理中":
        return "準備完了"
      case "準備完了":
        return "受取済"
      default:
        return null
    }
  }

  // ステータスを更新する関数
  const updateStatus = async () => {
    const nextStatus = getNextStatus(orderDetail.status)
    if (!nextStatus) return

    setIsUpdating(true)

    try {
      // 実際のアプリではAPIを呼び出してステータスを更新
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "ステータスを更新しました",
        description: `注文 ${orderDetail.id} のステータスを「${nextStatus}」に更新しました`,
      })

      // 実際のアプリではここでデータを再取得するか、状態を更新する
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ステータスの更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // ステータスに応じたバッジのバリアントを返す関数
  const getStatusBadgeVariant = (status: OrderStatus) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">注文詳細</h1>
          <p className="text-muted-foreground">注文ID: {orderDetail.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>注文情報</CardTitle>
            <CardDescription>注文の基本情報と状態</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">ニックネーム</span>
              </div>
              <span>{orderDetail.nickname}さん</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">受取予定時間</span>
              </div>
              <span>{orderDetail.scheduledTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">ステータス</span>
              </div>
              <Badge variant={getStatusBadgeVariant(orderDetail.status)}>{orderDetail.status}</Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">注文日時</p>
              <p>{orderDetail.createdAt}</p>
            </div>
            {orderDetail.couponCode && (
              <div>
                <p className="text-sm text-muted-foreground">適用クーポン</p>
                <p>
                  {orderDetail.couponCode} (-¥{orderDetail.couponDiscount})
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {getNextStatus(orderDetail.status) && (
              <Button className="w-full" onClick={updateStatus} disabled={isUpdating}>
                {isUpdating ? "更新中..." : `${getNextStatus(orderDetail.status)}に更新`}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>注文内容</CardTitle>
            <CardDescription>注文された商品とカスタマイズ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetail.items.map((item, index) => (
              <div key={index} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
                <p className="text-sm">¥{item.price.toLocaleString()}</p>
                {item.options && item.options.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">カスタマイズ</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((option, optIndex) => (
                        <Badge key={optIndex} variant="outline" className="text-xs">
                          {option.name}: {option.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="font-medium">合計</span>
            <span className="text-lg font-bold">¥{orderDetail.totalAmount.toLocaleString()}</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
