import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";
import { recalculateCashBox } from "@/lib/transactions";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = transactionSchema.parse(body);

  const existing = await prisma.transaction.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...parsed,
      transactionDate: new Date(parsed.transactionDate),
      referenceNumber: parsed.referenceNumber || null,
      expenseCategoryId: parsed.expenseCategoryId || null,
      notes: parsed.notes || null
    }
  });

  await recalculateCashBox(existing.cashBoxId);
  if (existing.cashBoxId !== parsed.cashBoxId) await recalculateCashBox(parsed.cashBoxId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const tx = await prisma.transaction.delete({ where: { id: params.id } });
  await recalculateCashBox(tx.cashBoxId);
  return NextResponse.json({ ok: true });
}
