"use client"

import type React from "react"
import { useState, Suspense, useEffect, useMemo } from "react"
import { Box, Package, Check, Info, Scale, Ruler, Settings, Edit, Trash2 } from "lucide-react"
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
import { useGetAllParcelsQuery, useDeleteParcelMutation, ParcelData } from "@/app/api/parcelsApi"
import CustomParcelDialog from "./CustomParcelDialog"
import EditParcelDialog from "./EditParcelDialog"
import { toast } from "sonner"

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
  editParcelTitle: string;
  editParcelDesc: string;
  deleteConfirmTitle: string;
  deleteConfirmDesc: string;
  delete: string;
  edit: string;
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
    editParcelTitle: "تعديل حجم الطرد",
    editParcelDesc: "قم بتعديل أبعاد ووزن الطرد",
    deleteConfirmTitle: "تأكيد الحذف",
    deleteConfirmDesc: "هل أنت متأكد من حذف هذا الطرد؟ لا يمكن التراجع عن هذا الإجراء.",
    delete: "حذف",
    edit: "تعديل",
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
    editParcelTitle: "Edit Parcel Size",
    editParcelDesc: "Modify the parcel dimensions and weight",
    deleteConfirmTitle: "Confirm Delete",
    deleteConfirmDesc: "Are you sure you want to delete this parcel? This action cannot be undone.",
    delete: "Delete",
    edit: "Edit",
  },
};

export default function ParcelsContent() {
  const [mounted, setMounted] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const router = useRouter()
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<ParcelData | null>(null)
  const [language, setLanguage] = useState<Language>('ar')
  
  // Skip API call until component is mounted
  const { data: parcelsData, isLoading, error } = useGetAllParcelsQuery(undefined, {
    skip: !mounted
  })
  
  const [deleteParcel, { isLoading: isDeleting }] = useDeleteParcelMutation()

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
    ? parcelsData.data.map((parcel, idx) => ({
        id: parcel._id ? String(parcel._id) + '-' + idx : `parcel-${idx}`,
        originalParcel: parcel,
        name: parcel.title,
        dimensions: `${parcel.dimensions.length} × ${parcel.dimensions.width} × ${parcel.dimensions.height} cm`,
        maxWeight: `${parcel.maxWeight} kg`,
        price: `${parcel.price} SAR`,
        description: parcel.description,
        icon: `${parcel._id}-package.png`,
        isPublic: parcel.isPublic,
        createdAt: parcel.createdAt,
        color: {
          'xs': 'from-blue-400 to-blue-500',
          's': 'from-green-400 to-green-500',
          'm': 'from-yellow-400 to-yellow-500',
          'l': 'from-orange-400 to-orange-500',
          'xl': 'from-red-400 to-red-500',
          'custom': 'from-purple-400 to-purple-500'
        }[parcel._id] || 'from-gray-400 to-gray-500'
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

  const handleEditParcel = (parcel: ParcelData) => {
    console.log('Edit parcel clicked:', parcel)
    setSelectedParcel(parcel)
    setIsEditDialogOpen(true)
  }

  const handleDeleteParcel = (parcel: ParcelData) => {
    console.log('Delete parcel clicked:', parcel)
    setSelectedParcel(parcel)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedParcel || !selectedParcel._id) {
      console.error('No valid parcel _id for delete!');
      toast.error('No valid parcel _id for delete!');
      return;
    }

    try {
      await deleteParcel(selectedParcel._id).unwrap()
      toast.success("Package deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedParcel(null)
    } catch (error) {
      console.error('Error deleting package:', error)
      toast.error("Failed to delete package")
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="v7-neu-icon bg-gradient-to-br from-[#3498db]/80 to-[#3498db]">
            <Box className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a365d]">
            {currentTranslations.pageTitle}
          </h1>
        </div>
        <Button
          onClick={openCustomDialog}
          className="v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-1" />
          {currentTranslations.customizeSize}
        </Button>
      </div>

      <div className="v7-neu-card p-6 rounded-xl mb-8">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#3498db]/20">
          <div className="v7-neu-icon-sm">
            <Info className="h-5 w-5 text-[#3498db]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {currentTranslations.shippingInfo}
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          {currentTranslations.chooseParcelSize}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3498db]/10 flex items-center justify-center">
              <Scale className="h-4 w-4 text-[#3498db]" />
            </div>
            <span>{currentTranslations.maxWeight}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3498db]/10 flex items-center justify-center">
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {parcelSizes.map((size) => (
            <motion.div key={size.id} variants={itemVariants}>
              <div
                className={`v7-neu-card-inner p-6 cursor-pointer relative transition-all duration-300 hover:shadow-lg ${
                  selectedSize === size.id
                    ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                    : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                }`}
                onClick={() => setSelectedSize(size.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${size.color} flex items-center justify-center`}
                      >
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{size.name}</h3>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-base text-gray-600">
                        <Ruler className="h-5 w-5 text-[#3498db]" />
                        <span>{size.dimensions}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base text-gray-600">
                        <Scale className="h-5 w-5 text-[#3498db]" />
                        <span>{currentTranslations.upTo} {size.maxWeight}</span>
                      </div>
                    </div>
                    <p className="text-base text-gray-600 mb-4">{size.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`w-3 h-3 rounded-full ${size.isPublic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{size.isPublic ? 'Available' : 'Unavailable'}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(size.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedSize === size.id && (
                      <div className="w-8 h-8 rounded-full bg-[#3498db] flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditParcel(size.originalParcel)
                        }}
                        className="w-8 h-8 rounded-full bg-[#f39c12] hover:bg-[#e67e22] flex items-center justify-center transition-colors duration-200"
                        title={currentTranslations.edit}
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteParcel(size.originalParcel)
                        }}
                        className="w-8 h-8 rounded-full bg-[#e74c3c] hover:bg-[#c0392b] flex items-center justify-center transition-colors duration-200"
                        title={currentTranslations.delete}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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

      <EditParcelDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        parcel={selectedParcel}
        translations={{
          editParcelTitle: currentTranslations.editParcelTitle,
          editParcelDesc: currentTranslations.editParcelDesc,
          length: currentTranslations.length,
          width: currentTranslations.width,
          height: currentTranslations.height,
          weight: currentTranslations.weight,
          description: currentTranslations.description,
          cancel: currentTranslations.cancel,
          confirm: currentTranslations.confirm,
          title: "Package Name",
        }}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold text-[#1a365d]">
              {currentTranslations.deleteConfirmTitle}
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600">
              {currentTranslations.deleteConfirmDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="v7-neu-button-flat"
              disabled={isDeleting}
            >
              {currentTranslations.cancel}
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              className="v7-neu-button-accent bg-gradient-to-r from-[#e74c3c] to-[#c0392b] hover:from-[#c0392b] hover:to-[#e74c3c]"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : currentTranslations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 