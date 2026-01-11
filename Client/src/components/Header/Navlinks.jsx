import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X, Building2, Layers, Users, Newspaper, ArrowRight } from "lucide-react";
import Logo from "./Logo";

const Navlinks = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLanguage = i18n.language.toUpperCase().substring(0, 2);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquer scroll body quand menu ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.toLowerCase());
  };

  const navItems = [
    { title: t('nav.home'), path: "/", icon: Building2 },
    { title: t('nav.about'), path: "/nosMissions", icon: Users },
    { title: t('nav.expertise'), path: "/services", icon: Layers },
    { title: t('nav.projects'), path: "/portfolio", icon: Building2 },
    { title: t('nav.team'), path: "/notreEquipe", icon: Users },
    { title: t('nav.news'), path: "/actualites", icon: Newspaper },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="h-0.5 bg-black"></div>

        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-3 h-20">
            
            {/* LEFT NAV */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.slice(0, 3).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                      isActive ? "text-black" : "text-gray-600 hover:text-black"
                    }`
                  }
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>

            {/* LOGO CENTER */}
            <div className="flex justify-center">
              <NavLink to="/">
                <Logo scrolled={scrolled} />
              </NavLink>
            </div>

            {/* RIGHT NAV + ACTIONS */}
            <div className="hidden lg:flex items-center justify-end gap-6">
              <nav className="flex items-center gap-2">
                {navItems.slice(3).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                        isActive ? "text-black" : "text-gray-600 hover:text-black"
                      }`
                    }
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {item.title}
                  </NavLink>
                ))}
              </nav>

              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                <button
                  onClick={() => changeLanguage("FR")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLanguage === "FR" ? "bg-black text-white" : "text-gray-600"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => changeLanguage("EN")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLanguage === "EN" ? "bg-black text-white" : "text-gray-600"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              <NavLink
                to="/contacternous"
                className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {t('nav.contactUs')}
              </NavLink>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative flex items-center justify-center w-11 h-11 rounded-full border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="relative w-5 h-5 flex flex-col items-center justify-center">
                {mobileMenuOpen ? (
                  <div className="relative w-full h-full">
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-black transform -translate-y-1/2 -rotate-45"></span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex flex-col justify-center gap-1.5">
                    <span className="w-full h-0.5 bg-black transition-all group-hover:w-3/4"></span>
                    <span className="w-3/4 h-0.5 bg-black transition-all group-hover:w-full ml-auto"></span>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100"></div>
      </header>

      {/* MENU MOBILE - SIMPLIFIÉ POUR DEBUG */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay noir */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel blanc qui slide */}
          <div className="absolute top-0 right-0 w-full sm:max-w-md h-full bg-white shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
            
            {/* Header du menu */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Logo scrolled={false} />
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  Menu
                </h3>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <div className="p-6 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.title}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                  </NavLink>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">
                  {t('nav.language')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeLanguage("FR")}
                    className={`flex-1 px-6 py-3 text-sm font-bold rounded-xl ${
                      currentLanguage === "FR" ? "bg-black text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage("EN")}
                    className={`flex-1 px-6 py-3 text-sm font-bold rounded-xl ${
                      currentLanguage === "EN" ? "bg-black text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <NavLink
                to="/contacternous"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-black text-white font-bold rounded-2xl"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {t('nav.contactUs')}
                <ArrowRight className="w-5 h-5" />
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-start justify-center pt-32 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                {t('nav.searchTitle')}
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder') || "Rechercher..."}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 focus:border-black focus:outline-none rounded-2xl"
                autoFocus
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;