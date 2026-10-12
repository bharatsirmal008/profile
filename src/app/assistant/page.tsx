import { Assistant } from "@/components/Assistant";
import { HeaderSocialLinks } from "@/components/HeaderSocialLinks";

export default function AssistantPage() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#06120d]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-emerald-300/10 px-5"><span className="text-sm tracking-widest text-emerald-100">JOJO</span><HeaderSocialLinks dark /></header>
      <div className="min-h-0 flex-1"><Assistant /></div>
    </main>
  );
}
