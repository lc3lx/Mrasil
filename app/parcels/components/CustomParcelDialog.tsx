"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateParcelMutation } from "@/app/api/parcelsApi"
import { toast } from "sonner"

interface CustomParcelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  customParcel: {
    length: string
    width: string
    height: string
    weight: string
    description: string
    title?: string
  }
  onCustomParcelChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  translations: {
    customParcelTitle: string
    customParcelDesc: string
    length: string
    width: string
    height: string
    weight: string
    description: string
    cancel: string
    confirm: string
  }
}

export default function CustomParcelDialog({
  isOpen,
  onOpenChange,
  customParcel,
  onCustomParcelChange,
  onSubmit,
  translations
}: CustomParcelDialogProps) {
  const [createParcel, { isLoading }] = useCreateParcelMutation()

  const handleSubmit = async () => {
    try {
      // Convert string values to numbers
      const parcelData = {
        title: customParcel.title || "Custom Package",
        dimensions: {
          length: Number(customParcel.length),
          width: Number(customParcel.width),
          height: Number(customParcel.height)
        },
        maxWeight: Number(customParcel.weight),
        description: customParcel.description,
        isPublic: true
      }

      await createParcel(parcelData).unwrap()
      toast.success("Package created successfully")
      onSubmit()
    } catch (error) {
      console.error('Error creating package:', error)
      toast.error("Failed to create package")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold text-[#1a365d]">
            {translations.customParcelTitle}
          </DialogTitle>
          <DialogDescription className="text-right text-gray-600">
            {translations.customParcelDesc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block text-gray-600">
              Package Name
            </Label>
            <Input
              id="title"
              name="title"
              className="v7-neu-input text-right"
              value={customParcel.title}
              onChange={onCustomParcelChange}
              placeholder="Enter package name"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-right block text-gray-600">
                {translations.length}
              </Label>
              <Input
                id="length"
                name="length"
                type="number"
                min="1"
                className="v7-neu-input text-right"
                value={customParcel.length}
                onChange={onCustomParcelChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width" className="text-right block text-gray-600">
                {translations.width}
              </Label>
              <Input
                id="width"
                name="width"
                type="number"
                min="1"
                className="v7-neu-input text-right"
                value={customParcel.width}
                onChange={onCustomParcelChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-right block text-gray-600">
                {translations.height}
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                min="1"
                className="v7-neu-input text-right"
                value={customParcel.height}
                onChange={onCustomParcelChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-right block text-gray-600">
              {translations.weight}
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0.1"
              step="0.1"
              className="v7-neu-input text-right"
              value={customParcel.weight}
              onChange={onCustomParcelChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right block text-gray-600">
              {translations.description}
            </Label>
            <Input
              id="description"
              name="description"
              className="v7-neu-input text-right"
              value={customParcel.description}
              onChange={onCustomParcelChange}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="v7-neu-button-flat"
            disabled={isLoading}
          >
            {translations.cancel}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9]"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : translations.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 