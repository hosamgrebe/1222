import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";
import { ensureWithdrawalAllowed, recalculateCashBox } from "@/lib/transactions";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = transactionSchema.parse(body);
  await ensureWithdrawalAllowed(parsed.cashBoxId, parsed.amount, parsed.type);
  const created = await prisma.transaction.create({
    data: {
      ...parsed,
      transactionDate: new Date(parsed.transactionDate),
      referenceNumber: parsed.referenceNumber || null,
      expenseCategoryId: parsed.expenseCategoryId || null,
      notes: parsed.notes || null,
      balanceAfter: 0,
      createdById: session.user.id
    }
  });
  await recalculateCashBox(parsed.cashBoxId);
  return NextResponse.json(created);
}
