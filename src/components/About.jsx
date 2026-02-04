export default function About() {
    return (
        <section
            id="about"
            className="min-h-screen bg-black text-white flex items-center relative"
        >
            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* ===== LEFT COLUMN : Who is Bharat ===== */}
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">
                        WHO IS BHARAT ?
                    </h2>

                    <p className="text-gray-300 leading-relaxed max-w-md text-left md:text-justify text-sm md:text-base">
                        Aspiring full-stack developer with a passion for creating dynamic and user-centric web applications.
                        Keen on leveraging modern technologies like MERN stack, React, and AI APIs to build innovative solutions.
                        Committed to continuous learning and contributing to impactful projects that enhance digital experiences.
                        Seeking opportunities to grow as a software professional and make a meaningful contribution to technology.
                    </p>

                    {/* Skills */}
                    <div className="mt-10">
                        <h3 className="flex items-center gap-3 text-white mb-4 text-sm md:text-base">
                            <span>↳</span> SKILLS
                        </h3>
                        <ul className="space-y-2 text-xs md:text-sm uppercase text-gray-300">
                            <li>• Programming Languages: Python, Java, C++, JavaScript, HTML, CSS</li>
                            <li>• Frameworks: React, Next.js, Express.js, Tailwind CSS, Bootstrap</li>
                            <li>• Tools: Firebase, Git/GitHub, Postman, Canva, MySQL, PostgreSQL, MongoDB</li>
                        </ul>
                    </div>
                </div>

                {/* ===== RIGHT COLUMN : My Background ===== */}
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif mb-8 md:mb-10">
                        MY BACKGROUND
                    </h2>

                    <div className="space-y-10 text-gray-300">

                        {/* Education */}
                        <div>
                            <h3 className="flex items-center gap-3 text-white mb-4 text-sm md:text-base">
                                <span>↳</span> EDUCATION
                            </h3>
                            <ul className="space-y-2 text-xs md:text-sm">
                                <li>• B.Tech in Computer Science & Engineering, Mumbai University (2027) — 8.9/10</li>
                                <li>• +2, KMC Balkumari, Lalitpur, Nepal (2022) — 3.14/4</li>
                            </ul>
                        </div>

                        {/* Work Experience */}
                        {/* <div>
                            <h3 className="flex items-center gap-3 text-white mb-4 text-sm md:text-base">
                                <span>↳</span> WORK EXPERIENCE
                            </h3>
                            <ul className="space-y-2 text-xs md:text-sm">
                                <li>• Freelance Graphic Designer & Illustrator (2022–Present)</li>
                                <li>• Senior Graphic Designer — Talens Institut (2021–22)</li>
                                <li>• Junior Creative — NXTR Design Studio (2020–21)</li>
                            </ul>
                        </div> */}

                    </div>
                </div>
            </div>

            {/* Side Accent Lines (hide on mobile) */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-[2px] bg-purple-600" />
            <div className="hidden md:block absolute right-0 top-0 h-full w-[2px] bg-purple-600" />
        </section>
    )
}
