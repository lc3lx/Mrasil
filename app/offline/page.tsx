import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <WifiOff className="h-12 w-12 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-semibold">أنت غير متصل بالإنترنت</h1>
      <p className="mt-2 text-muted-foreground">
        يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى
      </p>
    </div>
  )
} 