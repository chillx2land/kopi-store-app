"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit } from "lucide-react"

// メニューカテゴリの型定義
type MenuCategory = "coffee" | "tea" | "food" | "other"

// メニューアイテムの型定義
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  imageUrl: string
  isActive: boolean
  isVisible: boolean
  stock: number
  stockManaged: boolean
}

// モックメニューデータ
const mockMenuItems: MenuItem[] = [
  {
    id: "menu-001",
    name: "カフェラテ",
    description: "濃厚なエスプレッソとミルクのハーモニー",
    price: 450,
    category: "coffee",
    imageUrl: "/placeholder.svg?height=100&width=100",
    isActive: true,
    isVisible: true,
    stock: 100,
    stockManaged: false,
  },
  {
    id: "menu-002",
    name: "アメリカーノ",
    description: "すっきりとした味わいのブラックコーヒー",
    price: 350,
    category: "coffee",
    imageUrl: "/placeholder.svg?height=100&width=100",
    isActive: true,
    isVisible: true,
    stock: 100,
    stockManaged: false,
  },
  {
    id: "menu-003",
    name: "抹茶ラテ",
    description: "京都産の抹茶を使用した風味豊かなラテ",
    price: 500,
    category: "tea",
    imageUrl: "/placeholder.svg?height=100&width=100",
    isActive: true,
    isVisible: true,
    stock: 50,
    stockManaged: true,
  },
  {
    id: "menu-004",
    name: "クロワッサン",
    description: "バターの香り豊かなサクサクのクロワッサン",
    price: 300,
    category: "food",
    imageUrl: "/placeholder.svg?height=100&width=100",
    isActive: true,
    isVisible: true,
    stock: 15,
    stockManaged: true,
  },
  {
    id: "menu-005",
    name: "チョコレートケーキ",
    description: "濃厚なチョコレートの風味が楽しめるケーキ",
    price: 450,
    category: "food",
    imageUrl: "/placeholder.svg?height=100&width=100",
    isActive: false,
    isVisible: false,
    stock: 0,
    stockManaged: true,
  },
]

// カテゴリ名の日本語マッピング
const categoryNames: Record<MenuCategory, string> = {
  coffee: "コーヒー",
  tea: "紅茶・お茶",
  food: "フード",
  other: "その他",
}

export default function MenuPage() {
  const [menuItems] = useState<MenuItem[]>(mockMenuItems)
  const [activeTab, setActiveTab] = useState("all")

  // フィルタリングを適用したメニューリストを取得
  const filteredMenuItems = menuItems.filter((item) => {
    // タブフィルターに一致するか確認
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && item.isActive && item.isVisible) ||
      (activeTab === "inactive" && !item.isActive) ||
      (activeTab === "hidden" && !item.isVisible) ||
      (activeTab === "out-of-stock" && item.stockManaged && item.stock <= 0) ||
      activeTab === item.category

    return matchesTab
  })

  // 在庫状況に応じたバッジを表示する関数
  const renderStockBadge = (item: MenuItem) => {
    if (!item.stockManaged) return null

    if (item.stock <= 0) {
      return <Badge variant="destructive">在庫なし</Badge>
    } else if (item.stock < 5) {
      return <Badge variant="warning">残り{item.stock}個</Badge>
    } else {
      return <Badge variant="outline">在庫: {item.stock}個</Badge>
    }
  }

  // ステータスバッジを表示する関数
  const renderStatusBadge = (item: MenuItem) => {
    if (!item.isVisible) {
      return <Badge variant="outline">非表示</Badge>
    } else if (!item.isActive) {
      return <Badge variant="secondary">販売停止中</Badge>
    } else if (item.stockManaged && item.stock <= 0) {
      return <Badge variant="destructive">在庫切れ</Badge>
    } else {
      return <Badge variant="success">販売中</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">メニュー管理</h1>
          <p className="text-muted-foreground">メニューの追加、編集、削除を行います</p>
        </div>
        <Link href="/dashboard/menu/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規メニュー
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="active">販売中</TabsTrigger>
          <TabsTrigger value="inactive">販売停止</TabsTrigger>
          <TabsTrigger value="hidden">非表示</TabsTrigger>
          <TabsTrigger value="out-of-stock">在庫切れ</TabsTrigger>
          <TabsTrigger value="coffee">コーヒー</TabsTrigger>
          <TabsTrigger value="tea">紅茶・お茶</TabsTrigger>
          <TabsTrigger value="food">フード</TabsTrigger>
          <TabsTrigger value="other">その他</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {filteredMenuItems.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">該当するメニューがありません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredMenuItems.map((item) => (
                <Card key={item.id} className={!item.isActive || !item.isVisible ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            {renderStatusBadge(item)}
                          </div>
                          <span className="font-medium">¥{item.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{categoryNames[item.category]}</Badge>
                          {renderStockBadge(item)}
                          <div className="flex-1"></div>
                          <Link href={`/dashboard/menu/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              編集
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
