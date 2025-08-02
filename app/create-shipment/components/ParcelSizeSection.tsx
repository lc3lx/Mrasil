import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateParcelMutation } from "../../api/parcelsApi";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { Label } from "@radix-ui/react-dropdown-menu";

interface ParcelSizeSectionProps {
  parcelsData: { data?: any[] } | undefined;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

interface SizeCard {
  key: string;
  label: string;
  dims: { length: number; width: number; high: number };
  desc: string;
  maxWeight?: number;
  price?: number;
  examples?: any;
}

export function ParcelSizeSection({ parcelsData, setValue, errors }: ParcelSizeSectionProps) {
  // Map API data to card format with unique key
  const sizeCards: SizeCard[] = (parcelsData?.data || []).map((parcel: any, idx: number) => ({
    key: parcel._id ? `${parcel._id}_${idx}` : `parcel_${idx}`,
    label: parcel.title,
    dims: {
      length: parcel.dimensions.length,
      width: parcel.dimensions.width,
      high: parcel.dimensions.height,
    },
    desc: parcel.description || '',
    maxWeight: parcel.maxWeight,
    price: parcel.price,
    examples: parcel.examples,
  }));

  // Selection logic: only one card can be selected at a time
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSelectSize = (card: SizeCard) => {
    setSelectedSize(prev => prev === card.key ? null : card.key);
    if (card.key) {
      setValue("dimension_length", card.dims.length);
      setValue("dimension_width", card.dims.width);
      setValue("dimension_high", card.dims.high);
    }
  };

  // Custom parcel modal logic
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customParcel, setCustomParcel] = useState({ title: '', length: '', width: '', height: '', maxWeight: '', price: '', description: '' });
  const [createParcel, { isLoading: isCreatingParcel }] = useCreateParcelMutation();

