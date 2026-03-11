import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateSettings } from "@/actions/settings";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

export default async function SettingsPage() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  return (
    <AppShell>
      <Card>
        <h2 className="mb-4 text-xl font-bold">الإعدادات</h2>
        <form action={updateSettings} className="grid gap-3 md:grid-cols-2">
          <div><label>اسم النظام</label><Input name="systemName" defaultValue={settings?.systemName} /></div>
          <div><label>اللون الرئيسي</label><Input name="primaryColor" defaultValue={settings?.primaryColor} /></div>
          <div><label>منازل عشرية USD</label><Input name="usdDecimalPlaces" type="number" defaultValue={settings?.usdDecimalPlaces} /></div>
          <div><label>منازل عشرية SYP</label><Input name="sypDecimalPlaces" type="number" defaultValue={settings?.sypDecimalPlaces} /></div>
          <div><label>ترويسة الطباعة</label><Input name="printHeader" defaultValue={settings?.printHeader ?? ""} /></div>
          <div><label>تذييل الكشوف</label><Input name="footerText" defaultValue={settings?.footerText ?? ""} /></div>
          <label className="md:col-span-2"><input name="allowOverdraft" type="checkbox" defaultChecked={settings?.allowOverdraft} /> السماح بالسحب فوق الرصيد</label>
          <button className="rounded bg-sky-600 px-3 py-2 text-white md:col-span-2">حفظ</button>
        </form>
      </Card>
    </AppShell>
  );
}
