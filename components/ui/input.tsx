import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500", props.className)} {...props} />;
}
