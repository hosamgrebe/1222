import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { TransactionsChart } from "@/components/charts/transactions-chart";
import { requireAuth } from "@/lib/auth-guard";

export default async function DashboardPage() {
  await requireAuth();

  const [boxes, txs] = await Promise.all([
    prisma.cashBox.findMany({ include: { _count: { select: { transactions: true } } }, orderBy: { code: "asc" } }),
    prisma.transaction.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { cashBox: true } })
  ]);

  const chartData = txs
    .map((t) => ({ date: new Date(t.transactionDate).toLocaleDateString("ar-SY"), value: Number(t.amount) }))
    .reverse();

  return (
    <AppShell>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {boxes.map((box) => (
            <Card key={box.id}>
              <h3 className="font-semibold">{box.name}</h3>
              <p className="text-2xl font-bold">{formatCurrency(Number(box.currentBalance), box.currency)}</p>
              <p className="text-sm text-slate-500">عدد العمليات: {box._count.transactions}</p>
            </Card>
          ))}
        </div>
        <Card>
          <h3 className="mb-2 font-semibold">اتجاه العمليات الأخيرة</h3>
          <TransactionsChart data={chartData} />
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">آخر العمليات</h3>
          <div className="space-y-2 text-sm">
            {txs.map((tx) => (
              <div key={tx.id} className="flex justify-between rounded border p-2">
                <span>{tx.cashBox.name} - {tx.description}</span>
                <span>{formatCurrency(Number(tx.amount), tx.cashBox.currency)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
