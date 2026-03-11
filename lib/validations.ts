import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور مطلوبة")
});

export const transactionSchema = z.object({
  cashBoxId: z.string().min(1, "الصندوق مطلوب"),
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "EXPENSE"]),
  amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  transactionDate: z.string().min(1, "التاريخ مطلوب"),
  description: z.string().min(2, "الوصف مطلوب"),
  partyName: z.string().min(2, "الجهة / الشخص مطلوب"),
  referenceNumber: z.string().optional(),
  expenseCategoryId: z.string().optional(),
  notes: z.string().optional()
});

export const settingsSchema = z.object({
  systemName: z.string().min(3),
  primaryColor: z.string().min(4),
  allowOverdraft: z.boolean(),
  footerText: z.string().optional(),
  printHeader: z.string().optional(),
  usdDecimalPlaces: z.coerce.number().int().min(0).max(4),
  sypDecimalPlaces: z.coerce.number().int().min(0).max(4)
});
