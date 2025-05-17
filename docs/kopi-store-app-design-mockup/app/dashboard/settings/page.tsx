"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, Trash2, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// 特別営業日の型定義
interface SpecialBusinessDay {
  id: string
  date: Date
  isOpen: boolean
  openTime: string
  closeTime: string
  note: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [newSpecialDay, setNewSpecialDay] = useState<Omit<SpecialBusinessDay, "id">>({
    date: new Date(),
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    note: "",
  })
  const [isAddingSpecialDay, setIsAddingSpecialDay] = useState(false)

  // 店舗情報のモックデータ
  const [storeInfo, setStoreInfo] = useState({
    name: "Kopi 渋谷店",
    address: "東京都渋谷区渋谷1-1-1",
    phone: "03-1234-5678",
    description: "渋谷駅から徒歩5分のカフェです。こだわりのコーヒーと手作りスイーツをご提供しています。",
    maxOrdersPer15Min: 5,
    storeImage: "/placeholder.svg?height=300&width=600",
    storeIcon: "/placeholder.svg?height=200&width=200",
    openingHours: {
      monday: { open: "08:00", close: "20:00", isOpen: true },
      tuesday: { open: "08:00", close: "20:00", isOpen: true },
      wednesday: { open: "08:00", close: "20:00", isOpen: true },
      thursday: { open: "08:00", close: "20:00", isOpen: true },
      friday: { open: "08:00", close: "21:00", isOpen: true },
      saturday: { open: "09:00", close: "21:00", isOpen: true },
      sunday: { open: "09:00", close: "19:00", isOpen: true },
    },
    specialBusinessDays: [
      {
        id: "special-1",
        date: new Date(2025, 0, 1), // 2025年1月1日（元日）
        isOpen: false,
        openTime: "",
        closeTime: "",
        note: "元日のため休業",
      },
      {
        id: "special-2",
        date: new Date(2025, 4, 5), // 2025年5月5日（こどもの日）
        isOpen: true,
        openTime: "10:00",
        closeTime: "16:00",
        note: "こどもの日特別営業時間",
      },
    ] as SpecialBusinessDay[],
  })

