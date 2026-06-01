import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden">
      {/* Background radial glows for premium feel */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.02),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.02),transparent_40%)] pointer-events-none -z-10" />

      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
