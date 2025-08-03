import React from "react";

export default function CarrierCard({ company, selectedCompany, handleCompanySelect, logoSrc, firstType }: any) {
  const isSelected = selectedCompany === company.company;
  return (
    <div
      className={`flex items-center justify-between v7-neu-card-inner px-6 py-6 transition-all duration-300 relative overflow-hidden w-full
                      ${
                        isSelected
                          ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                          : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                      }
      `}
      onClick={() => handleCompanySelect(company.company)}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-center gap-6  justify-end">
        <div className="w-20 h-20  rounded-lg flex items-center justify-center overflow-hidden">
          <img src={logoSrc} alt={company.company} className="object-contain w-full h-full" onError={e => { e.currentTarget.src = '/carriers/carrier-placeholder.png'; }} />
        </div>
        <span className="text-[#3498db] font-bold text-xl whitespace-nowrap">{company.company}</span>
      </div>
      <div className="flex flex-col items-end min-w-[120px] gap-2">
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
        <span className="text-[#3498db] font-bold text-lg">{firstType?.basePrice ? `${firstType.basePrice} ريال` : '-'}</span>
        <span className="text-sm text-gray-500">{company.deliveryTime ? `توصيل خلال ${company.deliveryTime}` : '-'}</span>
      </div>
    </div>
  );
} 