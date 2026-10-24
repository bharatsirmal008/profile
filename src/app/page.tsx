import type { Metadata } from "next";
import { Hero } from "@/components/desktop/Hero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const profile = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bharatsirmal.vercel.app/#person",
      name: "Bharat Sirmal",
      url: "https://bharatsirmal.vercel.app/",
      image: "https://bharatsirmal.vercel.app/profile_image.png",
      description: "Computer Science student and full-stack developer building web applications and AI projects.",
      sameAs: [
        "https://www.linkedin.com/in/bharat-sirmal/",
        "https://github.com/bharatsirmal008",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://bharatsirmal.vercel.app/#website",
      name: "Bharat Sirmal",
      alternateName: ["Bharat Sirmal Portfolio", "bharatsirmal.vercel.app"],
      inLanguage: "en",
      url: "https://bharatsirmal.vercel.app/",
      author: { "@id": "https://bharatsirmal.vercel.app/#person" },
      publisher: { "@id": "https://bharatsirmal.vercel.app/#person" },
    },
  ],
};

export default function Home() {
  return (
    <main className="portfolio-desktop fixed inset-0 h-dvh w-full overflow-hidden overscroll-none bg-black text-foreground selection:bg-red-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, "\\u003c") }}
      />
      <noscript>
        <section className="absolute inset-0 z-50 overflow-auto bg-black p-8 text-white">
          <h1 className="text-3xl font-bold">Bharat Sirmal</h1>
          <p className="mt-4">Computer Science student and full-stack developer working with React, Next.js, Node.js, Python and MongoDB.</p>
          <p className="mt-4">Explore my projects, skills, education and resume by enabling JavaScript for the interactive portfolio.</p>
          <a className="mt-4 inline-block underline" href="https://github.com/bharatsirmal008">View Bharat Sirmal&apos;s projects on GitHub</a>
        </section>
      </noscript>
      <Hero />
    </main>
  );
}
