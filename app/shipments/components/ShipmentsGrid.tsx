import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { V7ShipmentCard } from "./v7-shipment-card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, Truck, Printer, Download, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ExportToExcel from "./ExportToExcel";

// Use the full Shipment interface from page.tsx
export interface Shipment {
  _id: string;
  dimension: {
    high: number;
    width: number;
    length: number;
  };
  customerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orderId: string;
  senderAddress: {
    full_name: string;
    mobile: string;
    city: string;
    country: string;
    address: string;
  };
  boxNum: number;
  weight: number;
  orderDescription: string;
  shapmentingType: string;
  shapmentCompany: string;
  shapmentType: string;
  shapmentPrice: number;
  orderSou: string;
  priceaddedtax: number;
  byocPrice: number;
  basepickUpPrice: number;
  profitpickUpPrice: number;
  baseRTOprice: number;
  createdAt: string;
  [key: string]: any;
}

interface ShipmentsGridProps {
  sortedShipments: Shipment[];
  selectedShipmentId: string[];
  setSelectedShipmentId: (id: string[]) => void;
  handleBulkAction: (action: string) => void;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const ShipmentsGrid: React.FC<ShipmentsGridProps> = ({
  sortedShipments,
  selectedShipmentId,
  setSelectedShipmentId,
  handleBulkAction,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  // Determine if all are selected
  // const allSelected = selectedShipmentId === "all";

  // Handler for select all button
  // const handleSelectAll = () => {
  //   if (allSelected) {
  //     setSelectedShipmentId(null);
  //   } else {
  //     setSelectedShipmentId("all");
  //   }
  // };
const allSelected = selectedShipmentId?.length === sortedShipments.length;
const handleSelectAll = () => {
  if (allSelected) {
    setSelectedShipmentId([]);
  } else {
    setSelectedShipmentId(sortedShipments.map((s) => s._id));
  }
};

// Print
function downloadBase64File(base64: string, fileName: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  const blob = new Blob([u8arr], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const handlePrintSelected = () => {
  const shipmentsToPrint = sortedShipments.filter(s => selectedShipmentId.includes(s._id));

  shipmentsToPrint.forEach(shipment => {
    const carrier = shipment.shapmentCompany;
    const smsaLabel = shipment.smsaResponse?.label;
    const redboxLabel = shipment.redboxResponse?.label;

    if (carrier === "smsa" && smsaLabel) {
      downloadBase64File(smsaLabel, `smsa-label-${shipment._id}.pdf`);
    } else if (redboxLabel) {
      const win = window.open(redboxLabel, "_blank");
      win?.print();
    } else {
      console.log(`لا توجد بوليصة للطباعة للشحنة ${shipment._id}`);
    }
  });
};


  return (
    <>
      {/* Bulk actions bar */}
    {selectedShipmentId.length > 0 && (
        <div className=" mb-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">تم تحديد شحنة {selectedShipmentId.length}</span>
         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="v7-neu-button-sm"
                disabled={!selectedShipmentId}
              >
                إجراءات جماعية <ChevronDown className="mr-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">

              <DropdownMenuItem
  onClick={handlePrintSelected}
                className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
              >
                <Printer className="h-4 w-4 ml-2 text-purple-600" />
                <span>طباعة المحدد</span>
              </DropdownMenuItem>
  <ExportToExcel
    sortedShipments={sortedShipments}
    selectedShipmentId={selectedShipmentId}
  >
    <span className=" flex items-center  gap-1 ps-2   text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer text-sm">
      <Download className="h-4 w-4 ml-2 text-purple-600" />
      تصدير المحدد
    </span>
  </ExportToExcel>


              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleBulkAction("cancel")}
                className="text-red-600  hover:bg-[#e4e9f2] cursor-pointer"
              >
                <XCircle className="h-4 w-4 ml-2 text-red-600" />
                <span>إلغاء المحدد</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )} 
      <div className="flex flex-wrap -mx-2 justify-center">
  {/* زر تحديد الكل */}
  <div className="flex items-center justify-end w-full mb-4 px-2">
    <Checkbox
      checked={allSelected}
  onCheckedChange={() => handleSelectAll()}
      className="mr-2  rounded-full "
      aria-label="تحديد كل الشحنات"
    />
    <Button
      type="button"
      variant={allSelected ? "default" : "outline"}
      className={`flex items-center gap-2 ${allSelected ? "bg-primary text-white" : ""}`}
      onClick={handleSelectAll}
    >
      تحديد الكل
    </Button>
  </div>

  {/* البطاقات */}
  {sortedShipments.map((shipment) => {
    const isSelected = selectedShipmentId?.includes(shipment._id);

    return (
      <div key={shipment._id} className="w-full flex items-start justify-center mb-6">
        <div className="flex-grow w-full relative">
          <V7ShipmentCard
            shipment={shipment}
            selectedShipmentId={null}
            allSelected={false}
          />
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedShipmentId([...selectedShipmentId, shipment._id]);
              } else {
                setSelectedShipmentId(selectedShipmentId?.filter((id) => id !== shipment._id));
              }
            }}
            className={`absolute top-12 right-2 rounded-full ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            aria-label={`تحديد الشحنة ${shipment._id}`}
          />
        </div>
      </div>
    );
  })}
</div>
      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-8 gap-2">
          <nav className="inline-flex flex-wrap rounded-md shadow-sm" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 border-blue-200'} ${page === 1 ? 'rounded-l-md' : ''} ${page === totalPages ? 'rounded-r-md' : ''}`}
                style={{ minWidth: 40 }}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}; 