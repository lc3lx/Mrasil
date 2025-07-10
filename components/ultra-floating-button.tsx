import { Plus } from "lucide-react"

export function UltraFloatingButton() {
  return (
    <button className="fixed bottom-24 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full luxury-primary shadow-lg transition-transform hover:scale-110 md:bottom-8 md:right-8">
      <Plus className="h-6 w-6 text-white" />
      <div className="absolute inset-0 rounded-full bg-white opacity-20 shimmer"></div>
    </button>
  )
}
