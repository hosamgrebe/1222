import { Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const effect = (type: TransactionType, amount: number) => (type === "DEPOSIT" ? amount : -amount);

export async function recalculateCashBox(cashBoxId: string) {
  const txs = await prisma.transaction.findMany({
    where: { cashBoxId },
    orderBy: [{ transactionDate: "asc" }, { createdAt: "asc" }]
  });

  let balance = 0;
  for (const tx of txs) {
    balance += effect(tx.type, Number(tx.amount));
    await prisma.transaction.update({ where: { id: tx.id }, data: { balanceAfter: new Prisma.Decimal(balance) } });
  }

  await prisma.cashBox.update({ where: { id: cashBoxId }, data: { currentBalance: new Prisma.Decimal(balance) } });
}

export async function ensureWithdrawalAllowed(cashBoxId: string, amount: number, type: TransactionType) {
  if (type === "DEPOSIT") return;
  const [setting, box] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "default" } }),
    prisma.cashBox.findUnique({ where: { id: cashBoxId } })
  ]);
  if (!box) throw new Error("الصندوق غير موجود");
  if (!setting?.allowOverdraft && Number(box.currentBalance) < amount) {
    throw new Error("لا يمكن السحب أو المصروف فوق الرصيد الحالي");
  }
}
