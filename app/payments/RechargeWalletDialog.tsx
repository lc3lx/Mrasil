import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRechargeWalletMutation } from "../api/walletApi";

interface RechargeWalletDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function RechargeWalletDialog({ open, onClose }: RechargeWalletDialogProps) {
  const [form, setForm] = useState({
    amount: "",
    name: "",
    number: "",
    cvc: "",
    month: "",
    year: "",
  });
  const [rechargeWallet, { isLoading, isSuccess, data, isError, error }] = useRechargeWalletMutation();
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await rechargeWallet({
      ...form,
      amount: Number(form.amount),
    });
    setShowResult(true);
  };

  const handleClose = () => {
    setShowResult(false);
    setForm({ amount: "", name: "", number: "", cvc: "", month: "", year: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>شحن المحفظة</DialogTitle>
          <DialogDescription>أدخل بيانات البطاقة والمبلغ لشحن المحفظة</DialogDescription>
        </DialogHeader>
        {!showResult ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
            <input name="amount" placeholder="المبلغ" value={form.amount} onChange={handleChange} required className="border rounded p-2" type="number" min="1" />
            <input name="name" placeholder="اسم حامل البطاقة" value={form.name} onChange={handleChange} required className="border rounded p-2" />
            <input name="number" placeholder="رقم البطاقة" value={form.number} onChange={handleChange} required className="border rounded p-2" />
            <input name="cvc" placeholder="CVC" value={form.cvc} onChange={handleChange} required className="border rounded p-2" />
            <input name="month" placeholder="شهر الانتهاء" value={form.month} onChange={handleChange} required className="border rounded p-2" />
            <input name="year" placeholder="سنة الانتهاء" value={form.year} onChange={handleChange} required className="border rounded p-2" />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>شحن</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">إلغاء</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col gap-3 items-center mt-4">
            {isSuccess && data?.success ? (
              <>
                <div className="text-green-600 font-bold text-lg">تم شحن المحفظة بنجاح!</div>
                <div>المبلغ: <span className="font-semibold">{data.payment.amount_format}</span></div>
                <div>الحالة: <span className="font-semibold">{data.payment.status}</span></div>
                <div>الوصف: <span className="font-semibold">{data.payment.description}</span></div>
                {data.payment.source?.transaction_url && (
                  <a href={data.payment.source.transaction_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">رابط المعاملة</a>
                )}
                <Button onClick={handleClose} className="mt-2">إغلاق</Button>
              </>
            ) : (
              <>
                <div className="text-red-600 font-bold text-lg">حدث خطأ أثناء الشحن.</div>
                <Button onClick={handleClose} className="mt-2">إغلاق</Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 