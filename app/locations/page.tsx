"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone, Edit, Trash2, PlusCircle, Star, StarOff } from "lucide-react"
import V7Layout from "@/components/v7/v7-layout"
import {
  useGetAllAddressesQuery,
  Address,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  useCreateAddressMutation,
} from "@/app/api/adressesApi"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LocationsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});
  const [showFavorites, setShowFavorites] = useState(false);

  const { data: addressesResponse, isLoading, isError } = useGetAllAddressesQuery()
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation()
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation()
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const filteredAddresses = (addressesResponse?.data || []).filter((address) => {
    if (showFavorites && !favorites[address._id]) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        address.alias.toLowerCase().includes(query) ||
        address.city.toLowerCase().includes(query) ||
        address.location.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleCreate = async (data: Omit<Address, "_id">) => {
    try {
      await createAddress(data).unwrap()
      toast.success("Address created successfully!")
      setIsAddDialogOpen(false)
    } catch (err) {
      toast.error("Failed to create address.")
      console.error("Failed to create the address:", err)
    }
  }

  const handleUpdate = async (data: Partial<Address>) => {
    if (!addressToEdit) return

    try {
      await updateAddress({ ...addressToEdit, ...data }).unwrap()
      toast.success("Address updated successfully!")
      setAddressToEdit(null)
    } catch (err) {
      toast.error("Failed to update address.")
      console.error("Failed to update the address:", err)
    }
  }

  const handleDeleteConfirm = async () => {
    if (addressToDelete) {
      try {
        await deleteAddress(addressToDelete._id).unwrap()
        toast.success("Address deleted successfully!")
        setAddressToDelete(null)
      } catch (err) {
        toast.error("Failed to delete address.")
        console.error("Failed to delete the address: ", err)
      }
    }
  }

  return (
    <V7Layout>
      <div className="space-y-8 pb-20 mt-16">
        <div className=" flex justify-start flex-col">
            <h1 className="text-2xl font-bold text-[#294D8B]">العناوين</h1>
            <p className="text-sm text-gry">مواقع الإستلام الخاصة بك</p>
        </div>

        <div className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-6">
            <div className="relative v7-neu-input-container w-full">
              <input
                type="search"
                placeholder="ابحث عن موقع..."
                className="v7-neu-input w-full pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute  right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
            </div>
          </div>

          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="v7-neu-card-inner rounded-xl p-5">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-red-500">
              <h3 className="text-xl font-medium">فشل في تحميل العناوين</h3>
              <p className="text-red-400 mt-2">تعذر جلب البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.</p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onEdit={() => setAddressToEdit(address)}
                    onDelete={() => setAddressToDelete(address)}
                    isFavorite={!!favorites[address._id]}
                    onToggleFavorite={() => setFavorites(favs => ({ ...favs, [address._id]: !favs[address._id] }))}
                  />
                ))
              ) : (
                <div className="text-center py-12 md:col-span-2 lg:col-span-3">
                  <MapPin className="mx-auto h-12 w-12 text-gry opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد مواقع</h3>
                  <p className="mt-2 text-sm text-gry">لم يتم العثور على مواقع تطابق معايير البحث</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!addressToDelete} onOpenChange={(open) => !open && setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditAddressDialog
        isOpen={!!addressToEdit}
        onClose={() => setAddressToEdit(null)}
        address={addressToEdit}
        onSave={handleUpdate}
        isSaving={isUpdating}
      />

      <AddAddressDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleCreate}
        isSaving={isCreating}
      />
    </V7Layout>
  )
}

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

function AddressCard({ address, onEdit, onDelete, isFavorite, onToggleFavorite }: AddressCardProps) {
  return (
    <div className="v7-neu-card-inner rounded-xl p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-[#3498db]">{address.alias}</h3>
        <button onClick={onToggleFavorite} className="ml-2 p-1 rounded-full hover:bg-amber-50 transition">
          {isFavorite ? (
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-5 w-5 text-gry" />
          )}
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gry mt-1" />
          <div className="text-sm">{address.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gry" />
          <div className="text-sm">{address.phone}</div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gry mt-1" />
          <div className="text-sm">
            <span className="font-medium">المدينة:</span> {address.city}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 v7-neu-button-sm flex items-center gap-2" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          تعديل
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 v7-neu-button-sm flex items-center gap-2 text-red-600 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </Button>
      </div>
    </div>
  )
}

interface AddressDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  isSaving: boolean
  address?: Address | null
}

function AddAddressDialog({ isOpen, onClose, onSave, isSaving }: Omit<AddressDialogProps, "address">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<Address, "_id">>()

  const onSubmit = (data: Omit<Address, "_id">) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); reset(); }}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>اضافة عنوان جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات العنوان الجديد. اضغط على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="alias">الاسم المستعار</Label>
            <Input id="alias" {...register("alias", { required: "الاسم المستعار مطلوب" })} />
            {errors.alias && <p className="text-red-500 text-xs mt-1">{errors.alias.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">الموقع</Label>
            <Input id="location" {...register("location", { required: "الموقع مطلوب" })} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" {...register("city", { required: "المدينة مطلوبة" })} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="country">البلد</Label>
            <Input id="country" {...register("country", { required: "البلد مطلوب" })} />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input id="phone" {...register("phone", { required: "رقم الهاتف مطلوب" })} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "جاري الحفظ..." : "حفظ العنوان"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditAddressDialog({ isOpen, onClose, address, onSave, isSaving }: AddressDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Address>()

  useEffect(() => {
    if (address) {
      reset(address)
    }
  }, [address, reset])

  const onSubmit = (data: Address) => {
    onSave(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل العنوان</DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات العنوان هنا. اضغط على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="alias">الاسم المستعار</Label>
            <Input id="alias" {...register("alias", { required: "الاسم المستعار مطلوب" })} />
            {errors.alias && <p className="text-red-500 text-xs mt-1">{errors.alias.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">الموقع</Label>
            <Input id="location" {...register("location", { required: "الموقع مطلوب" })} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" {...register("city", { required: "المدينة مطلوبة" })} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <Label htmlFor="country">البلد</Label>
            <Input id="country" {...register("country", { required: "البلد مطلوب" })} />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input id="phone" {...register("phone", { required: "رقم الهاتف مطلوب" })} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
