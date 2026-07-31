import { redirect } from "next/navigation";

/**
 * Root `/` redirect:
 *  - If env NEXT_PUBLIC_DEFAULT_LANG === "en" → /en  (Vercel / international)
 *  - Otherwise → /zh (Aliyun / China-mainland default)
 *
 * On Vercel: set Environment Variable NEXT_PUBLIC_DEFAULT_LANG=en.
 * On Aliyun: leave it unset (or set to "zh").
 */
export default function RootPage() {
  const lang = process.env.NEXT_PUBLIC_DEFAULT_LANG === "en" ? "en" : "zh";
  redirect(`/${lang}`);
}