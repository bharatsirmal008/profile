import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProfileAndExperience } from "@/components/ProfileExperience";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden">
      {/* Background radial glows for premium feel */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.03),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none -z-10" />

      <Navbar />
      <Hero />
      <ProfileAndExperience />
      <Process />
      <Projects />
      <Footer />
    </main>
  );
}
