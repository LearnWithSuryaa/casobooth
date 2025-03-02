import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icon Hamburger & Close

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Untuk mengetahui path aktif

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:flex">
        <div className="bg-white/70 text-[#ff4ecd] px-8 py-3 rounded-full shadow-lg border border-[#ff4ecd]/40 backdrop-blur-lg flex space-x-8 transition-all duration-300 hover:shadow-2xl">
          <NavLinks location={location} />
        </div>
      </nav>

      {/* Hamburger Button (Mobile) */}
      <button
        className="fixed top-6 left-6 z-50 md:hidden text-white bg-[#ff4ecd] p-3 rounded-full shadow-lg border border-[#ff4ecd]/40 hover:bg-[#ff4ecd]/80 transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Menu (Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex animate-fade-in">
          <div className="bg-black text-white w-64 p-8 shadow-lg transform translate-x-0 transition-transform duration-300 ease-out">
            {/* Tombol Close */}
            <button
              className="text-[#ff4ecd] mb-6 hover:text-[#ff4ecd]/80 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Menu Items */}
            <div className="flex flex-col space-y-6">
              <NavLinks location={location} onClick={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const NavLinks = ({ location, onClick }) => {
  const linkClass = (path) =>
    `relative text-[#ff4ecd] tracking-wide font-medium transition-all duration-300 ease-out 
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full 
    after:h-[2px] after:bg-gradient-to-r from-[#ff4ecd] to-transparent after:scale-x-0 
    hover:after:scale-x-100 after:transition-transform after:duration-500 ${
      location.pathname === path
        ? "text-[#ff4ecd] after:scale-x-100 font-semibold"
        : "text-[#ff4ecd]/80"
    } hover:scale-105`;

  return (
    <>
      <Link to="/" className={linkClass("/")} onClick={onClick}>
        Home
      </Link>
      <Link to="/capture" className={linkClass("/capture")} onClick={onClick}>
        Capture
      </Link>
      <Link to="/about" className={linkClass("/about")} onClick={onClick}>
        About
      </Link>
    </>
  );
};
