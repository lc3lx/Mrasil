"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const presetColors = [
  "#3498db", // أزرق
  "#2ecc71", // أخضر
  "#e74c3c", // أحمر
  "#f39c12", // برتقالي
  "#9b59b6", // بنفسجي
  "#1abc9c", // فيروزي
  "#34495e", // رمادي داكن
  "#7f8c8d", // رمادي
  "#2c3e50", // كحلي
  "#c0392b", // أحمر داكن
  "#16a085", // أخضر داكن
  "#8e44ad", // أرجواني
  "#f1c40f", // أصفر
  "#d35400", // برتقالي داكن
  "#27ae60", // أخضر متوسط
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", className)}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: value }} />
            <span>{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <div
              key={color}
              style={{ backgroundColor: color }}
              className="h-6 w-6 cursor-pointer rounded-md border"
              onClick={() => onChange(color)}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: value }} />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 rounded-md border px-2 py-1 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
