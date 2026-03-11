import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { TransactionForm } from "@/components/forms/transaction-form";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") redirect("/transactions");

  const [tx, cashBoxes, categories] = await Promise.all([
    prisma.transaction.findUnique({ where: { id: params.id } }),
    prisma.cashBox.findMany({ select: { id: true, name: true, currency: true } }),
    prisma.expenseCategory.findMany({ select: { id: true, name: true } })
  ]);
  if (!tx) return notFound();

  return <AppShell><Card><h2 className="mb-3 text-lg font-bold">تعديل العملية</h2><TransactionForm transactionId={tx.id} cashBoxes={cashBoxes} categories={categories} initial={{
    cashBoxId: tx.cashBoxId,
    type: tx.type,
    amount: Number(tx.amount),
    transactionDate: tx.transactionDate.toISOString().slice(0, 10),
    description: tx.description,
    partyName: tx.partyName,
    referenceNumber: tx.referenceNumber ?? "",
    expenseCategoryId: tx.expenseCategoryId ?? "",
    notes: tx.notes ?? ""
  }} /></Card></AppShell>;
}
