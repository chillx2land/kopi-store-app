"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function TimePickerDemo() {
  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1.5">
        <Label htmlFor="time">時間</Label>
        <div className="flex items-center gap-2">
          <Input id="time" type="time" className="w-[180px]" />
        </div>
      </div>
    </div>
  )
}
