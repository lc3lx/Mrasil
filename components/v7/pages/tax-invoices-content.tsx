"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Download,
  Filter,
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Info,
  HelpCircle,
  QrCode,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// بيانات وهمية للفواتير الضريبية
const taxInvoices = [
  {
    id: "VAT-001",
    customer: "شركة الأفق للتجارة",
    amount: 1250.0,
    vatAmount: 187.5,
    totalAmount: 1437.5,
    date: "2023-05-15",
    status: "approved",
    vatNumber: "300000000000003",
    qrCode: true,
    shipmentId: "SHP-2301",
  },
  {
    id: "VAT-002",
    customer: "مؤسسة النور",
    amount: 750.5,
    vatAmount: 112.58,
    totalAmount: 863.08,
    date: "2023-05-18",
    status: "pending",
    vatNumber: "300000000000004",
    qrCode: true,
    shipmentId: "SHP-2302",
  },
  {
    id: "VAT-003",
    customer: "شركة المستقبل",
    amount: 2100.75,
    vatAmount: 315.11,
    totalAmount: 2415.86,
    date: "2023-05-20",
    status: "approved",
    vatNumber: "300000000000005",
    qrCode: true,
    shipmentId: "SHP-2303",
  },
  {
    id: "VAT-004",
    customer: "مؤسسة الإبداع",
    amount: 450.25,
    vatAmount: 67.54,
    totalAmount: 517.79,
    date: "2023-05-22",
    status: "rejected",
    vatNumber: "300000000000006",
    qrCode: false,
    shipmentId: "SHP-2304",
  },
  {
    id: "VAT-005",
    customer: "شركة الرياض للتجارة",
    amount: 1800.0,
    vatAmount: 270.0,
    totalAmount: 2070.0,
    date: "2023-05-25",
    status: "approved",
    vatNumber: "300000000000007",
    qrCode: true,
    shipmentId: "SHP-2305",
  },
  {
    id: "VAT-006",
    customer: "مؤسسة السلام",
    amount: 950.5,
    vatAmount: 142.58,
    totalAmount: 1093.08,
    date: "2023-05-28",
    status: "pending",
    vatNumber: "300000000000008",
    qrCode: true,
    shipmentId: "SHP-2306",
  },
  {
    id: "VAT-007",
    customer: "شركة الأمل",
    amount: 1500.25,
    vatAmount: 225.04,
    totalAmount: 1725.29,
    date: "2023-05-30",
    status: "approved",
    vatNumber: "300000000000009",
    qrCode: true,
    shipmentId: "SHP-2307",
  },
]

// ترجمة حالة الفاتورة الضريبية
const statusTranslation = {
  approved: "معتمدة",
  pending: "قيد المراجعة",
  rejected: "مرفوضة",
}

// لون حالة الفاتورة الضريبية
const statusColor = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// أيقونة حالة الفاتورة الضريبية
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    default:
      return null
  }
}

export function TaxInvoicesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)

  // تصفية الفواتير الضريبية بناءً على البحث
  const filteredInvoices = taxInvoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vatNumber.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">الفواتير الضريبية</h1>
          <p className="text-muted-foreground">
            إدارة ومتابعة الفواتير الضريبية وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="v7-neu-button-flat">
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
          <Button className="v7-neu-button">
            <Plus className="ml-2 h-4 w-4" />
            فاتورة ضريبية جديدة
          </Button>
        </div>
      </div>

      <div className="v7-neu-card rounded-xl p-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 ml-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">معلومات هامة عن الفواتير الضريبية</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك، يجب إصدار فواتير ضريبية تتضمن رمز QR وتفاصيل ضريبة القيمة
                المضافة (15%). تأكد من صحة الرقم الضريبي وجميع البيانات المطلوبة.
              </p>
              <div className="flex mt-2">
                <Button variant="link" size="sm" className="h-auto p-0 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-4 w-4 ml-1" />
                  عرض متطلبات الفواتير الضريبية
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث عن فاتورة ضريبية..."
              className="pr-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="تاريخ الفاتورة" align="end" />
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">رقم الفاتورة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الرقم الضريبي</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    التاريخ
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    المبلغ
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>ضريبة القيمة المضافة</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>QR</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="v7-neu-table-row">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help underline decoration-dotted">
                              {invoice.vatNumber.substring(0, 4)}...
                              {invoice.vatNumber.substring(invoice.vatNumber.length - 4)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p dir="ltr">{invoice.vatNumber}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("ar-SA")}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString("ar-SA")}</TableCell>
                    <TableCell>{invoice.vatAmount.toLocaleString("ar-SA")}</TableCell>
                    <TableCell className="font-medium">{invoice.totalAmount.toLocaleString("ar-SA")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={invoice.status} />
                        <Badge className={`${statusColor[invoice.status as keyof typeof statusColor]}`}>
                          {statusTranslation[invoice.status as keyof typeof statusTranslation]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.qrCode ? (
                        <QrCode className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    لا توجد فواتير ضريبية مطابقة لبحثك
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">إجمالي الفواتير الضريبية: {filteredInvoices.length}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              السابق
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm">
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
