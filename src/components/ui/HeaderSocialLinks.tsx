"use client";

import { Github, Instagram, Linkedin } from "lucide-react";

export function HeaderSocialLinks({ dark = false }: { dark?: boolean }) {
  return (
    <nav aria-label="Social profiles" onPointerDown={event => event.stopPropagation()} className={`hidden shrink-0 items-center gap-4 md:flex ${dark ? "text-emerald-100/70" : "text-gray-600"}`}>
      {[
        { label: "LinkedIn", href: "https://www.linkedin.com/in/bharat-sirmal/", icon: Linkedin },
        { label: "GitHub", href: "https://github.com/bharatsirmal008", icon: Github },
        { label: "Instagram", href: "https://www.instagram.com/bharat_sirmal008/", icon: Instagram },
      ].map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label}`} className={`rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${dark ? "hover:text-white" : "hover:text-gray-900"}`}><Icon size={16} aria-hidden="true" /></a>
      ))}
    </nav>
  );
}
