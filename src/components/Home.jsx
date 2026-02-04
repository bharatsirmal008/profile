import React from "react"
import profilePic from "../assets/profile.jpeg"

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center bg-black text-white relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Right Image (TOP on mobile) */}
                <div className="flex justify-center order-1 md:order-2">
                    <div className="w-56 h-72 md:w-72 md:h-96 rounded-full overflow-hidden border-4 border-gray-700">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Left Content */}
                <div className="order-2 md:order-1 text-center md:text-left">
                    <div className="inline-block p-4 md:p-6">
                        <h1 className="text-3xl md:text-6xl font-serif leading-tight tracking-[3px] md:tracking-[5px]">
                            WELCOME TO
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-serif leading-tight mt-2">
                            MY PROFILE !
                        </h1>
                    </div>

                    <button className="mt-6 md:mt-8 px-5 py-3 border border-gray-500 rounded-full text-xs md:text-sm hover:border-white transition">
                        BHARAT SIRMAL / SOFTWARE ENGINEER
                    </button>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 md:left-auto md:right-10 -translate-x-1/2 md:translate-x-0 flex items-center gap-2 text-sm text-gray-300">
                <span className="text-xl">↘</span>
                <a
                    href="https://www.linkedin.com/in/bharat-sirmal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                >
                    Work with me today
                </a>
            </div>
        </section>
    )
}
