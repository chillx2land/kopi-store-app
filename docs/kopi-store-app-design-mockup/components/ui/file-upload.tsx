"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function FileUpload({
  id,
  label,
  value,
  onChange,
  accept = "image/*",
  maxSize = 5, // 5MB default
  className,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`ファイルサイズが大きすぎます。${maxSize}MB以下のファイルを選択してください。`)
      return
    }

    setError(null)

    // Create a preview
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      onChange(result) // Pass base64 string to parent
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <Upload className="mr-2 h-4 w-4" />
            ファイルを選択
          </Button>
          {preview && (
            <Button type="button" variant="outline" size="icon" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input id={id} ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {preview && (
          <div className="relative mt-2 overflow-hidden rounded-md border">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="h-48 w-full object-cover" />
          </div>
        )}
        {!preview && value && value.startsWith("http") && (
          <div className="relative mt-2 overflow-hidden rounded-md border">
            <img src={value || "/placeholder.svg"} alt="Current" className="h-48 w-full object-cover" />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {accept === "image/*" ? "JPG, PNG, GIF" : accept} 形式、{maxSize}MB以下
        </p>
      </div>
    </div>
  )
}
