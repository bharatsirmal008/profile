"use client";

import React from "react";

export function Resume() {
  return (
    <div className="w-full h-full bg-white font-sans text-gray-900 overflow-y-auto relative">
      <div className="max-w-4xl mx-auto p-8 md:p-12 lg:p-16 pb-32 flex flex-col gap-14">
        
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-gray-100 pb-10">
          <h1 className="text-4xl md:text-[42px] font-bold tracking-tight text-gray-900">
            BHARAT SIRMAL
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium text-gray-500">
            <a href="mailto:sirmalbharat99@gmail.com" className="hover:text-gray-900 transition-colors">sirmalbharat99@gmail.com</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:text-gray-900 transition-colors">Portfolio</a>
            <span className="text-gray-300">•</span>
            <span className="text-gray-700">Mumbai, Maharashtra, India</span>
          </div>
        </header>

        {/* Education */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Education</h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">B.Tech in Computer Science</h3>
                <p className="text-[15px] font-medium text-gray-600">Pillai College of Engineering, Panvel</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[15px] font-medium text-gray-500">2023 – 2027</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">CGPA: 8.74 / 10.0</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Class 12 (Higher Secondary)</h3>
                <p className="text-[15px] font-medium text-gray-600">KMC Balkumari, Lalitpur, Nepal</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[15px] font-medium text-gray-500">2020 – 2022</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">GPA: 3.14 / 4.0</p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-1">Programming Languages</span>
              <span className="text-[15px] font-medium text-gray-800">Python, JavaScript, C++, SQL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-1">Data & Databases</span>
              <span className="text-[15px] font-medium text-gray-800">MongoDB, MySQL, SQL querying</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-1">Productivity & Tools</span>
              <span className="text-[15px] font-medium text-gray-800">Microsoft Excel, Google Sheets, Postman, GitHub, Cloudinary</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cloud & Platforms</span>
              <span className="text-[15px] font-medium text-gray-800">Google Cloud (Data Analytics), Firebase, Vercel</span>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Projects</h2>
          <div className="flex flex-col gap-10">
            
            {/* YAOP */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">YAOP Community Platform</h3>
                <p className="text-[14px] font-medium text-gray-500 mt-1">Next.js, Express.js, MongoDB, Firebase, Cloudinary</p>
              </div>
              <ul className="space-y-2.5 text-[15px] text-gray-600 leading-relaxed list-disc list-outside ml-4">
                <li className="pl-1">Designed and managed a centralized MongoDB database, organizing structured data for events and volunteers with full accuracy and consistency across all records.</li>
                <li className="pl-1">Processed and validated donation entries with complete data integrity by implementing Firebase authentication and structured data workflows.</li>
                <li className="pl-1">Built an admin dashboard that streamlined data entry and record updates, reducing manual effort by ~40% and minimizing input errors.</li>
              </ul>
            </div>

            {/* FrameForge */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">FrameForge Gaming Platform</h3>
                <p className="text-[14px] font-medium text-gray-500 mt-1">React.js, Express.js, MongoDB, Firebase, REST APIs, Postman</p>
              </div>
              <ul className="space-y-2.5 text-[15px] text-gray-600 leading-relaxed list-disc list-outside ml-4">
                <li className="pl-1">Designed and maintained structured MongoDB schemas for users, products, and orders, ensuring clean, queryable, and consistent records.</li>
                <li className="pl-1">Engineered RESTful APIs to handle high-volume CRUD (create, read, update, delete) data operations reliably and efficiently.</li>
                <li className="pl-1">Implemented role-based data access control, enforcing strict segregation between admin and user records with zero unauthorized access.</li>
                <li className="pl-1">Conducted data validation and performance testing using Postman to verify the accuracy and integrity of all API data flows. Collaborated in a 4-member team using Git for version control and task coordination.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Internship */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Internship</h2>
          <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Web Development Internship</h3>
                <p className="text-[15px] font-medium text-gray-600 mt-0.5">InAmigos Foundation</p>
              </div>
              <div className="text-left md:text-right text-[15px] font-medium text-gray-500">
                May 2026 – Jun 2026
              </div>
            </div>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
              Assisted in developing and maintaining the organization's website using HTML, CSS, and JavaScript. Designed and implemented new features to enhance site functionality, and improved the layout and structure to make the website more visually attractive and easier to manage.
            </p>
            <p className="text-[14px] font-medium text-gray-500">
              Technology Used: HTML, CSS, JavaScript, React, Node.js, MongoDB
            </p>
          </div>
        </section>

        {/* Certifications & Achievements */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Certifications & Achievements</h2>
          <ul className="space-y-4 text-[15px] text-gray-600 leading-relaxed list-disc list-outside ml-4">
            <li className="pl-1">
              <strong className="text-gray-800 font-semibold block sm:inline">Google Cloud Data Analytics Certificate </strong> 
              <span className="hidden sm:inline text-gray-400 mx-1">—</span> 
              <span className="block sm:inline mt-1 sm:mt-0">Hands-on experience with cloud-based data pipelines, data analysis, and structured reporting tools.</span>
            </li>
            <li className="pl-1">
              <strong className="text-gray-800 font-semibold block sm:inline">Google Cloud Career Launchpad (Foundations Track) </strong> 
              <span className="hidden sm:inline text-gray-400 mx-1">—</span> 
              <span className="block sm:inline mt-1 sm:mt-0">Training in cloud computing fundamentals, data management, and analytics best practices.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
