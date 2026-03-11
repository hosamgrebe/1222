import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const cashBoxId = searchParams.get("cashBoxId") || "";
  const from = searchParams.get("from") || "1970-01-01";
  const to = searchParams.get("to") || new Date().toISOString().slice(0, 10);
  const type = searchParams.get("type") || undefined;

  const txs = await prisma.transaction.findMany({ where: { cashBoxId, transactionDate: { gte: new Date(from), lte: new Date(to) }, ...(type ? { type: type as any } : {}) }, include: { cashBox: true } });

  const rows = txs.map((t) => ({
    "الصندوق": t.cashBox.name,
    "العملة": t.cashBox.currency,
    "النوع": t.type,
    "المبلغ": Number(t.amount),
    "التاريخ": t.transactionDate.toISOString().slice(0, 10),
    "الوصف": t.description,
    "الجهة": t.partyName,
    "الرصيد بعد": Number(t.balanceAfter)
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buffer, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=report.xlsx" } });
}
