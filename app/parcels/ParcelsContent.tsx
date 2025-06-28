"use client"

import type React from "react"
import { useState, Suspense, useEffect, useMemo } from "react"
import { Box, Package, Check, Info, Scale, Ruler, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { keyframes } from "@emotion/react"
import { css } from "@emotion/css"
import { useGetAllParcelsQuery } from "@/app/api/parcelsApi"
import CustomParcelDialog from "./CustomParcelDialog"

const spinSlow = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const animateSpinSlow = css`
  animation: ${spinSlow} 4s linear infinite;
`

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
  </div>
)

type Language = 'ar' | 'en';

type TranslationType = {
  pageTitle: string;
  customizeSize: string;
  shippingInfo: string;
  chooseParcelSize: string;
  maxWeight: string;
  maxDimensions: string;
  customParcelTitle: string;
  customParcelDesc: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  description: string;
  cancel: string;
  confirm: string;
  examples: string;
  upTo: string;
  examplesLabel: string;
};

type Translations = {
  [key in Language]: TranslationType;
};

// Define translations outside the component
const translations: Translations = {
  ar: {
    pageTitle: "أحجام الطرود",
    customizeSize: "تخصيص الحجم",
    shippingInfo: "معلومات الشحن",
    chooseParcelSize: "اختر حجم الطرد المناسب لشحنتك. يمكنك اختيار من بين الأحجام القياسية أو تخصيص حجم مخصص.",
    maxWeight: "الوزن الأقصى: 30 كجم",
    maxDimensions: "الأبعاد القصوى: 30 × 30 × 30 سم",
    customParcelTitle: "تخصيص حجم الطرد",
    customParcelDesc: "أدخل أبعاد ووزن الطرد المخصص الخاص بك",
    length: "الطول (سم)",
    width: "العرض (سم)",
    height: "الارتفاع (سم)",
    weight: "الوزن (كجم)",
    description: "وصف المحتويات",
    cancel: "إلغاء",
    confirm: "تأكيد",
    examples: "أمثلة",
    upTo: "حتى",
    examplesLabel: "أمثلة:",
  },
  en: {
    pageTitle: "Parcel Sizes",
    customizeSize: "Customize Size",
    shippingInfo: "Shipping Information",
    chooseParcelSize: "Choose the appropriate parcel size for your shipment. You can select from standard sizes or customize a specific size.",
    maxWeight: "Maximum Weight: 30 kg",
    maxDimensions: "Maximum Dimensions: 30 × 30 × 30 cm",
    customParcelTitle: "Customize Parcel Size",
    customParcelDesc: "Enter your custom parcel dimensions and weight",
    length: "Length (cm)",
    width: "Width (cm)",
    height: "Height (cm)",
    weight: "Weight (kg)",
    description: "Contents Description",
    cancel: "Cancel",
    confirm: "Confirm",
    examples: "Examples",
    upTo: "Up to",
    examplesLabel: "Examples:",
  },
};

