import { AdminGate } from "@/components/admin/AdminGate";
import type { Metadata } from "next";
import { Hero } from "@/components/desktop/Hero";

export const metadata: Metadata = {
  title: "Edit Resume | Bharat Sirmal",
  robots: { index: false, follow: false },
};

export default function ResumeUpdatePage() {
  return (
    <AdminGate><main className="portfolio-desktop fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-black text-foreground selection:bg-red-900">
      <Hero initialWindow="resume" resumeEditable />
    </main></AdminGate>
  );
}
