import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { TransactionsChart } from "@/components/charts/transactions-chart";

export default async function StatisticsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  await requireAuth();
  const boxes = await prisma.cashBox.findMany({ orderBy: { code: "asc" } });
  const cashBoxId = searchParams.cashBoxId || boxes[0]?.id;
  const txs = await prisma.transaction.findMany({ where: { cashBoxId }, include: { expenseCategory: true }, orderBy: { transactionDate: "asc" } });

  const summary = txs.reduce((acc, tx) => {
    acc.count += 1;
    if (tx.type === "DEPOSIT") acc.deposit += Number(tx.amount);
    if (tx.type === "WITHDRAWAL") acc.withdrawal += Number(tx.amount);
    if (tx.type === "EXPENSE") acc.expense += Number(tx.amount);
    return acc;
  }, { deposit: 0, withdrawal: 0, expense: 0, count: 0 });

  const topExpenseType = Object.entries(
    txs.filter((t) => t.type === "EXPENSE").reduce((m: Record<string, number>, t) => {
      const key = t.expenseCategory?.name || "غير مصنف";
      m[key] = (m[key] || 0) + 1;
      return m;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const chartData = txs.map((t) => ({ date: new Date(t.transactionDate).toLocaleDateString("ar-SY"), value: Number(t.amount) }));

  return (
    <AppShell>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">الإحصائيات</h2>
        <Card><form><Select name="cashBoxId" defaultValue={cashBoxId}>{boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></form></Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Card>إجمالي الإيداع: {summary.deposit}</Card>
          <Card>إجمالي السحب: {summary.withdrawal}</Card>
          <Card>إجمالي المصروفات: {summary.expense}</Card>
          <Card>عدد العمليات: {summary.count}</Card>
        </div>
        <Card>أكثر نوع مصروف تكرارًا: {topExpenseType}</Card>
        <Card><TransactionsChart data={chartData} /></Card>
      </div>
    </AppShell>
  );
}
