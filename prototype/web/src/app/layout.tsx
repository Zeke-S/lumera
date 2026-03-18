import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumera 前端原型（Next 版）",
  description: "Next.js + Tailwind +（逐步引入）shadcn/ui 的原型工程",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

