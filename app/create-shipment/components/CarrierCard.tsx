import { Check, Package, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import realBlue from "../../../public/real-blue.png"
import { motion } from "framer-motion";
import { useCreateParcelMutation } from "@/app/api/parcelsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
export default function CarrierCard({ company, selectedCompany, handleCompanySelect, logoSrc, firstType , values, selectedBoxSize, prices, boxSizes, setSelectedBoxSize, setValue} : any) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customParcel, setCustomParcel] = useState({
    label: "",
    length: "",
    width: "",
    height: "",
  });
  const [createParcel, { isLoading: isCreatingParcel }] =
    useCreateParcelMutation();
const isSelected =
  selectedCompany === company.company &&
  values.shipmentType === company.shippingType.type;
const displayName =
  company.company === "omniclama" ? "LLAMA BOX" :
  company.company === "smsa" ? (company.shippingType.type === "Dry" ? "SMSA PRO" : "SMSA") :
  company.company === "aramex" ? "ARAMEX PRO" :
  company.company.toUpperCase();
// NEW

  const [error, setError] = React.useState("");



  return (
    <>
    <div
      className={`flex items-center justify-between v7-neu-card-inner px-6   py-4 transition-all duration-300 relative overflow-hidden w-full
        ${
                        isSelected
                        ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                        : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                      }
                      `}
      onClick={() => handleCompanySelect(company.company)}
      style={{ cursor: 'pointer' }}
      >
      <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-6  gap-0  ">
        <div className="  rounded-lg   overflow-hidden">
          <Image sizes="20px" width={20} height={20} src={logoSrc} alt={company.company} className="object-contain w-[5rem] sm:min-w-[7rem]  sm:min-h-[10rem]" onError={e => { e.currentTarget.src = '/carriers/carrier-placeholder.png'; }} />
        </div>
        <span className="text-[#3498db] font-bold text-xl whitespace-nowrap">  {displayName}</span>
      </div>
      <div className="flex flex-col items-end min-w-[120px]  gap-4">
        <input
          type="radio"
          name="company"
          value={company.company}
          checked={isSelected}
          onChange={() => handleCompanySelect(company.company)}
          className="text-[#3498db] mb-1"
          style={{ width: 20, height: 20 }}
          onClick={e => e.stopPropagation()}
        />
        <div className=" flex items-center gap-4">

         {["smsa", "aramex"].includes(company.company) ? (
           <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-green-50 text-[#27ae60] border-green-200 font-semibold">
    الشحن العادي
  </span>
  ):<span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-sky-50 text-sky-500  border-sky-200 font-semibold">شحن الخزائن</span>
}
        <span className="text-[#3498db] font-bold  flex text-lg">
  {/* {prices
    ?.filter((p: any) => p.company === company.company && p.type === company.shippingType.type)
    .map((p: any) => p.price) || "0"}
     */}
     {(() => {
  const price =
  prices?.filter(
    (p) =>
        p.company === company.company &&
    p.type ===  company.shippingType.type
    )[0]?.price || 0;
    
    return Number.isInteger(Number(price))
    ? Number(price)
    : Number(price).toPrecision(4);
})()}
          <Image alt="real" src={realBlue} width={20} height={20}/>
        </span>
    </div>
        {[ "aramex"].includes(company.company) && (
          <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
    توصيل من الباب للباب 
    ( 
    <span className=" text-[#27ae60] flex items-center gap-1">
    <Check  className=" w-4 h-4"/> 
      متوفر 
    </span>
    )
  </span>
)}

     { [ "omniclama", "redbox"].includes(company.company) ? (
       <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
       توصيل من الباب للباب 
       (
         <span className=" text-[#e74c3c] flex items-center gap-1">
     <X className=" w-4 h-4"/>
       غير متوفر 
    </span>
     )
     </span>
    ):(
      (["smsa"].includes(company.company) && ["Dry"].includes(company.shippingType.type) ? (
        <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
      توصيل من الباب للباب 
     (
          <span className=" text-[#27ae60] flex items-center gap-1">
    <Check  className=" w-4 h-4"/> 
      متوفر 
      <span className=" text-primary flex gap-1 items-center text-sm">
        (
          <span className="  ">حد أدنى 15 شحنة</span>
        )
      </span>
    </span>
    )
      </span>
  ):
  ( ["offices"].includes(company.shippingType.type) && (
       <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
       توصيل من الباب للباب 
       (
         <span className=" text-[#e74c3c] flex items-center gap-1">
     <X className=" w-4 h-4"/>
       غير متوفر 
    </span>
     )
     </span>
    )
  )))
  }  

  
</div>
    </div>
    {isSelected &&
     boxSizes.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">
            أحجام الصناديق المسموح بها
          </h3>
<div className=" flex items-center  gap-4">
          {boxSizes.map((card: any) => {
          const selected = selectedBoxSize === card;
            return (
              <motion.div
                key={card.key}
                className={`v7-neu-card-inner p-12 cursor-pointer w-fit  ${
                  selected
                    ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                    : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                }`}
          onClick={() => {
                    setSelectedBoxSize(card);
                    setValue("boxSize", card)}}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center  text-center gap-2 relative ">
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
                    {/* <h4 className="font-bold text-gray-800 text-lg ">
                      {card?.label}
                    </h4> */}
                    <div className="text-base text-gray-700 mt-1 ">
                      {card.length}×{card.width}×{card.height} سم
                    </div>
                  </div>
                  {selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#3498db] rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {
            (["smsa", "aramex"].includes(company.company) && ["Dry"].includes(company.shippingType.type) && (

        
                <Button
          type="button"
          className={`v7-neu-card-inner p-12 cursor-pointer w-fit v7-neu-card-inner  h-40  flex flex-col  gap-2`}
          onClick={() => setCustomModalOpen(true)}
          >
          <span
            className={` p-4 rounded-full flex items-center justify-center
              ${
                      customModalOpen
                        ? "bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white"
                        : "bg-[#3498db]/10 text-[#3498db]"
                        }
                        `}
          >
            <Package
              className=" w-5 h-5"
              style={{ width: "20px", height: "20px" }}
              />
          </span>
          <h4 className="font-bold text-gray-800  text-lg">
            {" "}
            إضافة حجم طرد مخصص +
          </h4>
        </Button>

))
}
</div>
          
              </div>
      )}
        <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent className="flex flex-col gap-8 p-10  bg-[#f3f6fa] border-none">
          <DialogHeader>
            <DialogTitle className="text-start pt-5">
              إضافة حجم طرد مخصص
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label>اسم الطرد</Label>
            <Input
              className="v7-neu-input w-full pr-10 py-2 text-sm "
              type="text"
              value={customParcel.label}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, label: e.target.value })
              }
              required
            />
          </div>
          <div className=" flex items-center gap-4">
            <div>
              <Label>الطول (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm "
                type="number"
                value={customParcel.length}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, length: e.target.value })
                }
                required
                min="0"
              />
            </div>
            <div>
              <Label>العرض (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm"
                type="number"
                value={customParcel.width}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, width: e.target.value })
                }
                required
                min="0"
              />
            </div>
            <div>
              <Label>الارتفاع (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm"
                type="number"
                value={customParcel.height}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, height: e.target.value })
                }
                required
                min="0"
              />
            </div>
          </div>
 
          <div className="col-span-3 flex justify-end mt-4 w-32">
            <Button
              type="button"
              className="bg-primary text-white w-full text-lg"
              disabled={isCreatingParcel}
              onClick={async () => {
                if (
                  !customParcel.label.trim() ||
                  !customParcel.length.trim() ||
                  !customParcel.width.trim() ||
                  !customParcel.height.trim()
                ) {
                  setError("جميع الحفول مطلوبة");
                  return;
                }
                setError("");

                try {
                  await createParcel({
                    title: customParcel.label,
                    dimensions: {
                      length: Number(customParcel.length),
                      width: Number(customParcel.width),
                      height: Number(customParcel.height),
                    },
                  
                    isPublic: false,
                  }).unwrap();

                  setCustomModalOpen(false);
                  setCustomParcel({
                    label: "",
                    length: "",
                    width: "",
                    height: "",
                  });
                } catch (err) {
                  console.error("فشل إنشاء الطرد:", err);
                }
              }}
            >
              {isCreatingParcel ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </div>
       </DialogContent>
      </Dialog>
  </>
  );
} 