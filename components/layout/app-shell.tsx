import Link from "next/link";
import { auth, signOut } from "@/auth";

const links = [
  ["/dashboard", "لوحة التحكم"],
  ["/cash-boxes", "الصناديق"],
  ["/transactions", "العمليات"],
  ["/reports", "الكشوفات"],
  ["/statistics", "الإحصائيات"],
  ["/settings", "الإعدادات"]
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="font-bold">نظام إدارة الصناديق</h1>
          <div className="flex items-center gap-3 text-sm">
            <span>{session?.user?.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="rounded-md border px-3 py-1">تسجيل خروج</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-white p-3">
          <nav className="space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
