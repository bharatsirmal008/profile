"use client";

import React, { useState } from "react";
import { GraduationCap, MapPin, Award, Home, Menu, X, Minus, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterReveal } from "./LetterReveal";

const educationData = [
  {
    id: 1,
    degree: "SEE (X)",
    institution: "Shajendra Swor Secondary School",
    year: "2020",
    level: "Secondary Education Examination",
    location: "Phulaut, Doti, Nepal",
    description: "GPA: 3.6/4.0",
    skills: ["Science", "Mathematics", "Computer Basics"],
  },
  {
    id: 2,
    degree: "+2 (XII)",
    institution: "Kathmandu Model College, Balkumari, Lalitpur",
    year: "2021 - 2022",
    level: "Higher Secondary Education",
    location: "Lalitpur, Nepal",
    description: "GPA: 3.13/4.0",
    skills: ["Physics", "Computer Science", "Advanced Math"],
  },
  {
    id: 3,
    degree: "B.Tech in Computer Science Engineering",
    institution: "Pillai College of Engineering, Mumbai, India",
    year: "2023 - 2027",
    level: "Undergraduate Degree (ongoing)",
    location: "Mumbai, India",
    description: "CGPA: 8.78/10",
    skills: ["Next.js", "React", "System Design"],
  }
];

interface EducationProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function Education({ onClose, onMinimize, onMaximize }: EducationProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeEdu = educationData[activeIndex];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white font-sans text-gray-900 overflow-hidden relative">
      
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 -ml-1.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
          <span className="font-semibold text-gray-900">
            <LetterReveal text="Education" />
          </span>
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
            <LetterReveal text="Organizations" />
          </h2>
          <nav className="flex flex-col gap-1">
            {educationData.map((edu, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={edu.id}
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
                  <GraduationCap className={`w-5 h-5 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="line-clamp-2 leading-tight mb-0.5">{edu.institution}</span>
                    <span className="text-xs text-gray-400 font-normal">{edu.year}</span>
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
            <span>Education</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{activeEdu.degree}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 md:py-16 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEdu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              
              {/* Header: Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl md:text-[38px] leading-tight font-semibold text-gray-900 tracking-tight">
                  <LetterReveal text={activeEdu.degree} />
                </h1>
              </div>

              {/* Description & Location */}
              <div className="flex flex-col gap-3 mb-12">
                <div className="flex items-center gap-2 text-[17px] font-medium text-gray-600">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  {activeEdu.institution}
                </div>
                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {activeEdu.location}
                </div>
                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                  <Award className="w-4 h-4 text-gray-400" />
                  {activeEdu.description}
                </div>
              </div>

              {/* Metadata Columns */}
              <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 mb-16">
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">
                    <LetterReveal text="Level" />
                  </h3>
                  <p className="text-[17px] font-medium text-gray-700">
                    {activeEdu.level}
                  </p>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">
                    <LetterReveal text="Year" />
                  </h3>
                  <p className="text-[17px] font-medium text-gray-700">
                    {activeEdu.year}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-[15px] font-medium text-gray-400 mb-4">
                  <LetterReveal text="Key Coursework / Skills" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeEdu.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 text-[15px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
