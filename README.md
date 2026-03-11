# نظام إدارة الصناديق المالية (USD/SYP)

نظام ويب احترافي مبني بـ **Next.js App Router + TypeScript + Tailwind + Prisma + PostgreSQL** لإدارة صندوقين مستقلين تمامًا:
- صندوق الدولار (USD)
- صندوق الليرة السورية (SYP)

## الميزات الرئيسية (MVP قوي)
- مصادقة احترافية عبر Auth.js (NextAuth v5 Credentials)
- صلاحيات: Admin / User
- Dashboard عربية RTL مع بطاقات وإحصائيات ومخططات
- إدارة الصناديق (عرض الصندوقين seeded)
- CRUD كامل للعمليات المالية (إيداع / سحب / مصروف)
- فلترة + بحث + ترتيب في سجل العمليات
- صفحة تفاصيل عملية
- الكشوفات حسب الفترة والصندوق والنوع
- تصدير Excel + PDF
- إعدادات النظام الأساسية
- منطق محاسبي واضح مع إعادة احتساب رصيد الصندوق بعد التعديل/الحذف

---

## التقنيات
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth/Auth.js
- React Hook Form + Zod
- Recharts
- XLSX + jsPDF + jspdf-autotable

---

## هيكل المشروع

```bash
app/
  api/
  cash-boxes/
  dashboard/
  login/
  reports/
  settings/
  statistics/
  transactions/
components/
  charts/
  forms/
  layout/
  ui/
lib/
  auth-guard.ts
  prisma.ts
  transactions.ts
  utils.ts
  validations.ts
actions/
prisma/
  schema.prisma
  seed.ts
types/
auth.ts
middleware.ts
```

---

## إعداد وتشغيل المشروع محليًا

## 1) المتطلبات
- Node.js 20+
- PostgreSQL 14+

## 2) التثبيت
```bash
npm install
```

## 3) إعداد البيئة
```bash
cp .env.example .env
```
ثم عدّل `DATABASE_URL` و `AUTH_SECRET`.

## 4) Prisma migration
```bash
npx prisma migrate dev --name init
```

## 5) توليد Prisma Client
```bash
npx prisma generate
```

## 6) Seed البيانات الأساسية
```bash
npm run prisma:seed
```

## 7) تشغيل المشروع
```bash
npm run dev
```

---

## بيانات الدخول التجريبية
- مدير:
  - البريد: `admin@cashboxes.local`
  - كلمة المرور: `Admin@123`
- مستخدم عادي:
  - البريد: `user@cashboxes.local`
  - كلمة المرور: `User@123`

---

## قواعد النظام المحاسبية
- كل عملية ترتبط بصندوق واحد فقط.
- لا يوجد تحويل عملات في النسخة الأولى.
- لا يوجد خلط بين USD و SYP.
- معادلة الرصيد للصندوق:
  - `current_balance = deposits - withdrawals - expenses`
- عند تعديل/حذف أي عملية:
  - يتم تنفيذ `recalculateCashBox` لإعادة احتساب تسلسل `balance_after` ثم الرصيد النهائي للصندوق نفسه فقط.

---

## كيف أضيف صندوق جديد لاحقًا؟
1. أضف سجل جديد في جدول `cash_boxes` عبر Prisma Studio أو migration.
2. اعرضه في صفحات الاختيار (forms/reports/statistics).
3. أضف إعدادات تنسيق عملته في صفحة settings إن لزم.

---

## كيف أعدل النصوص أو الألوان؟
- النصوص: ملفات `app/` و `components/`.
- الألوان الأساسية: `app/globals.css` + `tailwind.config.ts` + إعداد `primaryColor` من settings.

---

## النشر (Production)
1. جهّز PostgreSQL production.
2. اضبط متغيرات البيئة (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`).
3. نفّذ:
```bash
npm ci
npm run build
npm start
```
4. شغّل migration على بيئة الإنتاج:
```bash
npx prisma migrate deploy
```

---

## اقتراحات تطوير مستقبلية
- سجل تدقيق متقدم (Audit viewer) مع فلاتر وdiff.
- إدارة مستخدمين كاملة من الواجهة.
- دعم التقارير المحاسبية الدورية والميزانيات.
- دعم Multi-tenant.
- دعم ثيمات كاملة وتخصيصات UI أوسع.
- تصدير PDF بخط عربي مضمّن وRTL متقدم.
