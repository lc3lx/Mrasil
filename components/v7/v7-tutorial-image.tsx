"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface TutorialImageProps {
  src: string
  alt: string
  caption?: string
}

export function TutorialImage({ src, alt, caption }: TutorialImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Usar imágenes de placeholder.com como alternativa confiable
  // Estas imágenes siempre funcionarán y mostrarán el texto proporcionado
  const getPlaceholderImage = (text: string) => {
    // Codificar el texto para usarlo en la URL
    const encodedText = encodeURIComponent(text)
    return `https://placehold.co/600x400/e6f7ff/3498db?text=${encodedText}`
  }

  // Imagen de respaldo en caso de error
  const fallbackImage = getPlaceholderImage(alt || "صورة توضيحية")

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 cursor-pointer">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {hasError ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 text-center min-h-[150px]">
          <img
            src={fallbackImage || "/placeholder.svg"}
            alt={alt || "صورة توضيحية"}
            className="w-full h-auto object-contain max-h-[200px]"
            loading="lazy"
          />
        </div>
      ) : (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-auto object-contain max-h-[200px]"
          loading="lazy"
          onClick={() => window.open(src, "_blank")}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.error("Error loading image:", src)
            setIsLoading(false)
            setHasError(true)
          }}
        />
      )}

      {caption && <div className="p-2 text-sm bg-gray-100 dark:bg-gray-700 text-center">{caption}</div>}
    </div>
  )
}
