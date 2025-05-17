"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"

// メニューカテゴリの型定義
type MenuCategory = "coffee" | "tea" | "food" | "other"

// 新規メニューアイテムの型定義
interface NewMenuItem {
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

export default function NewMenuPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 新規メニューの初期値
  const [menuItem, setMenuItem] = useState<NewMenuItem>({
    name: "",
    description: "",
    price: 0,
    category: "coffee",
    imageUrl: "",
    isActive: true,
    isVisible: true,
    stock: 100,
    stockManaged: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    // 実際のアプリではAPIを呼び出してメニューを作成
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast({
      title: "メニューを作成しました",
      description: "新しいメニューアイテムが正常に作成されました",
    })

    router.push("/dashboard/menu")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">新規メニュー作成</h1>
          <p className="text-muted-foreground">新しいメニューアイテムを作成します</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>メニューの基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">メニュー名</Label>
                <Input
                  id="name"
                  value={menuItem.name}
                  onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={menuItem.description}
                  onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">価格（円）</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={menuItem.price}
                  onChange={(e) => setMenuItem({ ...menuItem, price: Number.parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Select
                  value={menuItem.category}
                  onValueChange={(value) => setMenuItem({ ...menuItem, category: value as MenuCategory })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">コーヒー</SelectItem>
                    <SelectItem value="tea">紅茶・お茶</SelectItem>
                    <SelectItem value="food">フード</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FileUpload
                id="menu-image"
                label="メニュー画像"
                value={menuItem.imageUrl}
                onChange={(value) => setMenuItem({ ...menuItem, imageUrl: value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>表示設定と在庫管理</CardTitle>
              <CardDescription>メニューの表示状態と在庫の管理設定を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-visible"
                  checked={menuItem.isVisible}
                  onCheckedChange={(checked) => setMenuItem({ ...menuItem, isVisible: checked })}
                />
                <Label htmlFor="is-visible">メニューを表示する</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={menuItem.isActive}
                  onCheckedChange={(checked) => setMenuItem({ ...menuItem, isActive: checked })}
                />
                <Label htmlFor="is-active">販売中にする</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="stock-managed"
                  checked={menuItem.stockManaged}
                  onCheckedChange={(checked) => setMenuItem({ ...menuItem, stockManaged: checked })}
                />
                <Label htmlFor="stock-managed">在庫管理を有効にする</Label>
              </div>
              {menuItem.stockManaged && (
                <div className="grid gap-2">
                  <Label htmlFor="stock">初期在庫数</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={menuItem.stock}
                    onChange={(e) => setMenuItem({ ...menuItem, stock: Number.parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">在庫が0になると自動的に販売停止になります</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "作成中..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    作成
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
