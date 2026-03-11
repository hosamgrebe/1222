"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transactionSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FormValues = z.infer<typeof transactionSchema>;

export function TransactionForm({
  cashBoxes,
  categories,
  initial,
  transactionId
}: {
  cashBoxes: Array<{ id: string; name: string; currency: string }>;
  categories: Array<{ id: string; name: string }>;
  initial?: Partial<FormValues>;
  transactionId?: string;
}) {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "DEPOSIT",
      transactionDate: new Date().toISOString().slice(0, 10),
      ...initial
    }
  });

  const type = watch("type");

  const onSubmit = async (values: FormValues) => {
    const method = transactionId ? "PUT" : "POST";
    const url = transactionId ? `/api/transactions/${transactionId}` : "/api/transactions";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!res.ok) {
      alert("فشل حفظ العملية");
      return;
    }
    router.push("/transactions");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
      <div>
        <label>الصندوق</label>
        <Select {...register("cashBoxId")}>
          <option value="">اختر</option>
          {cashBoxes.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.currency})</option>)}
        </Select>
        <p className="text-xs text-red-600">{errors.cashBoxId?.message}</p>
      </div>
      <div>
        <label>نوع العملية</label>
        <Select {...register("type")}>
          <option value="DEPOSIT">إيداع</option>
          <option value="WITHDRAWAL">سحب</option>
          <option value="EXPENSE">مصروف</option>
        </Select>
      </div>
      <div><label>المبلغ</label><Input type="number" step="0.01" {...register("amount")} /></div>
      <div><label>التاريخ</label><Input type="date" {...register("transactionDate")} /></div>
      <div><label>الوصف</label><Input {...register("description")} /></div>
      <div><label>الجهة/الشخص</label><Input {...register("partyName")} /></div>
      <div><label>رقم مرجعي</label><Input {...register("referenceNumber")} /></div>
      {type === "EXPENSE" && (
        <div>
          <label>نوع المصروف</label>
          <Select {...register("expenseCategoryId")}>
            <option value="">بدون</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
      )}
      <div className="md:col-span-2"><label>ملاحظات</label><Input {...register("notes")} /></div>
      <div className="md:col-span-2"><Button disabled={isSubmitting}>{transactionId ? "حفظ التعديل" : "إضافة العملية"}</Button></div>
    </form>
  );
}
