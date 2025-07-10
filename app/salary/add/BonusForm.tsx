"use client";

import { useState } from "react";
import { useAddBonusMutation } from "../../api/salaryApi";
import { useGetAllTeamMembersQuery } from "../../api/teamApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BonusForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: teamData, isLoading: isTeamLoading } = useGetAllTeamMembersQuery();
  const [addBonus, { isLoading }] = useAddBonusMutation();
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [alert, setAlert] = useState<{ status: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !amount || !reason) return;
    try {
      const res = await addBonus({ id: employeeId, amount: Number(amount), reason }).unwrap();
      setAlert({ status: res.status, message: res.message });
    } catch (err: any) {
      setAlert({ status: "fail", message: err?.data?.message || "حدث خطأ" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>اضافة حافز لموظف</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <label className="text-right font-medium">اختر الموظف</label>
          <select
            className="h-12 rounded-lg border px-3"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            required
            disabled={isTeamLoading}
          >
            <option value="">اختر الموظف</option>
            {teamData?.data?.employees?.map((emp: any) => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName || emp.name || emp.email}
              </option>
            ))}
          </select>
          <label className="text-right font-medium">المبلغ</label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min={1}
            placeholder="أدخل المبلغ"
          />
          <label className="text-right font-medium">السبب</label>
          <Input
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            placeholder="أدخل السبب"
          />
          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading ? "جاري الإرسال..." : "إرسال"}
          </Button>
        </form>
        {alert && (
          <div className={`mt-4 p-3 rounded text-center ${alert.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {alert.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 