export default function ParcelsContent() {
  const [mounted, setMounted] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const router = useRouter()
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [language, setLanguage] = useState<Language>('ar')
  
  // Skip API call until component is mounted
  const { data: parcelsData, isLoading, error } = useGetAllParcelsQuery(undefined, {
    skip: !mounted
  })

  const [customParcel, setCustomParcel] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    description: "",
    title: ""
  })

  // Handle client-side initialization
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle language initialization and changes
  useEffect(() => {
    if (!mounted) return;

    const initializeLanguage = () => {
      try {
        const storedLang = localStorage.getItem('v7-lang');
        if (storedLang && (storedLang === 'ar' || storedLang === 'en')) {
          setLanguage(storedLang as Language);
          document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
        }
      } catch (error) {
        console.error('Error reading language from localStorage:', error);
      }
    };

    initializeLanguage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'v7-lang' && event.newValue) {
        if (event.newValue === 'ar' || event.newValue === 'en') {
          setLanguage(event.newValue as Language);
          document.documentElement.dir = event.newValue === 'ar' ? 'rtl' : 'ltr';
        }
      }
    };

    const handleCustomLanguageChange = (e: CustomEvent) => {
      const newLang = e.detail?.language;
      if (newLang && (newLang === 'ar' || newLang === 'en')) {
        setLanguage(newLang as Language);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        try {
          localStorage.setItem('v7-lang', newLang);
        } catch (error) {
          console.error('Error saving language to localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('v7-language-change', handleCustomLanguageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('v7-language-change', handleCustomLanguageChange as EventListener);
    };
  }, [mounted]);

  // Return null during server-side rendering or initial mount
  if (!mounted) {
    return null;
  }

  // Get current translations
  const currentTranslations = translations[language];

  // Map API data to UI format
  const parcelSizes = parcelsData?.data?.length 
    ? parcelsData.data.map(parcel => ({
        id: parcel.id,
        name: parcel.title,
        dimensions: `${parcel.dimensions.length} × ${parcel.dimensions.width} × ${parcel.dimensions.height} cm`,
        maxWeight: `${parcel.maxWeight} kg`,
        price: `${parcel.price} SAR`,
        description: parcel.description,
        icon: `${parcel.id}-package.png`,
        isPublic: parcel.isPublic,
        createdAt: parcel.createdAt,
        color: {
          'xs': 'from-blue-400 to-blue-500',
          's': 'from-green-400 to-green-500',
          'm': 'from-yellow-400 to-yellow-500',
          'l': 'from-orange-400 to-orange-500',
          'xl': 'from-red-400 to-red-500',
          'custom': 'from-purple-400 to-purple-500'
        }[parcel.id] || 'from-gray-400 to-gray-500'
      }))
    : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const handleContinue = () => {
    if (selectedSize) {
      router.push(`/create-shipment?parcelSize=${selectedSize}`)
    }
  }

  const handleCustomParcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomParcel((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCustomParcelSubmit = () => {
    console.log("Custom parcel submitted:", customParcel)
    setSelectedSize("custom")
    setIsCustomDialogOpen(false)
  }

  const openCustomDialog = () => {
    setIsCustomDialogOpen(true)
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="v7-neu-icon bg-gradient-to-br from-[#3498db]/80 to-[#3498db] dark:from-[#3498db]/60 dark:to-[#3498db]/80">
            <Box className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-muted-foreground-700 dark:text-muted-foreground-200">
            {currentTranslations.pageTitle}
          </h1>
        </div>
        <Button
          onClick={openCustomDialog}
          className="w-full sm:w-auto v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] dark:from-[#3498db]/80 dark:to-[#2980b9]/80 transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-1" />
          {currentTranslations.customizeSize}
        </Button>
      </div>

      <div className="v7-neu-card p-4 sm:p-6 rounded-xl mb-8 dark:bg-muted-900">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#3498db]/20 dark:border-[#3498db]/10">
          <div className="v7-neu-icon-sm dark:bg-muted-800">
            <Info className="h-5 w-5 text-[#3498db]" />
          </div>
          <h2 className="text-xl font-bold text-muted-foreground-700 dark:text-muted-foreground-200">
            {currentTranslations.shippingInfo}
          </h2>
        </div>
        <p className="text-muted-foreground-600 dark:text-muted-foreground-400 mb-4">
          {currentTranslations.chooseParcelSize}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground-500 dark:text-muted-foreground-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3498db]/10 dark:bg-[#3498db]/5 flex items-center justify-center">
              <Scale className="h-4 w-4 text-[#3498db]" />
            </div>
            <span>{currentTranslations.maxWeight}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3498db]/10 dark:bg-[#3498db]/5 flex items-center justify-center">
              <Ruler className="h-4 w-4 text-[#3498db]" />
            </div>
            <span>{currentTranslations.maxDimensions}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          {error instanceof Error ? error.message : 'Failed to fetch parcels'}
        </div>
      ) : (
        <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize}>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {parcelSizes.map((size) => (
              <motion.div key={size.id} variants={itemVariants} className="h-full">
                <div
                  className={`v7-neu-card-inner p-4 sm:p-5 cursor-pointer relative transition-all duration-300 hover:shadow-lg dark:bg-muted-900 h-full flex flex-col ${
                    selectedSize === size.id
                      ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10 dark:from-[#3498db]/10 dark:to-[#3498db]/5"
                      : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent dark:hover:from-[#3498db]/10"
                  }`}
                  onClick={() => setSelectedSize(size.id)}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <RadioGroupItem
                    value={size.id}
                    id={size.id}
                    className="sr-only"
                    aria-label={`Select parcel size ${size.name}`}
                  />
                  <Label htmlFor={size.id} className="cursor-pointer block h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${size.color} flex items-center justify-center dark:opacity-90 shrink-0`}
                        >
                          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-muted-foreground-700 dark:text-muted-foreground-200 flex-grow">{size.name}</h3>
                        {selectedSize === size.id && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#3498db] dark:bg-[#3498db]/80 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground-500 dark:text-muted-foreground-400">
                          <Ruler className="h-4 w-4 text-[#3498db] shrink-0" />
                          <span>{size.dimensions}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground-500 dark:text-muted-foreground-400">
                          {/* <Scale className="h-4 w-4 text-[#3498db] shrink-0" /> */}
                          {/* <span>{size.maxWeight}</span> */}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-muted-foreground-600 dark:text-muted-foreground-400">{size.description}</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground-500">
                            <div className={`w-2 h-2 rounded-full ${size.isPublic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>{size.isPublic ? 'Available' : 'Unavailable'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground-500">
                            Created: {new Date(size.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </RadioGroup>
      )}

      <CustomParcelDialog
        isOpen={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
        customParcel={customParcel}
        onCustomParcelChange={handleCustomParcelChange}
        onSubmit={handleCustomParcelSubmit}
        translations={{
          customParcelTitle: currentTranslations.customParcelTitle,
          customParcelDesc: currentTranslations.customParcelDesc,
          length: currentTranslations.length,
          width: currentTranslations.width,
          height: currentTranslations.height,
          weight: currentTranslations.weight,
          description: currentTranslations.description,
          cancel: currentTranslations.cancel,
          confirm: currentTranslations.confirm,
        }}
      />
    </div>
  );
} 