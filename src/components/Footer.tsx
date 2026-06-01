"use client";

import React from "react";
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Github, 
  Sparkle 
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "https://www.facebook.com/er.bharat.sirmal" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/imbharatsirmal" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/bharat-sirmal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" },
    { icon: <Github size={20} />, href: "https://github.com/bharatsirmal008" },
  ];

  return (
    <div className="w-full bg-background pt-16 pb-6 px-6 md:px-12 lg:px-24 border-t border-border/50 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Row: Logo and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer transition-colors duration-300">
            <div className="p-1 px-1.5 rounded-full border border-border/50 flex items-center justify-center bg-white group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <Sparkle className="w-4 h-4 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">BHARAT.</span>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Row: Navigation Links */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-muted font-bold hover:text-primary transition-colors duration-300 tracking-tight"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Bottom Row: Copyright and Credits */}
        <div className="pt-8 border-t border-border/50 flex justify-center items-center w-full">
          <div className="text-muted text-sm font-medium tracking-tight text-center">
            © 2026 Bharat Sirmal
          </div>
        </div>
      </div>
    </div>
  );
}
