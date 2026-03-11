import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const cashBoxId = searchParams.get("cashBoxId") || "";
  const from = searchParams.get("from") || "1970-01-01";
  const to = searchParams.get("to") || new Date().toISOString().slice(0, 10);

  const txs = await prisma.transaction.findMany({ where: { cashBoxId, transactionDate: { gte: new Date(from), lte: new Date(to) } }, include: { cashBox: true } });

  const doc = new jsPDF();
  doc.text("كشف صندوق مالي", 14, 12);
  autoTable(doc, {
    startY: 20,
    head: [["الصندوق", "العملة", "النوع", "المبلغ", "التاريخ", "الوصف"]],
    body: txs.map((t) => [t.cashBox.name, t.cashBox.currency, t.type, Number(t.amount).toString(), t.transactionDate.toISOString().slice(0, 10), t.description])
  });

  const pdf = doc.output("arraybuffer");
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=report.pdf" } });
}
