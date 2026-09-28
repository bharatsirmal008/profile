"use client";

import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-foreground selection:bg-red-900 overflow-x-hidden">
      <Hero />
    </main>
  );
}
