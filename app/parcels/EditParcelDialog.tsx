"use client"

import React from "react"
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
import { useUpdateParcelMutation, ParcelData } from "@/app/api/parcelsApi"
import { toast } from "sonner"

interface EditParcelDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  parcel: ParcelData | null
  translations: {
    editParcelTitle: string
    editParcelDesc: string
    length: string
    width: string
    height: string
    weight: string
    description: string
    cancel: string
    confirm: string
    title: string
  }
}

export default function EditParcelDialog({
  isOpen,
  onOpenChange,
  parcel,
  translations
}: EditParcelDialogProps) {
  const [updateParcel, { isLoading }] = useUpdateParcelMutation()

  const [formData, setFormData] = React.useState({
    title: "",
    length: "",
    width: "",
    height: "",
    maxWeight: "",
    description: "",
  })

  // Update form data when parcel changes
  React.useEffect(() => {
    if (parcel) {
      setFormData({
        title: parcel.title ?? "",
        length: parcel.dimensions?.length?.toString() ?? "",
        width: parcel.dimensions?.width?.toString() ?? "",
        height: parcel.dimensions?.height?.toString() ?? "",
        maxWeight: parcel.maxWeight !== undefined && parcel.maxWeight !== null ? parcel.maxWeight.toString() : "",
        description: parcel.description ?? "",
      })
    }
  }, [parcel])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!parcel || !parcel._id) {
      console.error('No valid parcel _id for update!');
      toast.error('No valid parcel _id for update!');
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        dimensions: {
          length: Number(formData.length),
          width: Number(formData.width),
          height: Number(formData.height)
        },
        maxWeight: Number(formData.maxWeight),
        description: formData.description,
      }

      console.log('updateParcel called', { id: parcel._id, data: updateData });
      await updateParcel({ id: parcel._id, data: updateData }).unwrap()
      toast.success("Package updated successfully")
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating package:', error)
      toast.error("Failed to update package")
    }
  }

  // Add debug log for isLoading
  console.log('EditParcelDialog isLoading:', isLoading);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold text-[#1a365d]">
            {translations.editParcelTitle}
          </DialogTitle>
          <DialogDescription className="text-right text-gray-600">
            {translations.editParcelDesc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block text-gray-600">
              {translations.title}
            </Label>
            <Input
              id="title"
              name="title"
              className="v7-neu-input text-right"
              value={formData.title}
              onChange={handleInputChange}
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
                value={formData.length}
                onChange={handleInputChange}
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
                value={formData.width}
                onChange={handleInputChange}
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
                value={formData.height}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxWeight" className="text-right block text-gray-600">
              {translations.weight}
            </Label>
            <Input
              id="maxWeight"
              name="maxWeight"
              type="number"
              min="0.1"
              step="0.1"
              className="v7-neu-input text-right"
              value={formData.maxWeight}
              onChange={handleInputChange}
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
              value={formData.description}
              onChange={handleInputChange}
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
            // disabled={isLoading} // TEMPORARILY REMOVED FOR DEBUGGING
          >
            {isLoading ? "Updating..." : translations.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 