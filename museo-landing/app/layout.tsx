import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

export const metadata: Metadata = {
  title: { default: "Museoedu — Museum Education", template: "%s — Museoedu" },
  description: "Museoedu connects museums, education, and technology through meaningful digital experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning><MotionProvider />{children}</body>
    </html>
  );
}
