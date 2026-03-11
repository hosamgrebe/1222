import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { formatCurrency } from "@/lib/utils";

export default async function TransactionDetailsPage({ params }: { params: { id: string } }) {
  await requireAuth();
  const tx = await prisma.transaction.findUnique({ where: { id: params.id }, include: { cashBox: true, createdBy: true, expenseCategory: true } });
  if (!tx) return notFound();

  return <AppShell><Card className="space-y-2"><h2 className="text-lg font-bold">تفاصيل العملية</h2>
    <p>الصندوق: {tx.cashBox.name}</p><p>العملة: {tx.cashBox.currency}</p><p>النوع: {tx.type}</p>
    <p>المبلغ: {formatCurrency(Number(tx.amount), tx.cashBox.currency)}</p><p>التاريخ: {new Date(tx.transactionDate).toLocaleDateString("ar-SY")}</p><p>الوصف: {tx.description}</p>
    <p>الجهة: {tx.partyName}</p><p>المرجع: {tx.referenceNumber ?? "-"}</p><p>الملاحظات: {tx.notes ?? "-"}</p><p>رصيد بعد العملية: {formatCurrency(Number(tx.balanceAfter), tx.cashBox.currency)}</p>
    <p>المنشئ: {tx.createdBy.name}</p><p>أنشئت: {new Date(tx.createdAt).toLocaleString("ar-SY")}</p><p>آخر تعديل: {new Date(tx.updatedAt).toLocaleString("ar-SY")}</p>
  </Card></AppShell>;
}
