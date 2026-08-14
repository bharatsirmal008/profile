"use client";

import React, { useRef } from "react";
import { Download } from "lucide-react";
import { LetterReveal } from "./LetterReveal";
import { useReactToPrint } from "react-to-print";

export function Resume() {
  const contentRef = useRef<HTMLDivElement>(null);
  const handleDownloadPDF = useReactToPrint({ 
    contentRef,
    documentTitle: "Bharat_Sirmal_Resume",
    pageStyle: "@page { size: auto; margin: 10mm; } @media print { html, body { font-family: 'Times New Roman', Times, serif; font-size: 14px !important; color: black !important; zoom: 0.9; } }"
  });

  return (
    <div className="w-full h-full bg-white text-black overflow-y-auto relative" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div ref={contentRef} className="max-w-4xl mx-auto p-8 md:p-12 lg:p-16 pb-32 print:p-0 flex flex-col gap-6 print:gap-3 relative bg-white leading-relaxed">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center relative mb-2 print:mb-0">
          <button 
            onClick={() => handleDownloadPDF()}
            className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-sans text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm print:hidden"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
          
          <h1 className="text-3xl md:text-4xl print:text-2xl font-bold tracking-tight text-center uppercase mb-3">
            <LetterReveal text="BHARAT SIRMAL" />
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-1.5 text-[14px] font-medium">
            <a href="mailto:sirmalbharat99@gmail.com" className="hover:underline">
              sirmalbharat99@gmail.com
            </a>
            <span>|</span>
            <a href="https://www.linkedin.com/in/bharat-sirmal/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Linkedin
            </a>
            <span>|</span>
            <a href="https://github.com/bharatsirmal008" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Github
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Portfolio-Bharat Sirmal
            </a>
            <span>|</span>
            <span>
              Mumbai, Maharashtra, India
            </span>
          </div>
        </header>

        {/* Education */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 print:mb-2 border-b-2 border-black pb-1">
            <LetterReveal text="EDUCATION" />
          </h2>
          <div className="flex flex-col gap-4 print:gap-1 text-[14px]">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <strong>B.Tech in Computer Science</strong>
                  <span className="mx-1">—</span>
                  <span>Pillai College of Engineering, Panvel</span>
                </div>
                <div className="italic shrink-0 ml-4">
                  2023 – 2027
                </div>
              </div>
              <div className="mt-0.5">
                CGPA: 8.74 / 10.0
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <strong>Class 12 (Higher Secondary)</strong>
                  <span className="mx-1">—</span>
                  <span>KMC Balkumari, Lalitpur Nepal</span>
                </div>
                <div className="italic shrink-0 ml-4">
                  2020 – 2022
                </div>
              </div>
              <div className="mt-0.5">
                GPA: 3.14 / 4.0
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 print:mb-2 border-b-2 border-black pb-1">
            <LetterReveal text="SKILLS" />
          </h2>
          <div className="flex flex-col gap-1 print:gap-0.5 text-[14px]">
            <div>
              <strong>Programming Languages:</strong>
              <span className="ml-1">Python, JavaScript,C++, SQL</span>
            </div>
            <div>
              <strong>Data & Databases:</strong>
              <span className="ml-1">MongoDB, MySQL, SQL querying</span>
            </div>
            <div>
              <strong>Productivity & Tools:</strong>
              <span className="ml-1">Microsoft Excel, Google Sheets, Postman, GitHub, Cloudinary</span>
            </div>
            <div>
              <strong>Cloud & Platforms:</strong>
              <span className="ml-1">Google Cloud (Data Analytics), Firebase, Vercel</span>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 print:mb-2 border-b-2 border-black pb-1">
            <LetterReveal text="PROJECTS" />
          </h2>
          <div className="flex flex-col gap-5 print:gap-2 text-[14px]">
            
            {/* YAOP */}
            <div>
              <strong className="block mb-1">
                YAOP Community Platform
              </strong>
              <ul className="list-disc ml-5 space-y-1">
                <li className="pl-1">
                  Designed and managed a centralized MongoDB database, organizing structured data for events and volunteers with full accuracy and consistency across all records.
                </li>
                <li className="pl-1">
                  Processed and validated donation entries with complete data integrity by implementing Firebase authentication and structured data workflows.
                </li>
                <li className="pl-1">
                  Built an admin dashboard that streamlined data entry and record updates, reducing manual effort by ~40% and minimizing input errors.
                </li>
                <li className="pl-1">
                  Technologies: Next.js, Express.js, MongoDB, Firebase, Cloudinary
                </li>
              </ul>
            </div>

            {/* FrameForge */}
            <div>
              <strong className="block mb-1">
                FrameForge Gaming Platform
              </strong>
              <ul className="list-disc ml-5 space-y-1">
                <li className="pl-1">
                  Designed and maintained structured MongoDB schemas for users, products, and orders, ensuring clean, queryable, and consistent records.
                </li>
                <li className="pl-1">
                  Engineered RESTful APIs to handle high-volume CRUD (create, read, update, delete) data operations reliably and efficiently.
                </li>
                <li className="pl-1">
                  Implemented role-based data access control, enforcing strict segregation between admin and user records with zero unauthorized access.
                </li>
                <li className="pl-1">
                  Conducted data validation and performance testing using Postman to verify the accuracy and integrity of all API data flows.Collaborated in a 4-member team using Git for version control and task coordination.
                </li>
                <li className="pl-1">
                  Technologies: React.js, Express.js, MongoDB, Firebase, REST APIs, Postman
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Internship */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 print:mb-2 border-b-2 border-black pb-1">
            <LetterReveal text="INTERNSHIP" />
          </h2>
          <div className="text-[14px]">
            <div className="mb-1">
              <strong>Web Development Internship</strong>
              <span className="mx-1">|</span>
              <span>May 2026 – Jun 2026</span>
            </div>
            <div className="mb-1">
              Company Name: InAmigos Foundation
            </div>
            <p className="mb-1">
              Assisted in developing and maintaining the organization's website using HTML, CSS, and JavaScript. Designed and implemented new features to enhance site functionality, and improved the layout and structure to make the website more visually attractive and easier to manage.
            </p>
            <div>
              Technology Used: HTML, CSS, JavaScript,React, Node.js, MongoDB
            </div>
          </div>
        </section>

        {/* Certifications & Achievements */}
        <section>
          <h2 className="text-lg font-bold uppercase mb-3 print:mb-2 border-b-2 border-black pb-1">
            <LetterReveal text="CERTIFICATIONS & ACHIEVEMENTS" />
          </h2>
          <ul className="list-disc ml-5 space-y-2 print:space-y-0.5 text-[14px]">
            <li className="pl-1">
              <strong>Google Cloud Data Analytics Certificate</strong>
              <span className="mx-1">—</span>
              <span>Hands-on experience with cloud-based data pipelines, data analysis, and structured reporting tools.</span>
            </li>
            <li className="pl-1">
              <strong>Google Cloud Career Launchpad (Foundations Track)</strong>
              <span className="mx-1">—</span>
              <span>Training in cloud computing fundamentals, data management, and analytics best practices.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
