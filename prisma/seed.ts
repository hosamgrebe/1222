import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cashboxes.local" },
    update: {},
    create: {
      email: "admin@cashboxes.local",
      name: "مدير النظام",
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: "user@cashboxes.local" },
    update: {},
    create: {
      email: "user@cashboxes.local",
      name: "مستخدم تجريبي",
      passwordHash: userPassword,
      role: UserRole.USER
    }
  });

  await prisma.cashBox.upsert({
    where: { code: "USD_BOX" },
    update: { name: "صندوق الدولار", currency: "USD", isActive: true },
    create: { name: "صندوق الدولار", code: "USD_BOX", currency: "USD" }
  });

  await prisma.cashBox.upsert({
    where: { code: "SYP_BOX" },
    update: { name: "صندوق الليرة السورية", currency: "SYP", isActive: true },
    create: { name: "صندوق الليرة السورية", code: "SYP_BOX", currency: "SYP" }
  });

  await prisma.setting.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" }
  });

  const categories = ["تشغيل", "إيجار", "رواتب", "صيانة", "خدمات"];
  for (const name of categories) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }
}

main().finally(async () => prisma.$disconnect());
