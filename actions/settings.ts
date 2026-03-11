"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations";

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("غير مصرح");

  const parsed = settingsSchema.parse({
    ...Object.fromEntries(formData.entries()),
    allowOverdraft: formData.get("allowOverdraft") === "on"
  });

  await prisma.setting.upsert({
    where: { id: "default" },
    update: parsed,
    create: { id: "default", ...parsed }
  });

  revalidatePath("/settings");
}
