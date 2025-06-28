"use client"

import { useState } from "react"
import { Plus, Package, Truck, CreditCard, X } from "lucide-react"

export function ModernFloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { icon: Package, label: "شحنة جديدة", color: "bg-purple-500" },
    { icon: Truck, label: "تتبع شحنة", color: "bg-amber-500" },
    { icon: CreditCard, label: "دفع", color: "bg-green-500" },
  ]

  return (
    <div className="fixed bottom-24 right-6 z-20 md:bottom-8 md:right-8">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-2 rounded-xl ${item.color} px-3 py-2 text-white shadow-lg transition-all duration-300`}
              style={{
                transform: `translateY(${-16 - index * 60}px)`,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={toggleMenu}
        className="flex h-14 w-14 items-center justify-center rounded-full modern-gradient-primary shadow-lg transition-transform hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
      </button>
    </div>
  )
}
