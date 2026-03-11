import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { formatCurrency } from "@/lib/utils";
import { DeleteTransactionButton } from "@/components/forms/delete-transaction-button";

export default async function TransactionsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await requireAuth();
  const cashBoxes = await prisma.cashBox.findMany({ orderBy: { code: "asc" } });

  const where: any = {};
  if (searchParams.cashBoxId) where.cashBoxId = searchParams.cashBoxId;
  if (searchParams.type) where.type = searchParams.type;
  if (searchParams.q) where.OR = [{ description: { contains: searchParams.q, mode: "insensitive" } }, { partyName: { contains: searchParams.q, mode: "insensitive" } }];

  const txs = await prisma.transaction.findMany({
    where,
    include: { cashBox: true, createdBy: true },
    orderBy: { transactionDate: searchParams.order === "asc" ? "asc" : "desc" }
  });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">سجل العمليات</h2>
          <Link href="/transactions/new" className="rounded bg-sky-600 px-3 py-2 text-white">عملية جديدة</Link>
        </div>
        <Card>
          <form className="grid gap-2 md:grid-cols-4">
            <Input name="q" placeholder="بحث" defaultValue={searchParams.q} />
            <Select name="cashBoxId" defaultValue={searchParams.cashBoxId}><option value="">كل الصناديق</option>{cashBoxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
            <Select name="type" defaultValue={searchParams.type}><option value="">كل الأنواع</option><option value="DEPOSIT">إيداع</option><option value="WITHDRAWAL">سحب</option><option value="EXPENSE">مصروف</option></Select>
            <Select name="order" defaultValue={searchParams.order ?? "desc"}><option value="desc">الأحدث</option><option value="asc">الأقدم</option></Select>
          </form>
        </Card>
        <Card className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b"><th>#</th><th>الصندوق</th><th>النوع</th><th>المبلغ</th><th>التاريخ</th><th>الوصف</th><th>الجهة</th><th>الرصيد بعد</th><th>المنشئ</th><th>إجراء</th></tr></thead>
            <tbody>
              {txs.map((tx, i) => (
                <tr key={tx.id} className="border-b">
                  <td>{i + 1}</td><td>{tx.cashBox.name}</td><td>{tx.type}</td><td>{formatCurrency(Number(tx.amount), tx.cashBox.currency)}</td><td>{new Date(tx.transactionDate).toLocaleDateString("ar-SY")}</td>
                  <td>{tx.description}</td><td>{tx.partyName}</td><td>{formatCurrency(Number(tx.balanceAfter), tx.cashBox.currency)}</td><td>{tx.createdBy.name}</td>
                  <td className="space-x-2 space-x-reverse"><Link href={`/transactions/${tx.id}`}>عرض</Link> <Link href={`/transactions/${tx.id}/edit`}>تعديل</Link> {session.user.role === "ADMIN" && <DeleteTransactionButton id={tx.id} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
