import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("ar-SY", { style: "currency", currency, maximumFractionDigits: currency === "SYP" ? 0 : 2 }).format(amount);

export const toNumber = (value: unknown) => Number(value ?? 0);
