"use client";

import { useRouter } from "next/navigation";

export function DeleteTransactionButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className="text-red-600"
      onClick={async () => {
        if (!confirm("تأكيد حذف العملية؟")) return;
        const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
      }}
    >
      حذف
    </button>
  );
}
