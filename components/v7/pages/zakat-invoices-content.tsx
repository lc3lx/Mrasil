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
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Info,
  HelpCircle,
  FileBarChart,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// بيانات وهمية لفواتير الزكاة
const zakatInvoices = [
  {
    id: "ZKT-001",
    company: "شركة الأفق للتجارة",
    amount: 12500.0,
    zakatAmount: 312.5,
    year: "1444",
    date: "2023-05-15",
    status: "paid",
    zakatNumber: "Z300000000001",
  },
  {
    id: "ZKT-002",
    company: "مؤسسة النور",
    amount: 7500.5,
    zakatAmount: 187.51,
    year: "1444",
    date: "2023-05-18",
    status: "pending",
    zakatNumber: "Z300000000002",
  },
  {
    id: "ZKT-003",
    company: "شركة المستقبل",
    amount: 21000.75,
    zakatAmount: 525.02,
    year: "1444",
    date: "2023-05-20",
    status: "paid",
    zakatNumber: "Z300000000003",
  },
  {
    id: "ZKT-004",
    company: "مؤسسة الإبداع",
    amount: 4500.25,
    zakatAmount: 112.51,
    year: "1444",
    date: "2023-05-22",
    status: "overdue",
    zakatNumber: "Z300000000004",
  },
  {
    id: "ZKT-005",
    company: "شركة الرياض للتجارة",
    amount: 18000.0,
    zakatAmount: 450.0,
    year: "1444",
    date: "2023-05-25",
    status: "paid",
    zakatNumber: "Z300000000005",
  },
]

// ترجمة حالة فاتورة الزكاة
const statusTranslation = {
  paid: "مدفوعة",
  pending: "قيد الانتظار",
  overdue: "متأخرة",
}

// لون حالة فاتورة الزكاة
const statusColor = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// أيقونة حالة فاتورة الزكاة
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

export function ZakatInvoicesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)

  // تصفية فواتير الزكاة بناءً على البحث
  const filteredInvoices = zakatInvoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.zakatNumber.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">فواتير الزكاة</h1>
          <p className="text-muted-foreground">إدارة ومتابعة فواتير الزكاة وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="v7-neu-button-flat">
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
          <Button className="v7-neu-button">
            <Plus className="ml-2 h-4 w-4" />
            فاتورة زكاة جديدة
          </Button>
        </div>
      </div>

      <div className="v7-neu-card rounded-xl p-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 ml-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-emerald-800 dark:text-emerald-300">معلومات هامة عن فواتير الزكاة</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                وفقاً لأنظمة هيئة الزكاة والضريبة والجمارك، يجب تقديم إقرارات الزكاة السنوية وسداد المستحقات خلال المدة
                المحددة. تحسب الزكاة بنسبة 2.5% من وعاء الزكاة.
              </p>
              <div className="flex mt-2">
                <Button variant="link" size="sm" className="h-auto p-0 text-emerald-700 dark:text-emerald-400">
                  <HelpCircle className="h-4 w-4 ml-1" />
                  عرض طريقة حساب الزكاة
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث عن فاتورة زكاة..."
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
                <TableHead>الشركة</TableHead>
                <TableHead>رقم الزكاة</TableHead>
                <TableHead>السنة الهجرية</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    التاريخ
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    وعاء الزكاة
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>مبلغ الزكاة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="v7-neu-table-row">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.company}</TableCell>
                    <TableCell>{invoice.zakatNumber}</TableCell>
                    <TableCell>{invoice.year} هـ</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("ar-SA")}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString("ar-SA")}</TableCell>
                    <TableCell className="font-medium">{invoice.zakatAmount.toLocaleString("ar-SA")}</TableCell>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileBarChart className="h-4 w-4" />
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
                  <TableCell colSpan={9} className="h-24 text-center">
                    لا توجد فواتير زكاة مطابقة لبحثك
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">إجمالي فواتير الزكاة: {filteredInvoices.length}</div>
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
