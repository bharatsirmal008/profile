"use client";

import { Hero } from "@/components/desktop/Hero";

export default function Home() {
  return (
    <main className="portfolio-desktop fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-black text-foreground selection:bg-red-900">
      <Hero />
    </main>
  );
}
