import type { Metadata } from "next";
import { GeneratorHeader } from "@/components/layout/generator-header";

export const metadata: Metadata = {
  title: "Nouveau site — SiteForge",
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <GeneratorHeader />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
