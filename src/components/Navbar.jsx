import React, { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 h-15 w-full backdrop-blur border-b border-black z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 relative flex items-center">

                {/* Desktop Menu - CENTER */}
                <ul className="hidden md:flex  mt-10 space-x-10 text-gray-300 absolute left-1/2 -translate-x-1/2">
                    <li>
                        <a href="#" className="hover:text-white transition">
                            HOME
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="hover:text-white transition">
                            ABOUT
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="hover:text-white transition">
                            CONTACT
                        </a>
                    </li>
                </ul>

                {/* Mobile Hamburger - RIGHT */}
                <div className="ml-auto md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-300 focus:outline-none"
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden bg-black text-gray-300 flex flex-col items-center space-y-4 py-6">
                    <li><a href="#" className="hover:text-white">HOME</a></li>
                    <li><a href="#about" className="hover:text-white">ABOUT</a></li>
                    <li><a href="#contact" className="hover:text-white">CONTACT</a></li>
                </ul>
            )}
        </nav>
    );
}
