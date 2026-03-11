import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { TransactionForm } from "@/components/forms/transaction-form";

export default async function NewTransactionPage() {
  await requireAuth();
  const [cashBoxes, categories] = await Promise.all([
    prisma.cashBox.findMany({ select: { id: true, name: true, currency: true } }),
    prisma.expenseCategory.findMany({ select: { id: true, name: true } })
  ]);
  return <AppShell><Card><h2 className="mb-3 text-lg font-bold">إضافة عملية</h2><TransactionForm cashBoxes={cashBoxes} categories={categories} /></Card></AppShell>;
}