  const handleCustomParcelFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createParcel({
        title: customParcel.title,
        dimensions: {
          length: Number(customParcel.length),
          width: Number(customParcel.width),
          height: Number(customParcel.height),
        },
        maxWeight: customParcel.maxWeight ? Number(customParcel.maxWeight) : undefined,
        price: customParcel.price ? Number(customParcel.price) : undefined,
        description: customParcel.description,
        isPublic: false,
      }).unwrap();
      setCustomModalOpen(false);
      setCustomParcel({ title: '', length: '', width: '', height: '', maxWeight: '', price: '', description: '' });
    } catch (err) {
      // handle error if needed
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-6 h-6 text-[#3498db]" />
        <h2 className="text-xl font-bold text-[#3498db] m-0">حجم الطرد</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {sizeCards.map((card: SizeCard) => {
          const selected = selectedSize === card.key;
          return (
            <motion.div
              key={card.key}
              className={`v7-neu-card-inner p-4 cursor-pointer ${
                selected
                  ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                  : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
              }`}
              onClick={() => handleSelectSize(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center gap-2 relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selected
                      ? "bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white"
                      : "bg-[#3498db]/10 text-[#3498db]"
                  }`}
                >
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg ">{card.label}</h4>
                  <div className="text-xs text-gray-500 mt-1 ">سم {card.dims.length} × {card.dims.width} × {card.dims.high}</div>
                  {card.maxWeight && (
                    <div className="text-xs text-gray-500">حتى {card.maxWeight} كجم</div>
                  )}
                </div>
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#3498db] rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div>

                </div>
              </div>
            </motion.div>
          );
        })}
     
        <Button type="button" className={` v7-neu-card-inner  p-4 cursor-pointer  hover:bg-[#f0f4f8] h-[10rem] w-[18rem]  flex flex-col  gap-2`}    onClick={() => setCustomModalOpen(true)}>
    <span className={` p-4 rounded-full flex items-center justify-center
                    ${customModalOpen
                      ? "bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white"
                      : "bg-[#3498db]/10 text-[#3498db]"}
                      `}>
                       <Package className=" w-5 h-5"  style={{width:"20px", height:"20px"}} />
      </span>
      <h4 className="font-bold text-gray-800  text-lg"> إضافة حجم طرد مخصص  +</h4>
         
        </Button>
                  </div>
      {/* Selected parcel summary (centered, full width) */}
      {selectedSize && (() => {
        const selectedCard = sizeCards.find((c: SizeCard) => c.key === selectedSize);
        if (!selectedCard) return null;
        return (
          <div className="mb-2 w-full flex justify-center">
            <div className="flex items-center gap-6 bg-[#f6fbff] border-2 border-[#3498db] rounded-2xl shadow-md px-8 py-4 min-w-[350px] max-w-xl w-full" style={{ height: 90 }}>
              <div className="flex-1">
                <div className="font-bold text-[#1a365d] text-lg mb-1 text-right">
                  الحجم المختار: {selectedCard.label}
                </div>
                <div className="flex items-center gap-4 text-[#7b8ca6] text-base">
                  <span className="flex items-center gap-1">
                    <span className="text-[#3498db]"><Package className="w-4 h-4" /></span>
                    {selectedCard.dims.length} × {selectedCard.dims.width} × {selectedCard.dims.high} سم
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#3498db]"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M6 21V7a6 6 0 1112 0v14" /></svg></span>
                    حتى {selectedCard.maxWeight} كجم
                  </span>
                </div>
              </div>
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3498db]">
                <Package className="w-7 h-7 text-white" />
              </span>
            </div>
          </div>
        );
      })()}
      {/* Custom Parcel Modal */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
  <DialogContent className="flex flex-col gap-8 p-10  bg-[#f3f6fa] border-none">
    <DialogHeader>
      <DialogTitle className="text-start pt-5">إضافة حجم طرد مخصص</DialogTitle>
    </DialogHeader>
    <div>
    <Label>اسم الطرد</Label>
 <Input
                   className="v7-neu-input w-full pr-10 py-2 text-sm "
                   type="text"
                   value={customParcel.title}
                   onChange={(e) => setCustomParcel({ ...customParcel, title: e.target.value })}
                   required
                   />
                   </div>
        <div className=" flex items-center gap-4">

      <div>

        <Label>الطول (سم)</Label>
      <Input
                        className="v7-neu-input w-full pr-10 py-2 text-sm "
                        
                        type="text"
                        value={customParcel.length}
                        onChange={(e) => setCustomParcel({ ...customParcel, length: e.target.value })}
                        required
                        />
                        </div>
                        <div>
          <Label>العرض (سم)</Label>
      <Input
                        className="v7-neu-input w-full pr-10 py-2 text-sm"
                      
        type="number"
        value={customParcel.width}
        onChange={(e) => setCustomParcel({ ...customParcel, width: e.target.value })}
        required
        />
        </div>
        <div>
          <Label>
          الارتفاع (سم)
          </Label>
      <Input
                        className="v7-neu-input w-full pr-10 py-2 text-sm"
                        
                        type="number"
                        value={customParcel.height}
                        onChange={(e) => setCustomParcel({ ...customParcel, height: e.target.value })}
                        required
                        />
                        </div>

 
        </div>
      {/* زر الإرسال بدون فورم */}
      <div className="col-span-3 flex justify-end mt-4 w-32">
        <Button 
          type="button"
          className="bg-blue-500 text-white w-full text-lg"
          disabled={isCreatingParcel}
          onClick={async () => {
            try {
              await createParcel({
                title: customParcel.title,
                dimensions: {
                  length: Number(customParcel.length),
                  width: Number(customParcel.width),
                  height: Number(customParcel.height),
                },
                maxWeight: customParcel.maxWeight ? Number(customParcel.maxWeight) : undefined,
                price: customParcel.price ? Number(customParcel.price) : undefined,
                description: customParcel.description,
                isPublic: false,
              }).unwrap();

              setCustomModalOpen(false);
              setCustomParcel({
                title: '',
                length: '',
                width: '',
                height: '',
                maxWeight: '',
                price: '',
                description: '',
              });
            } catch (err) {
              console.error("فشل إنشاء الطرد:", err);
            }
          }}
        >
          {isCreatingParcel ? 'جاري الإضافة...' : 'إضافة'}
        </Button>
    </div>
  </DialogContent>
</Dialog>

    </>
  );
} 