import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Search, Menu, X, ChevronDown, ArrowRight, Building2, Layers, Users, Award, Briefcase, Newspaper, Mail } from "lucide-react";
import Logo from "./Logo";

/**
 * 🏗️ HEADER BETCOM AI - ULTRA MODERN ARCHITECTURE
 * Design inspiré des meilleurs sites d'architecture + design moderne
 * Couleurs: #000000 (noir), #1d1d1b (gris foncé), blanc
 * Minimaliste, épuré, architectural
 */

const Navlinks = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [language, setLanguage] = useState("FR");
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const navItems = [
    { title: "Accueil", path: "/", icon: Building2 },
    { title: "À propos", path: "/nosMissions", icon: Users },
    { title: "Expertises", path: "/services", icon: Layers },
    { title: "Projets", path: "/projects", icon: Building2 },
    { title: "Équipe", path: "/notreEquipe", icon: Users },
    { title: "Actualités", path: "/news", icon: Newspaper },
    // { title: "Carrières", path: "/careers", icon: Briefcase },
    { title: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* HEADER - Ultra Modern Architecture Style */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.08)]' 
          : 'bg-white'
      }`}>
        {/* Top Line - Architectural Detail */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#000000] to-transparent transition-opacity duration-700 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}></div>

        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className={`flex items-center justify-between transition-all duration-700 ${
            scrolled ? 'h-16' : 'h-20'
          }`}>
            
            {/* LOGO */}
            <div className="relative z-10 transition-all duration-700">
              <Logo scrolled={scrolled} />
            </div>

            {/* MENU DESKTOP - Minimalist Architecture */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative px-5 py-2 text-[13px] font-semibold tracking-wide transition-all duration-500 ${
                      isActive 
                        ? "text-[#000000]" 
                        : "text-gray-600 hover:text-[#000000]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        {item.title}
                        <span className={`absolute -bottom-1 left-0 h-px bg-[#000000] transition-all duration-500 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}></span>
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* ACTIONS - Minimalist */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <button
                  onClick={() => setLanguage("FR")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                    language === "FR"
                      ? "bg-[#000000] text-white"
                      : "text-gray-600 hover:text-[#000000]"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage("EN")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                    language === "EN"
                      ? "bg-[#000000] text-white"
                      : "text-gray-600 hover:text-[#000000]"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Search Button */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 group"
                aria-label="Rechercher"
              >
                <Search size={18} className="text-gray-600 group-hover:text-[#000000] transition-colors duration-300" />
              </button>

              {/* Contact CTA */}
              <NavLink
                to="/contact"
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-[#000000] text-white text-sm font-semibold rounded-full hover:bg-[#1d1d1b] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                Nous contacter
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </NavLink>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X size={22} className="text-[#000000]" />
                ) : (
                  <Menu size={22} className="text-[#000000]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-100"></div>
      </header>

      {/* MENU MOBILE - Full Screen Overlay */}
      <div className={`fixed inset-0 bg-white z-40 lg:hidden transition-all duration-700 ${
        mobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}>
        <div className="h-full overflow-y-auto">
          <div className="min-h-full flex flex-col px-6 py-20">
            {/* Mobile Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300
                      ${isActive 
                        ? 'bg-[#000000] text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon size={20} className={isActive ? 'text-white' : 'text-gray-700'} />
                        </div>
                        <span className="flex-1 text-lg font-bold">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Language Switcher Mobile */}
            <div className="mt-6 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Langue</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLanguage("FR")}
                  className={`flex-1 px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    language === "FR"
                      ? "bg-[#000000] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setLanguage("EN")}
                  className={`flex-1 px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    language === "EN"
                      ? "bg-[#000000] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-gray-200">
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#000000] text-white text-base font-bold rounded-2xl hover:bg-[#1d1d1b] transition-all duration-300"
              >
                Nous contacter
                <ArrowRight size={18} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL - Minimalist */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-start justify-center pt-32 px-4 z-[60] animate-fadeIn"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <Search size={20} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#000000]">Rechercher</h3>
                  <p className="text-sm text-gray-500">Parcourez notre contenu</p>
                </div>
              </div>
              
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des projets, services, actualités..."
                autoFocus
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#000000] focus:bg-white transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#000000] flex items-center justify-center">
                <Search size={18} className="text-white" />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <kbd className="px-3 py-1 bg-gray-100 rounded-lg font-mono text-xs">Enter</kbd>
              <span>pour rechercher</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navlinks;