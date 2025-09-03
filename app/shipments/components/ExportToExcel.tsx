import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface ExportToExcelDialogProps {
  sortedShipments: any[];
  selectedShipmentId: string[];
  children: React.ReactNode;
}

const ExportToExcel: React.FC<ExportToExcelDialogProps> = ({
  sortedShipments,
  selectedShipmentId,
  children,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const columns = [
    { key: "createdAt", label: "Shipment date" },
    { key: "trackingId", label: "Tracking Id" },
    { key: "updatedAt", label: "Last Updated date" },
    { key: "customerEmail", label: "Merchant email" },
    { key: "id", label: "Order Id" },
    { key: "weight", label: "Weight" },
    { key: "pickupCity", label: "Pickup City" },
    { key: "price", label: "Shipping Price" },
    { key: "dropoffCity", label: "Drop off City" },
    { key: "states", label: "Shipment States" },
    { key: "type", label: "Shipment Type" },
  ];

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const exportSelectedToExcel = async () => {
    const shipmentsToExport = sortedShipments.filter((s) =>
      selectedShipmentId.includes(s._id)
    );
    if (!shipmentsToExport.length) return alert("لم يتم تحديد أي شحنة");

    const headers = columns
      .filter((c) => selectedColumns.includes(c.key))
      .map((c) => c.label);

    const data = shipmentsToExport.map((s) =>
      columns
        .filter((c) => selectedColumns.includes(c.key))
        .map((c) => {
          switch (c.key) {
            case "createdAt":
              return s.createdAt || "";
            case "trackingId":
              return s.trackingId || "";
            case "updatedAt":
              return s.updatedAt || "";
            case "customerEmail":
              return s.customerId?.email || "";
            case "id":
              return s._id || "";
            case "weight":
              return s.weight || "";
            case "pickupCity":
              return s.receiverAddress?.city || "";
            case "price":
              return s.shapmentPrice || "";
            case "dropoffCity":
              return s.senderAddress?.city || "";
            case "states":
              return s.shipmentstates || "";
            case "type":
              return s.shapmentingType || "";
            default:
              return "";
          }
        })
    );

    const wb = await XlsxPopulate.fromBlankAsync();
    const sheet = wb.sheet(0);
    headers.forEach((h, i) => {
      sheet.cell(1, i + 1).value(h).style({
        bold: true,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "FFDCE6F1",
        border: true,
      });
      sheet.column(i + 1).width(h.length + 15);
    });

    data.forEach((row, i) => {
      row.forEach((cell, j) => {
        sheet.cell(i + 2, j + 1).value(cell).style({
          fontSize: 10,
          fontFamily: "Arial",
        });
      });
    });

    const blob = await wb.outputAsync("blob");
    saveAs(blob, "selected_shipments.xlsx");
  };

  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" border-none" dir="rtl">
        <DialogHeader dir="ltr">
          <DialogTitle  className=" flex justify-end mt-6 font-bold text-primary text-2xl" > تصدير ملف</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
            <span>قم بإختيار الأعمدة التي ترغب في ب إضافتها للملف </span>
          {columns.map((col) => (
            <div key={col.key} className="flex items-center gap-2">
              <Checkbox
                checked={selectedColumns.includes(col.key)}
                onCheckedChange={() => toggleColumn(col.key)}
                className=" rounded-full"
              />
              <span>{col.label}</span>
            </div>
          ))}
        </div>

        <Button
          className="flex items-center gap-2 text-white bg-[#294D8B] hover:bg-[#1e3765]"
          onClick={(e) => {
            e.stopPropagation(); // يمنع إغلاق الـ dialog
            exportSelectedToExcel();
          }}
          disabled={!selectedColumns.length}
        >
          <Download className="h-4 w-4" />
          <span>تصدير إلى Excel</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExportToExcel;
