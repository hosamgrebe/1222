"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";
import { ensureWithdrawalAllowed, recalculateCashBox } from "@/lib/transactions";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("غير مصرح");

  const parsed = transactionSchema.parse(Object.fromEntries(formData.entries()));
  await ensureWithdrawalAllowed(parsed.cashBoxId, parsed.amount, parsed.type);

  await prisma.transaction.create({
    data: {
      cashBoxId: parsed.cashBoxId,
      type: parsed.type,
      amount: parsed.amount,
      transactionDate: new Date(parsed.transactionDate),
      description: parsed.description,
      partyName: parsed.partyName,
      referenceNumber: parsed.referenceNumber || null,
      expenseCategoryId: parsed.expenseCategoryId || null,
      notes: parsed.notes || null,
      balanceAfter: 0,
      createdById: session.user.id
    }
  });

  await recalculateCashBox(parsed.cashBoxId);
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("غير مصرح");

  const tx = await prisma.transaction.delete({ where: { id } });
  await recalculateCashBox(tx.cashBoxId);
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
