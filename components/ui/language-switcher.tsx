"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/i18n/LanguageContext"

export function LanguageSwitcher() {
  const { selectedLang, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(selectedLang === "ar" ? "en" : "ar")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-muted-foreground-600 hover:text-muted-foreground-900 dark:text-muted-foreground-400 dark:hover:text-muted-foreground-100"
    >
      {selectedLang === "ar" ? "English" : "العربية"}
    </Button>
  )
} 