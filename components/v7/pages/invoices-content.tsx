"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Download,
  Filter,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Printer,
  Share2,
  Mail,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import QRCode from "react-qr-code"

// بيانات وهمية للفواتير
const invoices = [
  {
    id: "INV-001",
    customer: "شركة الأفق للتجارة",
    amount: 1250.0,
    date: "2023-05-15",
    status: "paid",
    shipmentId: "SHP-2301",
    taxId: "300000000000003",
    items: [
      { name: "شحن طرد", quantity: 1, price: 1000 },
      { name: "تأمين", quantity: 1, price: 250 },
    ],
    address: "الرياض، حي النزهة، شارع التخصصي",
    vatAmount: 187.5,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-15T13:45:00Z",
  },
  {
    id: "INV-002",
    customer: "مؤسسة النور",
    amount: 750.5,
    date: "2023-05-18",
    status: "pending",
    shipmentId: "SHP-2302",
    taxId: "300000000000004",
    items: [
      { name: "شحن طرد", quantity: 1, price: 650 },
      { name: "تغليف إضافي", quantity: 1, price: 100.5 },
    ],
    address: "جدة، حي الروضة، شارع فلسطين",
    vatAmount: 112.58,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-18T10:30:00Z",
  },
  {
    id: "INV-003",
    customer: "شركة المستقبل",
    amount: 2100.75,
    date: "2023-05-20",
    status: "paid",
    shipmentId: "SHP-2303",
    taxId: "300000000000005",
    items: [
      { name: "شحن طرود متعددة", quantity: 3, price: 600 },
      { name: "خدمة التوصيل السريع", quantity: 1, price: 300.75 },
    ],
    address: "الدمام، حي الشاطئ، طريق الملك فهد",
    vatAmount: 315.11,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-20T15:20:00Z",
  },
  {
    id: "INV-004",
    customer: "مؤسسة الإبداع",
    amount: 450.25,
    date: "2023-05-22",
    status: "overdue",
    shipmentId: "SHP-2304",
    taxId: "300000000000006",
    items: [
      { name: "شحن طرد", quantity: 1, price: 350 },
      { name: "تتبع متقدم", quantity: 1, price: 100.25 },
    ],
    address: "المدينة المنورة، حي العزيزية، شارع السلام",
    vatAmount: 67.54,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-22T09:15:00Z",
  },
  {
    id: "INV-005",
    customer: "شركة الرياض للتجارة",
    amount: 1800.0,
    date: "2023-05-25",
    status: "paid",
    shipmentId: "SHP-2305",
    taxId: "300000000000007",
    items: [
      { name: "شحن دولي", quantity: 1, price: 1500 },
      { name: "التخليص الجمركي", quantity: 1, price: 300 },
    ],
    address: "الرياض، حي الملز، شارع الصناعة",
    vatAmount: 270,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-25T14:00:00Z",
  },
  {
    id: "INV-006",
    customer: "مؤسسة السلام",
    amount: 950.5,
    date: "2023-05-28",
    status: "pending",
    shipmentId: "SHP-2306",
    taxId: "300000000000008",
    items: [
      { name: "شحن طرد", quantity: 1, price: 800 },
      { name: "تأمين إضافي", quantity: 1, price: 150.5 },
    ],
    address: "مكة المكرمة، حي العزيزية، شارع الهجرة",
    vatAmount: 142.58,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-28T11:45:00Z",
  },
  {
    id: "INV-007",
    customer: "شركة الأمل",
    amount: 1500.25,
    date: "2023-05-30",
    status: "paid",
    shipmentId: "SHP-2307",
    taxId: "300000000000009",
    items: [
      { name: "شحن طرود متعددة", quantity: 2, price: 600 },
      { name: "خدمة التسليم في نفس اليوم", quantity: 1, price: 300.25 },
    ],
    address: "الرياض، حي الورود، طريق الملك عبدالله",
    vatAmount: 225.04,
    sellerTaxNumber: "300000000000001",
    invoiceTimestamp: "2023-05-30T16:30:00Z",
  },
]

// ترجمة حالة الفاتورة
const statusTranslation = {
  paid: "مدفوعة",
  pending: "قيد الانتظار",
  overdue: "متأخرة",
}

// لون حالة الفاتورة
const statusColor = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// أيقونة حالة الفاتورة
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    case "overdue":
      return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    default:
      return null
  }
}

// مكون رمز QR للفاتورة الضريبية
const TaxInvoiceQRCode = ({ invoice }: { invoice: (typeof invoices)[0] }) => {
  // إنشاء محتوى رمز QR وفقًا لمتطلبات هيئة الزكاة والضريبة والجمارك
  // المرجع: https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Pages/default.aspx
  const qrData = [
    invoice.sellerTaxNumber, // الرقم الضريبي للبائع
    invoice.invoiceTimestamp, // تاريخ ووقت الفاتورة
    invoice.amount.toFixed(2), // إجمالي الفاتورة (بدون ضريبة)
    invoice.vatAmount.toFixed(2), // مبلغ ضريبة القيمة المضافة
  ].join("\n")

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 rounded-lg">
        <QRCode value={qrData} size={120} />
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        رمز QR للفاتورة الضريبية
        <br />
        وفقًا لمتطلبات هيئة الزكاة والضريبة والجمارك
      </p>
    </div>
  )
}

