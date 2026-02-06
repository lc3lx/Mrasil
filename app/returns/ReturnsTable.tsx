import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ChevronDown, Download, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Shipment {
  _id: string;
  type: string;
  requestNote: string;
  createdAt: string;
  reqstatus?: 'pending' | 'yes' | 'no';
  shipment?: { company?: string };
}

interface ReturnsTableProps {
  data?: Shipment[];
  isLoading: boolean;
  error: any;
  isApproving: boolean;
  handleApproval: any;
  approvalResult: { status: 'success' | 'error', message: string } | null;
  setApprovalResult: (val: any) => void;
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({
  data,
  isLoading,
  error,
  isApproving,
  handleApproval,
  approvalResult,
  setApprovalResult,
}) => {
  // Single-select logic (radio)
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Header radio: only clears selection if clicked
  const clearSelection = () => {
    setSelectedRow(null);
  };

  // Toggle select single row
  const toggleSelectRow = (id: string) => {
    if (selectedRow === id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(id);
    }
  };

  // Bulk actions bar visibility
  const showBulkBar = selectedRow !== null;
  const selectedCount = selectedRow ? 1 : 0;

  return (
    <div dir="rtl" className="v7-neu-card p-6 rounded-xl shadow bg-white dark:bg-gray-800 overflow-x-auto">
      {/* Bulk actions bar above the table */}
      {showBulkBar && (
        <div className="mb-4">
                      <div className="flex items-center justify-between bg-[#f4f8ff] rounded-2xl px-6 py-4 shadow" style={{ minHeight: 64 }}>
            <div className="flex items-center gap-2">
              <span className="text-[#2563eb] font-bold text-lg">تم تحديد {selectedCount} مرتجع</span>
              <span className="bg-[#2563eb] text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold">{selectedCount}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white rounded-xl px-4 py-2 text-[#2563eb] flex items-center gap-2 shadow-none text-base" variant="outline" size="sm">
                  <ChevronDown className="h-5 w-5 ml-1" />
                  <span>إجراءات جماعية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#f4f8ff] rounded-xl shadow min-w-[180px]">
                <DropdownMenuItem className="text-green-600 flex items-center gap-2 hover:bg-blue-50 cursor-pointer">
                  <CheckCircle className="h-5 w-5" /> الموافقة على المحدد
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 flex items-center gap-2 hover:bg-blue-50 cursor-pointer">
                  <XCircle className="h-5 w-5" /> رفض المحدد
                </DropdownMenuItem>
                <DropdownMenuItem className="text-blue-600 flex items-center gap-2 hover:bg-blue-50 cursor-pointer">
                  <Download className="h-5 w-5" /> تصدير المحدد
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 flex items-center gap-2 hover:bg-blue-50 cursor-pointer">
                  <Trash2 className="h-5 w-5" /> حذف المحدد
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      {isLoading && <div className="text-center py-8 text-lg">جاري التحميل...</div>}
      {error && <div className="text-center py-8 text-red-600 text-lg">حدث خطأ أثناء جلب البيانات</div>}
      {!isLoading && !error && (!data || !data.length) && (
        <div className="text-center py-8 text-lg">لا توجد بيانات</div>
      )}
      {!isLoading && !error && data && data.length > 0 && (
        <table className="w-full min-w-[1000px] whitespace-nowrap rounded-xl text-base bg-white shadow-none">
          <thead>
            <tr className="bg-[#f7fafd]">
              <th className="px-4 py-3 text-base font-extrabold text-[#294D8B] min-w-[60px]">
                <input
                  type="radio"
                  checked={selectedRow === null}
                  onChange={clearSelection}
                  className="accent-blue-600 h-5 w-5 rounded-full border-none focus:ring-2 focus:ring-blue-200"
                  aria-label="إلغاء التحديد"
                />
              </th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[180px]">رقم الطلب</th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[120px]">نوع الطلب</th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[200px]">ملاحظات</th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[180px]">تاريخ الإنشاء</th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[120px]">شركة الشحن</th>
              <th className="px-4 py-3 text-base font-extrabold text-black min-w-[120px]">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-[#f7fafd] transition-colors text-lg">
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    checked={selectedRow === item._id}
                    onChange={() => toggleSelectRow(item._id)}
                    className="accent-blue-600 h-5 w-5 rounded-full border-none focus:ring-2 focus:ring-blue-200"
                    aria-label={`تحديد المرتجع ${item._id}`}
                  />
                </td>
                <td className="px-4 py-3 font-bold text-[#294D8B] text-lg">{item._id}</td>
                <td className="px-4 py-3 text-gry font-medium text-lg">{item.type === 'return' ? 'استرجاع' : item.type}</td>
                <td className="px-4 py-3 text-gry font-medium text-lg">{item.requestNote}</td>
                <td className="px-4 py-3 text-gry font-medium text-lg">{new Date(item.createdAt).toLocaleString('ar-EG')}</td>
                <td className="px-4 py-3 text-gry font-medium text-lg">{item.shipment?.company || '-'}</td>
                <td className="px-4 py-3">
                  {item.reqstatus === 'no' && (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium text-lg px-3 py-1.5 rounded-lg bg-red-50">
                      <XCircle className="h-5 w-5" />
                      مرفوضة
                    </span>
                  )}
                  {item.reqstatus === 'yes' && (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium text-lg px-3 py-1.5 rounded-lg bg-green-50">
                      <CheckCircle className="h-5 w-5" />
                      تم الموافقة
                    </span>
                  )}
                  {item.reqstatus !== 'no' && item.reqstatus !== 'yes' && (
                    <div className="flex flex-row items-center gap-4 justify-end">
                      <button
                        className="flex items-center gap-1 text-green-600 font-bold text-lg px-3 py-2 rounded hover:bg-green-50 transition"
                        disabled={isApproving}
                        onClick={async () => {
                          try {
                            const res = await handleApproval({ returnRequestId: item._id, approve: true }).unwrap();
                            setApprovalResult({ status: 'success', message: res.message || 'تمت الموافقة بنجاح' });
                          } catch (err: any) {
                            setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الموافقة' });
                          }
                        }}
                      >
                        <CheckCircle className="h-5 w-5 ml-1" />
                        موافقة
                      </button>
                      <button
                        className="flex items-center gap-1 text-red-600 font-bold text-lg px-3 py-2 rounded hover:bg-red-50 transition"
                        disabled={isApproving}
                        onClick={async () => {
                          try {
                            const res = await handleApproval({ returnRequestId: item._id, approve: false }).unwrap();
                            setApprovalResult({ status: 'success', message: res.message || 'تم الرفض بنجاح' });
                          } catch (err: any) {
                            setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الرفض' });
                          }
                        }}
                      >
                        <XCircle className="h-5 w-5 ml-1 text-red-600" />
                        رفض
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {approvalResult && (
        <AlertDialog open={!!approvalResult} onOpenChange={() => setApprovalResult(null)}>
          <AlertDialogContent className="rounded-lg shadow-lg p-6 bg-white dark:bg-gray-900 max-w-md mx-auto">
            <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold text-center mb-2">{approvalResult.status === 'success' ? 'نجاح' : 'خطأ'}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className={`text-center py-4 ${approvalResult.status === 'success' ? 'text-green-700' : 'text-red-700'} text-lg font-medium`}>{approvalResult.message}</div>
            <div className="flex justify-center mt-4">
              <AlertDialogAction className="v7-neu-button-accent px-6 py-2 rounded-lg" onClick={() => setApprovalResult(null)}>حسناً</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ReturnsTable; 