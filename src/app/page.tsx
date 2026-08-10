import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden">
      {/* Background radial glows for premium feel */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.02),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.02),transparent_40%)] pointer-events-none -z-10" />

      <Hero />
    </main>
  );
}