export function InvoicesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoices)[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  // تصفية الفواتير بناءً على البحث
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // عرض تفاصيل الفاتورة
  const handleViewInvoice = (invoice: (typeof invoices)[0]) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  // تنزيل الفاتورة
  const handleDownloadInvoice = (invoiceId: string) => {
    setIsDownloading(invoiceId)

    // محاكاة عملية التنزيل
    setTimeout(() => {
      setIsDownloading(null)
      setDownloadSuccess(invoiceId)

      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => {
        setDownloadSuccess(null)
      }, 3000)

      // إنشاء رابط وهمي للتنزيل
      const link = document.createElement("a")
      link.href = "#"
      link.setAttribute("download", `فاتورة-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1500)
  }

  // طباعة الفاتورة
  const handlePrintInvoice = () => {
    window.print()
  }

  // إرسال الفاتورة بالبريد الإلكتروني
  const handleEmailInvoice = () => {
    alert("تم إرسال الفاتورة بنجاح إلى البريد الإلكتروني المسجل")
  }

  // مشاركة الفاتورة
  const handleShareInvoice = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `فاتورة رقم ${selectedInvoice?.id}`,
          text: `فاتورة ${selectedInvoice?.customer} بمبلغ ${selectedInvoice?.amount} ريال`,
          url: window.location.href,
        })
        .catch((error) => console.log("خطأ في المشاركة:", error))
    } else {
      alert("تم نسخ رابط الفاتورة إلى الحافظة")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#294D8B" }}>
            الفواتير
          </h1>
          <p className="text-muted-foreground">إدارة ومتابعة فواتير الشحنات</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="v7-neu-button font-medium shadow-md hover:shadow-lg transition-all">
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="v7-neu-card rounded-xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث عن فاتورة..."
              className="pr-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="تاريخ الفاتورة" align="end" />
            <Button size="icon" className="v7-neu-button font-medium shadow-md hover:shadow-lg transition-all shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] font-bold text-gray-900 dark:text-gray-100">رقم الفاتورة</TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100">العميل</TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100">رقم الشحنة</TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    التاريخ
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    المبلغ (ريال)
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100">الحالة</TableHead>
                <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="v7-neu-table-row">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.shipmentId}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("ar-SA")}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString("ar-SA")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={invoice.status} />
                        <Badge className={`${statusColor[invoice.status as keyof typeof statusColor]}`}>
                          {statusTranslation[invoice.status as keyof typeof statusTranslation]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>عرض الفاتورة</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => handleDownloadInvoice(invoice.id)}
                                disabled={isDownloading === invoice.id}
                              >
                                {isDownloading === invoice.id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                ) : downloadSuccess === invoice.id ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>تنزيل الفاتورة</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    لا توجد فواتير مطابقة لبحثك
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">إجمالي الفواتير: {filteredInvoices.length}</div>
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

      {/* نافذة عرض تفاصيل الفاتورة */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>فاتورة رقم: {selectedInvoice?.id}</span>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrintInvoice}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>طباعة الفاتورة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => selectedInvoice && handleDownloadInvoice(selectedInvoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>تنزيل الفاتورة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleEmailInvoice}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>إرسال بالبريد الإلكتروني</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleShareInvoice}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>مشاركة الفاتورة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6 p-1">
              {/* رأس الفاتورة */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image src="/company-logo.png" alt="شعار الشركة" width={40} height={40} className="rounded-md" />
                    <h3 className="font-bold text-lg">شركة الشحن السريع</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">الرياض، المملكة العربية السعودية</p>
                  <p className="text-sm text-muted-foreground">الرقم الضريبي: {selectedInvoice.sellerTaxNumber}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm">تاريخ الإصدار: {new Date(selectedInvoice.date).toLocaleDateString("ar-SA")}</p>
                  <p className="text-sm">رقم الشحنة: {selectedInvoice.shipmentId}</p>
                  <div className="mt-2">
                    <Badge className={`${statusColor[selectedInvoice.status as keyof typeof statusColor]}`}>
                      {statusTranslation[selectedInvoice.status as keyof typeof statusTranslation]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* معلومات العميل ورمز QR */}
              <div className="flex flex-col md:flex-row gap-6 border-b pb-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">معلومات العميل</h4>
                  <p className="text-sm">{selectedInvoice.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.address}</p>
                  <p className="text-sm text-muted-foreground">الرقم الضريبي: {selectedInvoice.taxId}</p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <TaxInvoiceQRCode invoice={selectedInvoice} />
                </div>
              </div>

              {/* تفاصيل الفاتورة */}
              <div>
                <h4 className="font-medium mb-2">تفاصيل الفاتورة</h4>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-gray-900 dark:text-gray-100">البند</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-center">الكمية</TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-left">
                          السعر (ريال)
                        </TableHead>
                        <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-left">
                          المجموع (ريال)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-left">{item.price.toLocaleString("ar-SA")}</TableCell>
                          <TableCell className="text-left">
                            {(item.quantity * item.price).toLocaleString("ar-SA")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* ملخص الفاتورة */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع قبل الضريبة:</span>
                  <span>{(selectedInvoice.amount - selectedInvoice.vatAmount).toLocaleString("ar-SA")} ريال</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{selectedInvoice.vatAmount.toLocaleString("ar-SA")} ريال</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي:</span>
                  <span>{selectedInvoice.amount.toLocaleString("ar-SA")} ريال</span>
                </div>
              </div>

              {/* معلومات الفاتورة الضريبية */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">معلومات الفاتورة الضريبية</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  هذه فاتورة ضريبية صادرة وفقًا لأنظمة هيئة الزكاة واضريبة والجمارك في المملكة العربية السعودية.
                  <br />
                  يمكن التحقق من صحة هذه الفاتورة عبر مسح رمز QR أو من خلال بوابة الهيئة الإلكترونية.
                </p>
              </div>

              {/* ملاحظات */}
              <div className="border-t pt-4 text-sm text-muted-foreground">
                <p>* هذه الفاتورة صالحة لمدة 30 يوماً من تاريخ الإصدار</p>
                <p>* يرجى الاحتفاظ بنسخة من هذه الفاتورة للرجوع إليها مستقبلاً</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
