import { Check, Plus, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import realBlue from "../../../public/real-blue.png"
export default function CarrierCard({ company, selectedCompany, handleCompanySelect, logoSrc, firstType , displayName}: any) {
  const isSelected = selectedCompany === company.company;
    const price =  company.shippingType.basePrice +  company.shippingType.profitPrice 
  return (
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
          <Image sizes="20" width={20} height={20} src={logoSrc} alt={company.company} className="object-contain w-[5rem] sm:min-w-[7rem]  sm:min-h-[10rem]" onError={e => { e.currentTarget.src = '/carriers/carrier-placeholder.png'; }} />
        </div>
        <span className="text-[#3498db] font-bold text-xl whitespace-nowrap">{company.company == "omniclama" ? "LLAMA BOX" : company.company == "smsapro" ? "SMSA PRO" : company.company == "aramex" ? "ARAMEX PRO" : company.company.toLocaleUpperCase() }</span>
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

         {["smsa", "aramex", "smsapro"].includes(company.company) ? (
           <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-green-50 text-[#27ae60] border-green-200 font-semibold">
    الشحن العادي
  </span>
  ):<span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-sky-50 text-sky-500  border-sky-200 font-semibold">شحن الخزائن</span>
}
        <span className="text-[#3498db] font-bold  flex text-lg">{
                                          Number.isInteger(price)
                                  ? price
                                      .toString()
                                      .slice(0, 4)
                                  : parseFloat(
                                      price.toPrecision(4)
                                    )
          }
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
     { ["smsa", "omniclama", "redbox"].includes(company.company) && (
      <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
      توصيل من الباب للباب 
     (
    <span className=" text-[#e74c3c] flex items-center gap-1">
     <X className=" w-4 h-4"/>
       غير متوفر 
    </span>
     )
  </span>
)}  
{
  ["smsapro"].includes(company.company) && (
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
  )
} 
  
</div>
    </div>
  );
} 