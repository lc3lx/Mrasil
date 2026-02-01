import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Share2, CheckCircle, XCircle, ChevronDown, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React from 'react';

interface ReturnsFiltersBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  returnTypeFilter: string;
  setReturnTypeFilter: (v: string) => void;
  selectedReturns: string[];
  handleBulkAction: (action: string) => void;
  setShowCustomizeOptions: (v: boolean) => void;
  value: string;
  onTabChange: (v: string) => void;
  /** نص placeholder لمربع البحث (اختياري، الافتراضي: بحث عن رقم الرجيع أو المنتج) */
  searchPlaceholder?: string;
}

const ReturnsFiltersBar: React.FC<ReturnsFiltersBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  returnTypeFilter,
  setReturnTypeFilter,
  selectedReturns,
  handleBulkAction,
  setShowCustomizeOptions,
  value,
  onTabChange,
  searchPlaceholder = "بحث عن رقم الرجيع أو المنتج...",
}) => (
  <div className="mb-6">
    <Tabs dir="rtl" value={value} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
        <TabsList className="v7-neu-tabs mb-1">
          <TabsTrigger value="all" className="text-sm sm:text-base">الكل</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm sm:text-base">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="approved" className="  text-sm sm:text-base">تمت الموافقة</TabsTrigger>
          <TabsTrigger value="processed" className=" text-sm sm:text-base">تمت المعالجة</TabsTrigger>
          <TabsTrigger value="replacement" className=" text-sm sm:text-base">صفحة الإستبدال</TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search filter */}
          <div className="relative flex-1 min-w-[240px] sm:min-w-[280px] w-full max-w-[360px] v7-neu-input-container">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gry pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="v7-neu-input w-full h-10 sm:h-11 pl-3 pr-10 text-base rounded-lg border border-[#E4E9F2] bg-white text-[#294D8B] placeholder:text-[#6d6a67] focus:outline-none focus:ring-2 focus:ring-[#294D8B]/30 focus:border-[#294D8B] transition-shadow"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="v7-neu-button w-[180px] text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              <SelectValue placeholder="فلترة بالحالة" />
            </SelectTrigger>
            <SelectContent className=' bg-white border-none'>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="approved">تم الموافقة</SelectItem>
              <SelectItem value="rejected">مرفوض</SelectItem>
              <SelectItem value="received">تم الاستلام</SelectItem>
              <SelectItem value="processed">تمت المعالجة</SelectItem>
            </SelectContent>
          </Select>
          {/* Return type filter */}
          <Select value={returnTypeFilter} onValueChange={setReturnTypeFilter}>
            <SelectTrigger className="v7-neu-button w-[180px] text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              <SelectValue placeholder="نوع الرجيع" />
            </SelectTrigger>
            <SelectContent className=' bg-white border-none'>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="product">منتجات</SelectItem>
              <SelectItem value="waybill">بوالص شحن</SelectItem>
            </SelectContent>
          </Select>
          {/* Export button */}
          <Button className="v7-neu-button gap-1 text-base">
            <Download className="h-5 w-5" />
            <span className="hidden sm:inline-block">تصدير</span>
          </Button>
          {/* Customize returns page button */}

        </div>
      </div>
      {selectedReturns.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold">
              {selectedReturns.length}
            </div>
            <span className="text-base font-medium text-blue-700">تم تحديد {selectedReturns.length} مرتجع</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-base bg-white hover:bg-blue-50"
                disabled={selectedReturns.length === 0}
              >
                إجراءات جماعية <ChevronDown className="mr-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">
              <DropdownMenuItem onClick={() => handleBulkAction('approve')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                <CheckCircle className="h-5 w-5 ml-2 text-green-600" />
                <span>الموافقة على المحدد</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('reject')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                <XCircle className="h-5 w-5 ml-2 text-red-600" />
                <span>رفض المحدد</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('export')} className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                <Download className="h-5 w-5 ml-2 text-blue-600" />
                <span>تصدير المحدد</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600 text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer">
                <Trash2 className="h-5 w-5 ml-2 text-red-600" />
                <span>حذف المحدد</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Tabs>
  </div>
);

export default ReturnsFiltersBar; 