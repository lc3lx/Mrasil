import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useCreateRequestMutation } from '../../api/createReturnOrExchangeRequestApi';
import { useSearchShipmentsQuery } from '../../api/searchMyCustomerShipmentsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { Customer } from '../../api/customerApi';

interface ChooseActionStepProps {
  onSelect: (action: 'replacement' | 'return') => void;
  company?: Customer;
}

export default function ChooseActionStep({ onSelect, company }: ChooseActionStepProps) {
  const [selected, setSelected] = useState<'replacement' | 'return' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [shipmentId, setShipmentId] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEmailToQuery, setSearchEmailToQuery] = useState<string|null>(null);
  const [alertMsg, setAlertMsg] = useState<string|null>(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();

  const { data: searchResult, isLoading: isSearchLoading, error: searchError } = useSearchShipmentsQuery(
    searchEmailToQuery ? { email: searchEmailToQuery } : skipToken
  );

  // Compute a very light brand color
  const lightBrandColor = company?.brand_color ? `${company.brand_color}20` : '#f8fafc';

  function handleSearch() {
    if (!searchEmail) return;
    setSearchEmailToQuery(searchEmail);
    setShowSearchDialog(true);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createRequest({ shipmentId, typerequesst: selected === 'replacement' ? 'exchange' : 'return', requestNote }).unwrap();
      setAlertMsg(res.message);
      setShowForm(false);
      setShipmentId('');
      setRequestNote('');
    } catch (err: any) {
      setAlertMsg(err?.data?.message || 'حدث خطأ');
    }
  };

  const renderSearchDialog = () => (
    <AlertDialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>نتيجة البحث</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="text-center py-4">
          {isSearchLoading && 'جاري التحميل...'}
          {searchError && <span className="text-red-600">حدث خطأ أثناء جلب البيانات</span>}
          {!isSearchLoading && !searchError && (!searchResult || !Array.isArray(searchResult.data) || searchResult.data.length === 0) && (
            <span>لا توجد بيانات لهذا البريد الإلكتروني أو لا توجد شحنات.</span>
          )}
          {!isSearchLoading && !searchError && searchResult && Array.isArray(searchResult.data) && searchResult.data.length > 0 ? (
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-sm text-right whitespace-nowrap">
                <thead>
                  <tr>
                    {Object.keys(searchResult.data[0]).map((key) => (
                      <th key={key} className="px-2 py-1 font-semibold">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searchResult.data.map((row: any, idx: number) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-2 py-1">{val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val) : val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="flex justify-end">
          <AlertDialogAction onClick={() => setShowSearchDialog(false)}>إغلاق</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (selected === 'replacement' || selected === 'return') {
    const isReplacement = selected === 'replacement';
    return (
      <div className="flex flex-col items-center justify-center gap-12 mt-16 w-full min-h-screen" style={{ background: lightBrandColor }}>
        <div className="flex flex-col items-center py-6 w-full">
          {company?.brand_logo && (
            <img src={company.brand_logo} alt="logo" className="h-16 mb-2" style={{objectFit:'contain'}} />
          )}
          <div className="text-center">
            <div className="font-bold text-xl text-[#294D8B] dark:text-blue-400">{company?.company_name_ar}</div>
            <div className="text-md text-gray-600 dark:text-gray-300">{company?.company_name_en}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{company?.tax_number && `الرقم الضريبي: ${company.tax_number}`}</div>
          </div>
        </div>
        <Card className="w-full max-w-2xl p-8 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl mb-6">{isReplacement ? 'ادارة الاستبدال' : 'ادرة الاسترجاع'}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-10">
            <Button className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white w-full py-4 text-lg rounded-xl" onClick={() => setShowForm(true)}>
              {isReplacement ? 'انشاء طلب استبدال جديد' : 'انشاء طلب استرجاع جديد'}
            </Button>
            {showForm && (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 mt-4 p-6 border rounded-xl bg-gray-50 dark:bg-gray-800">
                <label className="text-right font-medium text-lg">رقم الشحنة</label>
                <Input value={shipmentId} onChange={e => setShipmentId(e.target.value)} required className="h-12 text-lg rounded-lg" />
                <label className="text-right font-medium text-lg">نوع الطلب</label>
                <Input value={isReplacement ? 'exchange' : 'return'} readOnly className="h-12 text-lg rounded-lg bg-gray-200 dark:bg-gray-700" />
                <label className="text-right font-medium text-lg">ملاحظات</label>
                <Input value={requestNote} onChange={e => setRequestNote(e.target.value)} className="h-12 text-lg rounded-lg" />
                <div className="flex justify-end gap-4 mt-2">
                  <Button type="submit" disabled={isCreating} className="px-8 py-3 text-lg rounded-lg">{isCreating ? 'جاري الإرسال...' : 'ارسال'}</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-8 py-3 text-lg rounded-lg">إلغاء</Button>
                </div>
              </form>
            )}
            <div className="flex flex-col gap-3">
              <label htmlFor="search-email" className="text-right font-medium text-lg">ابحث عن الشحنة الخاصة بك</label>
              <div className="flex gap-3">
                <Input id="search-email" type="email" placeholder="ادخل البريد الالكترونى" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} className="h-12 text-lg rounded-lg flex-1" />
                <Button type="button" onClick={handleSearch} className="px-8 py-3 text-lg rounded-lg">بحث</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {alertMsg && (
          <AlertDialog open={!!alertMsg} onOpenChange={() => setAlertMsg(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>النتيجة</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="text-center py-4 text-lg">{alertMsg}</div>
              <div className="flex justify-end">
                <AlertDialogAction onClick={() => setAlertMsg(null)} className="px-8 py-3 text-lg rounded-lg">حسناً</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {renderSearchDialog()}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 mt-16 w-full min-h-screen" style={{ background: lightBrandColor }}>
      <div className="flex flex-col items-center py-6 w-full">
        {company?.brand_logo && (
          <img src={company.brand_logo} alt="logo" className="h-16 mb-2" style={{objectFit:'contain'}} />
        )}
        <div className="text-center">
          <div className="font-bold text-xl text-[#294D8B] dark:text-blue-400">{company?.company_name_ar}</div>
          <div className="text-md text-gray-600 dark:text-gray-300">{company?.company_name_en}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{company?.tax_number && `الرقم الضريبي: ${company.tax_number}`}</div>
        </div>
      </div>
      <h2 className="text-4xl font-bold text-[#294D8B] dark:text-blue-400 mb-10 text-center">اختر الإجراء</h2>
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl justify-center">
        <Card
          className="flex-1 cursor-pointer hover:shadow-2xl transition-shadow border-blue-400 p-8 rounded-2xl min-w-[320px] max-w-xl"
          onClick={() => { setSelected('replacement'); onSelect('replacement'); }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl mb-4">ادارة الاستبدال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-600 dark:text-gray-300 text-lg">إدارة جميع طلبات الاستبدال الخاصة بك</div>
          </CardContent>
        </Card>
        <Card
          className="flex-1 cursor-pointer hover:shadow-2xl transition-shadow border-blue-400 p-8 rounded-2xl min-w-[320px] max-w-xl"
          onClick={() => { setSelected('return'); onSelect('return'); }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl mb-4">ادرة الاسترجاع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-600 dark:text-gray-300 text-lg">إدارة جميع طلبات الاسترجاع الخاصة بك</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 