"use client";

import { ChevronLeft, Menu, X } from "lucide-react";

interface MobileAppHeaderProps {
  title: string;
  onBack?: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function MobileAppHeader({ title, onBack, menuOpen, onToggleMenu }: MobileAppHeaderProps) {
  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 text-gray-900 md:hidden">
      <button type="button" aria-label="Back to desktop" onClick={onBack} className="flex min-h-11 shrink-0 items-center gap-1 px-1 text-sm">
        <ChevronLeft size={22} aria-hidden="true" />
        Back
      </button>
      <button type="button" aria-label={`Toggle ${title.toLowerCase()} menu`} aria-expanded={menuOpen} onClick={onToggleMenu} className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-lg text-gray-600 hover:bg-gray-100">
        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
      <span className="truncate text-sm font-medium">{title}</span>
    </header>
  );
}
