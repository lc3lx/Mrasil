import { Badge } from "@/components/ui/badge"

export function LocalIndicatorExample() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">أمثلة على المؤشرات المحلية</h2>

      {/* مثال 1: مؤشر محلي بجانب النص العادي */}
      <div className="flex items-center gap-2 p-4 border rounded-md">
        <span>عنصر مع مؤشر محلي:</span>
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>محلي</span>
        </div>
      </div>

      {/* مثال 2: مؤشر محلي بجانب البادج */}
      <div className="flex items-center gap-2 p-4 border rounded-md">
        <Badge>بادج عادي</Badge>
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>محلي</span>
        </div>
      </div>

      {/* مثال 3: بادج مع مؤشر محلي مدمج */}
      <div className="flex items-center gap-2 p-4 border rounded-md">
        <div className="relative inline-flex">
          <Badge className="pr-6">بادج مع مؤشر</Badge>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
