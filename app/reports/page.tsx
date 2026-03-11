import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  await requireAuth();
  const boxes = await prisma.cashBox.findMany({ orderBy: { code: "asc" } });
  const cashBoxId = searchParams.cashBoxId || boxes[0]?.id;
  const from = searchParams.from || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10);
  const to = searchParams.to || new Date().toISOString().slice(0, 10);
  const type = searchParams.type || "";

  const box = boxes.find((b) => b.id === cashBoxId);
  const where: any = { cashBoxId, transactionDate: { gte: new Date(from), lte: new Date(to) } };
  if (type) where.type = type;

  const txs = cashBoxId ? await prisma.transaction.findMany({ where, orderBy: { transactionDate: "desc" } }) : [];
  const deposits = txs.filter((t) => t.type === "DEPOSIT").reduce((s, t) => s + Number(t.amount), 0);
  const withdrawals = txs.filter((t) => t.type === "WITHDRAWAL").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <AppShell>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">الكشوفات</h2>
        <Card>
          <form className="grid gap-2 md:grid-cols-5">
            <Select name="cashBoxId" defaultValue={cashBoxId}>{boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
            <Input type="date" name="from" defaultValue={from} />
            <Input type="date" name="to" defaultValue={to} />
            <Select name="type" defaultValue={type}><option value="">الكل</option><option value="DEPOSIT">إيداع</option><option value="WITHDRAWAL">سحب</option><option value="EXPENSE">مصروف</option></Select>
            <button className="rounded bg-sky-600 px-3 py-2 text-white">عرض الكشف</button>
          </form>
        </Card>
        <Card>
          <div className="mb-3 flex flex-wrap gap-3 text-sm">
            <span>إجمالي الإيداعات: {formatCurrency(deposits, box?.currency || "USD")}</span>
            <span>إجمالي السحوبات: {formatCurrency(withdrawals, box?.currency || "USD")}</span>
            <span>إجمالي المصروفات: {formatCurrency(expenses, box?.currency || "USD")}</span>
            <a className="text-sky-700" href={`/api/exports/excel?cashBoxId=${cashBoxId}&from=${from}&to=${to}&type=${type}`}>تصدير Excel</a>
            <a className="text-sky-700" href={`/api/exports/pdf?cashBoxId=${cashBoxId}&from=${from}&to=${to}&type=${type}`}>تصدير PDF</a>
          </div>
          <table className="min-w-full text-sm"><thead><tr className="border-b"><th>#</th><th>النوع</th><th>المبلغ</th><th>التاريخ</th><th>الوصف</th><th>الجهة</th><th>الرصيد بعد</th></tr></thead><tbody>{txs.map((t, i) => <tr key={t.id} className="border-b"><td>{i+1}</td><td>{t.type}</td><td>{formatCurrency(Number(t.amount), box?.currency || "USD")}</td><td>{new Date(t.transactionDate).toLocaleDateString("ar-SY")}</td><td>{t.description}</td><td>{t.partyName}</td><td>{formatCurrency(Number(t.balanceAfter), box?.currency || "USD")}</td></tr>)}</tbody></table>
        </Card>
      </div>
    </AppShell>
  );
}
