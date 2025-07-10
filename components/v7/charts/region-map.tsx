"use client"

import { useState } from "react"

interface RegionData {
  name: string
  value: number
  id: string
  path: string
}

interface RegionMapProps {
  data: Array<{ name: string; value: number }>
  height?: number
}

// Simplified SVG paths for Saudi Arabia regions
const regionPaths: Record<string, string> = {
  الرياض: "M200,150 L250,150 L250,200 L200,200 Z",
  "مكة المكرمة": "M150,200 L200,200 L200,250 L150,250 Z",
  "المدينة المنورة": "M100,150 L150,150 L150,200 L100,200 Z",
  القصيم: "M200,100 L250,100 L250,150 L200,150 Z",
  "المنطقة الشرقية": "M250,150 L300,150 L300,200 L250,200 Z",
  عسير: "M150,250 L200,250 L200,300 L150,300 Z",
  تبوك: "M100,100 L150,100 L150,150 L100,150 Z",
  حائل: "M150,100 L200,100 L200,150 L150,150 Z",
  "الحدود الشمالية": "M150,50 L200,50 L200,100 L150,100 Z",
  جازان: "M150,300 L200,300 L200,350 L150,350 Z",
  نجران: "M200,250 L250,250 L250,300 L200,300 Z",
  الباحة: "M125,250 L150,250 L150,275 L125,275 Z",
  الجوف: "M100,50 L150,50 L150,100 L100,100 Z",
}

export function RegionMap({ data, height = 400 }: RegionMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Prepare data with SVG paths
  const regionsWithPaths: RegionData[] = data.map((region) => ({
    ...region,
    id: region.name.replace(/\s+/g, "-").toLowerCase(),
    path: regionPaths[region.name] || "",
  }))

  // Find max value for color scaling
  const maxValue = Math.max(...data.map((item) => item.value))

  // Get color intensity based on value
  const getColor = (value: number) => {
    const intensity = Math.max(0, Math.min(0.9, (value / maxValue) * 0.9))
    return `rgba(52, 152, 219, ${0.2 + intensity})`
  }

  // Get border color based on hover/selection state
  const getBorderColor = (regionName: string) => {
    if (selectedRegion === regionName) return "#2980b9"
    if (hoveredRegion === regionName) return "#3498db"
    return "#e6edf3"
  }

  return (
    <div className="relative h-full w-full" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ direction: "ltr" }}>
        {regionsWithPaths.map((region) => (
          <g key={region.id}>
            <path
              d={region.path}
              fill={getColor(region.value)}
              stroke={getBorderColor(region.name)}
              strokeWidth={selectedRegion === region.name || hoveredRegion === region.name ? 2 : 1}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => setSelectedRegion(region.name === selectedRegion ? null : region.name)}
              className="transition-all duration-200 cursor-pointer"
            />
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md shadow-sm text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-[rgba(52,152,219,0.2)]"></div>
          <span>أقل</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[rgba(52,152,219,1)]"></div>
          <span>أكثر</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredRegion && (
        <div
          className="absolute bg-white p-2 rounded-md shadow-md text-sm pointer-events-none"
          style={{
            top: "10px",
            right: "10px",
          }}
        >
          <div className="font-bold text-[#3498db]">{hoveredRegion}</div>
          <div className="text-[#6d6a67]">{data.find((r) => r.name === hoveredRegion)?.value} شحنة</div>
        </div>
      )}
    </div>
  )
}
