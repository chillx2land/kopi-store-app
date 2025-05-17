"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Coffee, LayoutDashboard, ClipboardList, Settings, LogOut, Menu, BookOpen } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

function SidebarLink({ href, icon, children, onClick }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  )
}

export function Sidebar() {
  const { logout, staff } = useAuth()
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleStoreStatusChange = async (checked: boolean) => {
    setIsUpdating(true)
    // 実際のアプリではAPIを呼び出して店舗の営業状態を更新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsOpen(checked)
    setIsUpdating(false)

    toast({
      title: checked ? "営業開始しました" : "営業終了しました",
      description: checked ? "お客様からの注文を受け付けています" : "お客様からの注文を停止しました",
    })
  }

  const links = (
    <>
      <div className="flex items-center gap-2 px-3 py-2">
        <Coffee className="h-6 w-6" />
        <span className="text-lg font-semibold">Kopi Store</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-muted-foreground">ようこそ、{staff?.name}さん</p>
        <div className="mt-2 flex items-center justify-between rounded-lg border p-2">
          <div className="flex items-center gap-2">
            <Switch
              id="store-status"
              checked={isOpen}
              onCheckedChange={handleStoreStatusChange}
              disabled={isUpdating}
            />
            <span className="text-sm">営業状態</span>
          </div>
          <Badge variant={isOpen ? "default" : "outline"} className="ml-2">
            {isOpen ? "営業中" : "準備中"}
          </Badge>
        </div>
      </div>
      <div className="space-y-1 px-3 py-2">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setOpen(false)}>
          ダッシュボード
        </SidebarLink>
        <SidebarLink
          href="/dashboard/orders"
          icon={<ClipboardList className="h-4 w-4" />}
          onClick={() => setOpen(false)}
        >
          注文管理
        </SidebarLink>
        <SidebarLink href="/dashboard/menu" icon={<BookOpen className="h-4 w-4" />} onClick={() => setOpen(false)}>
          メニュー管理
        </SidebarLink>
        <SidebarLink href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} onClick={() => setOpen(false)}>
          店舗設定
        </SidebarLink>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* モバイル用サイドバー */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">{links}</div>
        </SheetContent>
      </Sheet>

      {/* デスクトップ用サイドバー */}
      <div className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-full flex-col">{links}</div>
      </div>
    </>
  )
}
