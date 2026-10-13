import { AssistantWindowControls } from "@/components/AssistantWindowControls";
import { JoJoWordmark } from "@/components/JoJoWordmark";
import { Assistant } from "@/components/Assistant";
import { HeaderSocialLinks } from "@/components/HeaderSocialLinks";

export default function AssistantPage() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#06120d]">
      <header className="relative flex h-12 shrink-0 items-center justify-between border-b border-emerald-300/10 px-5"><AssistantWindowControls /><JoJoWordmark className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-emerald-100" /><div className="ml-auto"><HeaderSocialLinks dark /></div></header>
      <div className="min-h-0 flex-1"><Assistant /></div>
    </main>
  );
}
