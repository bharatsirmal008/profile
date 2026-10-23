import type { Metadata } from "next";
import { AssistantWindowControls } from "@/components/assistant/AssistantWindowControls";
import { JoJoWordmark } from "@/components/ui/JoJoWordmark";
import { Assistant } from "@/components/assistant/Assistant";
import { HeaderSocialLinks } from "@/components/ui/HeaderSocialLinks";

export const metadata: Metadata = {
  title: "JOJO AI Assistant",
  description: "Ask JOJO about Bharat Sirmal's projects, skills, experience and fit for your job requirements.",
  alternates: { canonical: "/assistant" },
  openGraph: {
    type: "website",
    siteName: "Bharat Sirmal",
    images: [{ url: "/profile_image.png", alt: "Bharat Sirmal" }],
    title: "JOJO AI Assistant | Bharat Sirmal",
    description: "Ask Bharat Sirmal's personal AI assistant about his projects, skills and experience.",
    url: "https://bharatsirmal.vercel.app/assistant",
  },
};

export default function AssistantPage() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#06120d]">
      <header className="relative flex h-12 shrink-0 items-center justify-between border-b border-emerald-300/10 px-5"><AssistantWindowControls /><JoJoWordmark className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-emerald-100" /><div className="ml-auto"><HeaderSocialLinks dark /></div></header>
      <div className="min-h-0 flex-1"><Assistant /></div>
    </main>
  );
}
