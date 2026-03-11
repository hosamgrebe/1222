import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { formatCurrency } from "@/lib/utils";

export default async function CashBoxesPage() {
  await requireAuth();
  const boxes = await prisma.cashBox.findMany({ include: { _count: { select: { transactions: true } } }, orderBy: { code: "asc" } });

  return (
    <AppShell>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">إدارة الصناديق</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {boxes.map((box) => (
            <Card key={box.id}>
              <h3 className="font-semibold">{box.name}</h3>
              <p>العملة: {box.currency}</p>
              <p>الرصيد: {formatCurrency(Number(box.currentBalance), box.currency)}</p>
              <p>عدد العمليات: {box._count.transactions}</p>
              <Link href={`/transactions?cashBoxId=${box.id}`} className="mt-2 inline-block text-sky-700">
                دخول تفاصيل الصندوق
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
