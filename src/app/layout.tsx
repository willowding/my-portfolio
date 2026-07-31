import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

/**
 * 顶层 metadata 作英文 fallback —— 中文 page (app/page.tsx, app/about/page.tsx 等)
 * 会用自己的 metadata export 覆盖 description。
 */
export const metadata: Metadata = {
  title: "Willow Ding · Product × AI Co-pilot",
  description:
    "Willow (Shuwen) Ding — Product × AI Co-pilot, Class of 2026, Translation major. Shanghai, open to work from July 2026.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const lang: "zh" | "en" = pathname.startsWith("/en") ? "en" : "zh";

  return (
    <html lang={lang} className={cormorant.variable}>
      <head>
        {/* Noto Serif KR —— 韩文衬线。
            next/font Google 不支持 Korean subset，改走 Google Fonts CSS API 仅取韩文字符。
            仅作用于 .yt-tag-kr，体积 ~150KB woff2，页面首次出现韩文才下载。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;700&display=swap&subset=korean"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}