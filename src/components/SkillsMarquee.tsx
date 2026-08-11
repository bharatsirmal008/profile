"use client";

import React, { useState } from "react";
import { LayoutTemplate, Database, Home, Menu, X, Minus, Maximize2, TerminalSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const skillsData = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: LayoutTemplate,
    description: "Building responsive and interactive user interfaces.",
    skills: [
      { 
        name: "NEXT.JS", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
        description: "A React framework that enables server-side rendering and static site generation for optimized web applications.",
        usage: "Used for building highly performant, SEO-friendly websites with complex routing and data fetching needs.",
        examples: ["Netflix Jobs", "TikTok Website", "Twitch"]
      },
      { 
        name: "REACT", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
        description: "A JavaScript library for building component-based user interfaces.",
        usage: "Used to create interactive single-page applications (SPAs) where data changes dynamically without reloading.",
        examples: ["Facebook", "Instagram", "Airbnb"]
      },
      { 
        name: "JAVASCRIPT", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        description: "The core programming language of the web that adds interactivity and dynamic behavior to websites.",
        usage: "Used everywhere on the web for animations, handling user inputs, API calls, and full-stack development.",
        examples: ["Google Maps", "Gmail", "YouTube"]
      },
      { 
        name: "TAILWIND", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
        description: "A utility-first CSS framework for rapidly building custom UI designs directly in markup.",
        usage: "Used to style websites quickly without writing custom CSS files, ensuring consistent design systems.",
        examples: ["ChatGPT UI", "Shopify", "The Verge"]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: TerminalSquare,
    description: "Developing robust server-side applications and APIs.",
    skills: [
      { 
        name: "PYTHON", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        description: "A versatile, high-level programming language known for its readability and massive ecosystem.",
        usage: "Used for web backend (Django/Flask), artificial intelligence, data science, and automation scripts.",
        examples: ["Spotify (Backend)", "Instagram (Django)", "Uber (AI/ML)"]
      },
      { 
        name: "JAVA", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        description: "A robust, object-oriented programming language designed to have as few implementation dependencies as possible.",
        usage: "Used for enterprise-level applications, Android app development, and large-scale banking systems.",
        examples: ["Android OS Apps", "Minecraft", "LinkedIn (Backend)"]
      },
      { 
        name: "C++", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        description: "A high-performance language that gives developers high control over system resources and memory.",
        usage: "Used for game development, real-time systems, operating systems, and high-frequency trading.",
        examples: ["Unreal Engine Games", "Adobe Photoshop", "Google Chrome (Engine)"]
      },
      { 
        name: "EXPRESS.JS", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
        description: "A minimal and flexible Node.js web application framework.",
        usage: "Used to build fast, scalable RESTful APIs and backend services using JavaScript.",
        examples: ["Twitter (Mobile API)", "Uber (Backend)", "Accenture"]
      }
    ]
  },
  {
    id: "database",
    title: "Databases & Tools",
    icon: Database,
    description: "Managing data and cloud infrastructure efficiently.",
    skills: [
      { 
        name: "MONGODB", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
        description: "A NoSQL, document-oriented database program that uses JSON-like documents.",
        usage: "Used for handling large volumes of unstructured data and fast-paced agile development.",
        examples: ["Forbes", "Toyota", "EA Games"]
      },
      { 
        name: "POSTGRESQL", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
        description: "A powerful, open-source object-relational database system known for reliability.",
        usage: "Used for complex queries, data warehousing, and applications requiring strict data integrity.",
        examples: ["Apple", "Reddit", "Spotify"]
      },
      { 
        name: "FIREBASE", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
        description: "A platform by Google providing backend-as-a-service (BaaS) features.",
        usage: "Used for real-time databases, authentication, hosting, and push notifications in apps.",
        examples: ["Duolingo", "The New York Times", "Alibaba"]
      },
      { 
        name: "GIT", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
        description: "A distributed version control system for tracking changes in source code.",
        usage: "Used by teams to collaborate on code, manage versions, and prevent code conflicts.",
        examples: ["GitHub", "GitLab", "Bitbucket"]
      }
    ]
  }
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
  
  const activeCategory = skillsData[activeIndex];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white font-sans text-gray-900 overflow-hidden relative">
      
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 -ml-1.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
          <span className="font-semibold text-gray-900">Technical Skills</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        absolute md:relative z-10 w-full md:w-80 h-[calc(100%-60px)] md:h-full bg-white border-r border-gray-100 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Window Controls */}
        <div className="hidden md:flex h-12 items-center px-4 gap-2 shrink-0 group cursor-grab">
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-sm border border-[#e0443e] flex items-center justify-center transition-colors" 
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            >
              <X className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer shadow-sm border border-[#dea123] flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            >
              <Minus className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer shadow-sm border border-[#1aab29] flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            >
              <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>

        <div className="p-6 md:p-8 md:pt-4">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-6 px-3">
            Technical Skills
          </h2>
          <nav className="flex flex-col gap-1">
            {skillsData.map((category, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all text-left
                    ${isActive 
                      ? 'bg-[#f5f5f5] text-gray-900' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <category.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="line-clamp-2 leading-tight">{category.title}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        
        {/* Top Breadcrumb Bar */}
        <div className="h-12 shrink-0 border-b border-gray-100 flex items-center justify-between px-8 md:px-12 bg-white cursor-grab">
          <div className="flex items-center gap-2 text-[15px] font-medium text-gray-400">
            <span>User</span>
            <span className="text-gray-300">/</span>
            <span>Skills</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{activeCategory.title}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 md:py-16 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              
              {/* Header: Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl md:text-[38px] leading-tight font-semibold text-gray-900 tracking-tight flex items-center gap-3">
                  <activeCategory.icon className="w-8 h-8 text-gray-700" />
                  {activeCategory.title}
                </h1>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-3 mb-12">
                <div className="flex items-center gap-2 text-[17px] text-gray-500">
                  {activeCategory.description}
                </div>
              </div>

              {/* List of Skills */}
              <div className={`grid gap-6 ${isMaximized ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                {activeCategory.skills.map((skill, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="flex flex-col sm:flex-row items-start p-6 bg-gray-50 border border-gray-100 rounded-2xl gap-6 group transition-all hover:bg-gray-100/50 hover:shadow-sm"
                  >
                    <div className="w-20 h-20 shrink-0 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center">
                      <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain filter drop-shadow-sm transition-all" />
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {skill.name}
                      </h3>
                      
                      <div className="space-y-4 mt-2">
                        <div>
                          <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400 block mb-1">What it is</span>
                          <p className="text-[15px] text-gray-700 leading-relaxed">{skill.description}</p>
                        </div>
                        
                        <div>
                          <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400 block mb-1">How & Where it's used</span>
                          <p className="text-[15px] text-gray-700 leading-relaxed">{skill.usage}</p>
                        </div>

                        <div>
                          <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Real-Life Examples</span>
                          <div className="flex flex-wrap gap-2">
                            {skill.examples.map((ex, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-[13px] font-medium rounded-full shadow-sm">
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
