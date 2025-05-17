"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type StaffRole = "staff" | "manager"

interface Staff {
  id: string
  name: string
  email: string
  role: StaffRole
  storeId: string
}

interface AuthContextType {
  staff: Staff | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // ブラウザ環境でのみローカルストレージにアクセス
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        // 実際のアプリではトークンの検証とユーザー情報の取得を行う
        // ここではモックデータを使用
        setStaff({
          id: "1",
          name: "山田太郎",
          email: "yamada@kopi.com",
          role: "manager",
          storeId: "store-1",
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // 実際のアプリではAPIを呼び出してJWTトークンを取得
      // ここではモックデータを使用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "demo@kopi.com" && password === "password") {
        const mockStaff = {
          id: "1",
          name: "山田太郎",
          email: "yamada@kopi.com",
          role: "manager" as StaffRole,
          storeId: "store-1",
        }

        // ブラウザ環境でのみローカルストレージにアクセス
        if (typeof window !== "undefined") {
          localStorage.setItem("token", "mock-jwt-token")
        }
        setStaff(mockStaff)
        router.push("/dashboard")
      } else {
        throw new Error("メールアドレスまたはパスワードが正しくありません")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setStaff(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ staff, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
