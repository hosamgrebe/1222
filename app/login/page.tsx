import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">تسجيل الدخول</h2>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/dashboard"
            });
          }}
          className="space-y-3"
        >
          <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
          <Input name="password" type="password" placeholder="كلمة المرور" required />
          <Button type="submit" className="w-full">
            دخول
          </Button>
        </form>
        <p className="text-xs text-slate-500">admin@cashboxes.local / Admin@123</p>
      </Card>
    </div>
  );
}
