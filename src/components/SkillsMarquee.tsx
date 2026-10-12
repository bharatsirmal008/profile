"use client";

import React, { useState } from "react";
import { LayoutTemplate, Database, Home, X, Minus, Maximize2, TerminalSquare, ChevronRight, Layers, ChartNoAxesColumnIncreasing, Box, Search, Code2, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterReveal } from "./LetterReveal";
import { HeaderSocialLinks } from "./HeaderSocialLinks";
import { MobileAppHeader } from "./MobileAppHeader";
import styles from "./SkillsMarquee.module.css";

interface Skill {
  name: string;
  icon: string | typeof LayoutTemplate;
}
interface SkillCategory {
  id: string;
  title: string;
  icon: typeof LayoutTemplate;
  skills: Skill[];
}

const devicon = (name: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;

const skillsData: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    icon: Code2,
    skills: [
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    ],
  },
  {
    id: "frontend", title: "Frontend Development", icon: LayoutTemplate,
    skills: [
      { name: "React.js", icon: devicon("react") },
      { name: "Next.js", icon: devicon("nextjs") },
      { name: "Tailwind CSS", icon: devicon("tailwindcss") },
      { name: "Responsive Design", icon: LayoutTemplate },
      { name: "Framer Motion", icon: devicon("framermotion") },
    ],
  },
  {
    id: "backend", title: "Backend Development", icon: TerminalSquare,
    skills: [
      { name: "Node.js", icon: devicon("nodejs") },
      { name: "Express.js", icon: devicon("express") },
      { name: "FastAPI", icon: devicon("fastapi") },
      { name: "Flask", icon: devicon("flask") },
      { name: "REST APIs", icon: Box },
      { name: "Authentication", icon: TerminalSquare },
    ],
  },
  {
    id: "database", title: "Databases & Storage", icon: Database,
    skills: [
      { name: "MongoDB", icon: devicon("mongodb") },
      { name: "MySQL", icon: devicon("mysql") },
      { name: "SQLite", icon: devicon("sqlite") },
      { name: "Firebase", icon: devicon("firebase") },
      { name: "ChromaDB", icon: Database },
      { name: "Cloudinary", icon: Layers },
    ],
  },
  {
    id: "ai-data", title: "AI, Machine Learning & Data", icon: Brain,
    skills: [
      { name: "PyTorch", icon: devicon("pytorch") },
      { name: "CNN", icon: Layers },
      { name: "EfficientNet-B0", icon: Brain },
      { name: "Grad-CAM", icon: ChartNoAxesColumnIncreasing },
      { name: "Explainable AI (XAI)", icon: Brain },
      { name: "RAG", icon: Search },
      { name: "LLMs", icon: Brain },
      { name: "NumPy", icon: devicon("numpy") },
      { name: "Pandas", icon: devicon("pandas") },
      { name: "Power BI", icon: ChartNoAxesColumnIncreasing },
      { name: "Microsoft Excel", icon: LayoutTemplate },
    ],
  },
];

interface SkillsProps {
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function SkillsMarquee({ isMaximized = false, onClose, onMinimize, onMaximize }: SkillsProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const activeCategory = skillsData[activeIndex];
  const query = search.trim().toLowerCase();
  const visibleSkills = (query ? skillsData : [activeCategory]).flatMap(category =>
    category.skills.filter(skill => !query || `${skill.name} ${category.title}`.toLowerCase().includes(query))
      .map(skill => ({ ...skill, categoryTitle: category.title }))
  );

  return (
    <div className={styles.shell}>
      <MobileAppHeader title="Technical Skills" onBack={onClose} menuOpen={isMobileMenuOpen} onToggleMenu={() => setIsMobileMenuOpen(open => !open)} />
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.menuOpen : ""}`}>
        <div data-desktop-controls className={styles.controls}>
          <button aria-label="Close Skills" onClick={onClose}><X size={10} /></button>
          <button aria-label="Minimize Skills" onClick={onMinimize}><Minus size={10} /></button>
          <button aria-label={isMaximized ? "Restore Skills" : "Maximize Skills"} onClick={onMaximize}><Maximize2 size={9} /></button>
        </div>
        <h2>Technical Skills</h2>
        <nav aria-label="Skill categories">
          {skillsData.map((category, index) => (
            <button key={category.id} aria-pressed={!query && index === activeIndex} className={!query && index === activeIndex ? styles.active : ""} onClick={() => {setActiveIndex(index); setSearch(""); setIsMobileMenuOpen(false);}}>
              <category.icon size={19} /><span>{category.title}</span>{index === activeIndex && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div aria-hidden="true" className={styles.sidebarWave} />
      </aside>
      <div className={styles.contentPane}>
        <div className={styles.breadcrumbBar}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <span>User</span><span aria-hidden="true">/</span>
            <span>Skills</span><span aria-hidden="true">/</span>
            <span aria-current="page">{query ? "Search results" : activeCategory.title}</span>
          </nav>
          <div role="search" className={styles.searchField}>
            <Search size={19} aria-hidden="true" />
            <input type="search" aria-label="Search skills" placeholder="Search skills..." value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setSearch(""); }} />
            {search && <button type="button" aria-label="Clear skill search" onClick={() => setSearch("")}><X size={15} /></button>}
          </div>
          <HeaderSocialLinks />
          <button type="button" aria-label="Return to desktop" onClick={onClose}><Home size={18} /></button>
        </div>
      <main className={`${styles.main} overflow-y-auto overscroll-contain`}>
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <header className={styles.header}>
              <div className={styles.headerArt} aria-hidden="true"><i /><i /><i /><span>Crafting<br />Beautiful<br />Experiences</span></div>
              <div className={styles.headingRow}>
                <div className={styles.categoryIcon}><activeCategory.icon size={30} /></div>
                <div><h1>{query ? "Search" : activeCategory.title.split(" ")[0]} <span>{query ? "Skills" : activeCategory.title.split(" ").slice(1).join(" ")}</span></h1>{query && <p role="status">{visibleSkills.length} {visibleSkills.length === 1 ? "skill" : "skills"} found across all categories.</p>}</div>
              </div>
            </header>
            <div className={`${styles.cards} ${styles.languageGrid}`}>
              {visibleSkills.map(skill => (
                <motion.article key={`${skill.categoryTitle}-${skill.name}`} whileHover={{ y: -3 }} className={`${styles.card} ${styles.languageCard}`}>
                  <div className={styles.cardHeading}>
                    <div className={styles.skillIcon}>{typeof skill.icon === "string" ? <img src={skill.icon} alt="" loading="lazy" width={46} height={46} /> : <skill.icon size={36} aria-hidden="true" className="text-indigo-500" />}</div>
                    <div><h3><LetterReveal text={skill.name} /></h3></div>
                  </div>
                </motion.article>
              ))}
            </div>
            {query && visibleSkills.length === 0 && <p className={styles.emptySearch}>No skills match “{search.trim()}”. Try Python, React, or a different keyword.</p>}
          </motion.div>
        </AnimatePresence>
      </main>
      </div>
    </div>
  );
}

