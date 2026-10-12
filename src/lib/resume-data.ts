export interface ResumeEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  details: string[];
  bullets: boolean;
}
export interface ResumeSection {
  id: string;
  title: string;
  entries: ResumeEntry[];
}
export interface ResumeData {
  name: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
  sections: ResumeSection[];
}

export const defaultResume: ResumeData = {
  name: "BHARAT SIRMAL",
  email: "sirmalbharat99@gmail.com",
  linkedin: "https://www.linkedin.com/in/bharat-sirmal/",
  github: "https://github.com/bharatsirmal008",
  portfolio: "https://bharatsirmal.vercel.app/",
  location: "Mumbai, Maharashtra, India",
  sections: [
    { id: "education", title: "EDUCATION", entries: [
      { id: "degree", title: "B.Tech in Computer Science", subtitle: "Pillai College of Engineering, Panvel", date: "2023 – 2027", details: ["CGPA: 8.74 / 10.0"], bullets: false },
      { id: "school", title: "Class 12 (Higher Secondary)", subtitle: "KMC Balkumari, Lalitpur Nepal", date: "2020 – 2022", details: ["GPA: 3.14 / 4.0"], bullets: false },
    ] },
    { id: "skills", title: "SKILLS", entries: [
      { id: "languages", title: "Languages", subtitle: "", date: "", details: ["Python, C/C++, JavaScript, TypeScript, SQL"], bullets: false },
      { id: "databases", title: "Data & Databases", subtitle: "", date: "", details: ["MongoDB, MySQL, SQL querying"], bullets: false },
      { id: "tools", title: "Productivity & Tools", subtitle: "", date: "", details: ["Microsoft Excel, Google Sheets, Postman, GitHub, Cloudinary"], bullets: false },
      { id: "cloud", title: "Cloud & Platforms", subtitle: "", date: "", details: ["Google Cloud (Data Analytics), Firebase, Vercel"], bullets: false },
    ] },
    { id: "projects", title: "PROJECTS", entries: [
      { id: "yaop", title: "YAOP Community Platform", subtitle: "", date: "", bullets: true, details: [
        "Designed and managed a centralized MongoDB database, organizing structured data for events and volunteers with full accuracy and consistency across all records.",
        "Processed and validated donation entries with complete data integrity by implementing Firebase authentication and structured data workflows.",
        "Built an admin dashboard that streamlined data entry and record updates, reducing manual effort by ~40% and minimizing input errors.",
        "Technologies: Next.js, Express.js, MongoDB, Firebase, Cloudinary",
      ] },
      { id: "frameforge", title: "FrameForge Gaming Platform", subtitle: "", date: "", bullets: true, details: [
        "Designed and maintained structured MongoDB schemas for users, products, and orders, ensuring clean, queryable, and consistent records.",
        "Engineered RESTful APIs to handle high-volume CRUD (create, read, update, delete) data operations reliably and efficiently.",
        "Implemented role-based data access control, enforcing strict segregation between admin and user records with zero unauthorized access.",
        "Conducted data validation and performance testing using Postman to verify the accuracy and integrity of all API data flows. Collaborated in a 4-member team using Git for version control and task coordination.",
        "Technologies: React.js, Express.js, MongoDB, Firebase, REST APIs, Postman",
      ] },
    ] },
    { id: "internship", title: "INTERNSHIP", entries: [
      { id: "inamigos", title: "Web Development Internship", subtitle: "Company Name: InAmigos Foundation", date: "May 2026 – Jun 2026", bullets: false, details: [
        "Assisted in developing and maintaining the organization's website using HTML, CSS, and JavaScript. Designed and implemented new features to enhance site functionality, and improved the layout and structure to make the website more visually attractive and easier to manage.",
        "Technology Used: HTML, CSS, JavaScript, React, Node.js, MongoDB",
      ] },
    ] },
    { id: "certifications", title: "CERTIFICATIONS & ACHIEVEMENTS", entries: [
      { id: "google-analytics", title: "Google Cloud Data Analytics Certificate", subtitle: "", date: "", bullets: false, details: ["Hands-on experience with cloud-based data pipelines, data analysis, and structured reporting tools."] },
      { id: "google-foundations", title: "Google Cloud Career Launchpad (Foundations Track)", subtitle: "", date: "", bullets: false, details: ["Training in cloud computing fundamentals, data management, and analytics best practices."] },
    ] },
  ],
};

export function parseResume(snapshot: string | null): ResumeData {
  try {
    const value: unknown = JSON.parse(snapshot || "null");
    if (!value || typeof value !== "object") return defaultResume;
    const data = value as ResumeData;
    if (![data.name, data.email, data.linkedin, data.github, data.portfolio, data.location].every(item => typeof item === "string") || !Array.isArray(data.sections)) return defaultResume;
    if (!data.sections.every(section => section && typeof section.id === "string" && typeof section.title === "string" && Array.isArray(section.entries) && section.entries.every(entry => entry && [entry.id, entry.title, entry.subtitle, entry.date].every(item => typeof item === "string") && typeof entry.bullets === "boolean" && Array.isArray(entry.details) && entry.details.every(detail => typeof detail === "string")))) return defaultResume;
    // Upgrade the original skills row in existing browser/cloud resumes, keeping custom edits.
    return { ...data, sections: data.sections.map(section => section.id === "skills" ? {
      ...section, entries: section.entries.map(entry => entry.title === "Programming Languages" ? {
        ...entry, title: "Languages", details: entry.details.map(detail => detail === "Python, JavaScript, C++, SQL" ? "Python, C/C++, JavaScript, TypeScript, SQL" : detail),
      } : entry),
    } : section) };
  } catch { return defaultResume; }
}
