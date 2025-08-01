import React from "react";

export default function CarrierCard({ company, selectedCompany, handleCompanySelect, logoSrc, firstType }: any) {
  const isSelected = selectedCompany === company.company;
  return (
    <div
      className={`flex items-center justify-between v7-neu-card-inner px-6 py-6 transition-all duration-300 relative overflow-hidden w-full
        ${isSelected
          ? "border-2 border-[#3498db]/70 bg-[#f8fafc] shadow-sm"
          : "border border-gray-200 hover:border-[#3498db]/40 bg-white hover:shadow-lg"}
      `}
      onClick={() => handleCompanySelect(company.company)}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-center gap-6 min-w-[180px] justify-end">
        <span className="text-[#3498db] font-bold text-base whitespace-nowrap">{company.company}</span>
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
          <img src={logoSrc} alt={company.company} className="object-contain w-14 h-14" onError={e => { e.currentTarget.src = '/carriers/carrier-placeholder.png'; }} />
        </div>
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