  const handleSaveStoreInfo = async () => {
    setIsLoading(true)
    // 実際のアプリではAPIを呼び出して店舗情報を更新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast({
      title: "店舗情報を更新しました",
      description: "変更が保存されました",
    })
  }

  const handleAddSpecialDay = () => {
    if (!newSpecialDay.date) return

    const newId = `special-${Date.now()}`
    const newSpecialDayWithId = {
      ...newSpecialDay,
      id: newId,
    }

    setStoreInfo((prev) => ({
      ...prev,
      specialBusinessDays: [...prev.specialBusinessDays, newSpecialDayWithId],
    }))

    setNewSpecialDay({
      date: new Date(),
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
      note: "",
    })
    setIsAddingSpecialDay(false)

    toast({
      title: "特別営業日を追加しました",
      description: `${format(newSpecialDay.date, "yyyy年MM月dd日")}の特別設定を追加しました`,
    })
  }

  const handleDeleteSpecialDay = (id: string) => {
    setStoreInfo((prev) => ({
      ...prev,
      specialBusinessDays: prev.specialBusinessDays.filter((day) => day.id !== id),
    }))

    toast({
      title: "特別営業日を削除しました",
      description: "特別営業日の設定を削除しました",
    })
  }

  // 日付が既に特別営業日として登録されているかチェック
  const isDateAlreadySpecial = (date: Date) => {
    return storeInfo.specialBusinessDays.some((day) => format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">店舗設定</h1>
        <p className="text-muted-foreground">店舗情報と営業設定を管理します</p>
      </div>

      <Tabs defaultValue="store-info">
        <TabsList>
          <TabsTrigger value="store-info">店舗情報</TabsTrigger>
          <TabsTrigger value="hours">営業時間</TabsTrigger>
          <TabsTrigger value="special-days">特別営業日</TabsTrigger>
          <TabsTrigger value="order-settings">注文設定</TabsTrigger>
        </TabsList>

        <TabsContent value="store-info" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>店舗の基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store-name">店舗名</Label>
                <Input
                  id="store-name"
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-address">住所</Label>
                <Input
                  id="store-address"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-phone">電話番号</Label>
                <Input
                  id="store-phone"
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-description">店舗説明</Label>
                <Textarea
                  id="store-description"
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo} disabled={isLoading}>
                {isLoading ? "保存中..." : "保存"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>店舗画像</CardTitle>
              <CardDescription>店舗の写真とアイコンを設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                id="store-image"
                label="店舗の写真"
                value={storeInfo.storeImage}
                onChange={(value) => setStoreInfo((prev) => ({ ...prev, storeImage: value }))}
                maxSize={10}
              />
              <FileUpload
                id="store-icon"
                label="店舗のアイコン"
                value={storeInfo.storeIcon}
                onChange={(value) => setStoreInfo((prev) => ({ ...prev, storeIcon: value }))}
                maxSize={2}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo} disabled={isLoading}>
                {isLoading ? "保存中..." : "保存"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>営業時間</CardTitle>
              <CardDescription>曜日ごとの営業時間を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(storeInfo.openingHours).map(([day, hours]) => {
                const dayNames: Record<string, string> = {
                  monday: "月曜日",
                  tuesday: "火曜日",
                  wednesday: "水曜日",
                  thursday: "木曜日",
                  friday: "金曜日",
                  saturday: "土曜日",
                  sunday: "日曜日",
                }

                return (
                  <div key={day} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${day}-status`}
                        checked={hours.isOpen}
                        onChange={(e) => {
                          setStoreInfo((prev) => ({
                            ...prev,
                            openingHours: {
                              ...prev.openingHours,
                              [day]: { ...hours, isOpen: e.target.checked },
                            },
                          }))
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`${day}-status`}>{dayNames[day]}</Label>
                    </div>
                    {hours.isOpen && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => {
                            setStoreInfo((prev) => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...hours, open: e.target.value },
                              },
                            }))
                          }}
                          className="w-32"
                        />
                        <span>〜</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => {
                            setStoreInfo((prev) => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...hours, close: e.target.value },
                              },
                            }))
                          }}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo}>保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="special-days" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>特別営業日設定</CardTitle>
              <CardDescription>特定の日付に対して個別の営業時間を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAddingSpecialDay ? (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">新規特別営業日</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingSpecialDay(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="special-date">日付</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="special-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newSpecialDay.date ? (
                              format(newSpecialDay.date, "yyyy年MM月dd日", { locale: ja })
                            ) : (
                              <span>日付を選択</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newSpecialDay.date}
                            onSelect={(date) => {
                              if (date && isDateAlreadySpecial(date)) {
                                toast({
                                  title: "日付が重複しています",
                                  description: "この日付は既に特別営業日として登録されています",
                                  variant: "destructive",
                                })
                                return
                              }
                              setNewSpecialDay((prev) => ({ ...prev, date: date || new Date() }))
                            }}
                            disabled={(date) => isDateAlreadySpecial(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="new-special-is-open"
                          checked={newSpecialDay.isOpen}
                          onCheckedChange={(checked) => setNewSpecialDay((prev) => ({ ...prev, isOpen: checked }))}
                        />
                        <Label htmlFor="new-special-is-open">営業する</Label>
                      </div>
                      {newSpecialDay.isOpen && (
                        <div className="mt-4 flex items-center gap-2">
                          <Input
                            type="time"
                            value={newSpecialDay.openTime}
                            onChange={(e) => setNewSpecialDay((prev) => ({ ...prev, openTime: e.target.value }))}
                            className="w-32"
                          />
                          <span>〜</span>
                          <Input
                            type="time"
                            value={newSpecialDay.closeTime}
                            onChange={(e) => setNewSpecialDay((prev) => ({ ...prev, closeTime: e.target.value }))}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="special-note">メモ</Label>
                    <Textarea
                      id="special-note"
                      placeholder="特別営業日の理由や備考"
                      value={newSpecialDay.note}
                      onChange={(e) => setNewSpecialDay((prev) => ({ ...prev, note: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingSpecialDay(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={handleAddSpecialDay}>追加</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingSpecialDay(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  特別営業日を追加
                </Button>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium">登録済み特別営業日</h3>
                {storeInfo.specialBusinessDays.length === 0 ? (
                  <p className="text-sm text-muted-foreground">特別営業日は登録されていません</p>
                ) : (
                  <div className="space-y-2">
                    {storeInfo.specialBusinessDays
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((day) => (
                        <div key={day.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-1">
                            <div className="font-medium">{format(day.date, "yyyy年MM月dd日(E)", { locale: ja })}</div>
                            <div className="text-sm">
                              {day.isOpen ? (
                                <span className="text-green-600">
                                  営業: {day.openTime} 〜 {day.closeTime}
                                </span>
                              ) : (
                                <span className="text-red-600">休業</span>
                              )}
                            </div>
                            {day.note && <p className="text-sm text-muted-foreground">{day.note}</p>}
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>特別営業日の削除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {format(day.date, "yyyy年MM月dd日", { locale: ja })}
                                  の特別設定を削除してもよろしいですか？
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSpecialDay(day.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  削除する
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo}>保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="order-settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>注文設定</CardTitle>
              <CardDescription>注文の受付に関する設定を行います</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">15分あたりの上限注文数</h3>
                  <p className="text-xs text-muted-foreground">
                    15分間に受け付ける最大の注文数を設定します。これを超える注文はアプリ上で「混雑中」と表示され、受付が制限されます。
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-orders">上限注文数: {storeInfo.maxOrdersPer15Min}件</Label>
                    <span className="text-sm text-muted-foreground">
                      {storeInfo.maxOrdersPer15Min === 0 ? "無制限" : `${storeInfo.maxOrdersPer15Min}件まで`}
                    </span>
                  </div>
                  <Slider
                    id="max-orders"
                    min={0}
                    max={20}
                    step={1}
                    value={[storeInfo.maxOrdersPer15Min]}
                    onValueChange={(value) => {
                      setStoreInfo((prev) => ({ ...prev, maxOrdersPer15Min: value[0] }))
                    }}
                  />
                  <p className="text-xs text-muted-foreground">0に設定すると上限なし（無制限）になります</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreInfo}>保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
