// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
// import NavAdmin from "./components/Header/NavAdmin";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";
// import React from "react";
// // import { trackAction } from "./utils/tracker";

// /**
//  * 🎨 APP TEKACOM - COMPLET ET OPTIMISÉ
//  * ✅ Scroll unique et stylé
//  * ✅ Pas de débordement
//  * ✅ Mobile-friendly
//  * ✅ Scroll to top automatique à chaque navigation
//  */

// const App = () => {
//   const location = useLocation();
//   const token = localStorage.getItem("access");

//   /* =============================
//      🎯 SCROLL TO TOP ON ROUTE CHANGE
//      CRUCIAL: Scroll #root car c'est lui qui a overflow-y: auto
//   ============================== */
//   React.useEffect(() => {
//     // Trouve l'élément #root qui a le scroll
//     const rootElement = document.getElementById('root');
    
//     if (rootElement) {
//       // Scroll #root (pas window !)
//       rootElement.scrollTop = 0;
//     }
    
//     // Fallback pour window (au cas où)
//     window.scrollTo(0, 0);
//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
    
//     // Double vérification après render
//     const timer = setTimeout(() => {
//       if (rootElement) {
//         rootElement.scrollTop = 0;
//       }
//       window.scrollTo(0, 0);
//     }, 0);
    
//     return () => clearTimeout(timer);
//   }, [location.pathname]); // ← CRUCIAL: écoute les changements d'URL

//   /* =============================
//      TRACKING
//   ============================== */
//   // React.useEffect(() => {
//   //   trackAction({
//   //     action_type: "visit",
//   //     page: location.pathname,
//   //   });
//   // }, [location.pathname]);

//   // React.useEffect(() => {
//   //   const handleClick = (e) => {
//   //     const target = e.target;
//   //     const label = target.id || target.innerText || target.alt || "unknown";

//   //     trackAction({
//   //       action_type: "click",
//   //       page: location.pathname,
//   //       label,
//   //       tag: target.tagName,
//   //     });
//   //   };

//   //   document.addEventListener("click", handleClick);
//   //   return () => document.removeEventListener("click", handleClick);
//   // }, [location.pathname]);

//   /* =============================
//      ROUTES
//   ============================== */
//   const adminPaths = [
//     "/newsPost", "/listeContacts", "/listeRejoindre",
//     "/listePostulantsCommunity", "/listPartners",
//     "/listeAbonnement", "/platformPost", "/valeurPost",
//     "/dashboardAdmin", "/teamMessage", "/missionPost",
//     "/activitiesPost", "/homePost", "/partnerPost",
//     "/servicePost", "/portfolioPost",
//   ];

//   const isAdminPage = adminPaths.includes(location.pathname);
//   const isLoginPage = location.pathname === "/login";

//   if (isAdminPage && !token) {
//     return <Navigate to="/login" replace />;
//   }

//   /* =============================
//      🎨 GLOBAL STYLES - SCROLL UNIQUE
//   ============================== */
//   const globalStyles = `
//     /* === STRUCTURE DE BASE === */
//     html {
//       overflow: hidden;
//       width: 100%;
//       height: 100%;
//     }

//     body {
//       overflow: hidden;
//       width: 100%;
//       height: 100%;
//       margin: 0;
//       padding: 0;
//     }

//     #root {
//       overflow-y: auto;
//       overflow-x: hidden;
//       width: 100%;
//       height: 100%;
//       -webkit-overflow-scrolling: touch;
//     }

//     /* === EMPÊCHE DÉBORDEMENT === */
//     * {
//       box-sizing: border-box;
//     }

//     body, #root, #root > div {
//       max-width: 100%;
//     }

//     /* Force toutes les classes Tailwind */
//     .w-full {
//       width: 100% !important;
//       max-width: 100% !important;
//     }

//     .min-h-screen {
//       width: 100% !important;
//     }

//     /* === SCROLLBAR TEKACOM === */
    
//     /* Firefox */
//     #root {
//       scrollbar-width: thin;
//       scrollbar-color: #a34ee5 #0a0a0a;
//     }

//     /* Chrome, Edge, Safari */
//     #root::-webkit-scrollbar {
//       width: 10px;
//     }

//     #root::-webkit-scrollbar-track {
//       background: #0a0a0a;
//       border-radius: 10px;
//     }

//     #root::-webkit-scrollbar-thumb {
//       background: linear-gradient(180deg, #a34ee5 0%, #7828a8 100%);
//       border-radius: 10px;
//       border: 2px solid #0a0a0a;
//     }

//     #root::-webkit-scrollbar-thumb:hover {
//       background: linear-gradient(180deg, #fec603 0%, #a34ee5 100%);
//       box-shadow: 0 0 10px rgba(163, 78, 229, 0.5);
//     }

//     /* === CACHE LES AUTRES SCROLLBARS === */
//     html::-webkit-scrollbar,
//     body::-webkit-scrollbar,
//     *:not(#root)::-webkit-scrollbar {
//       display: none;
//       width: 0;
//     }

//     html,
//     body,
//     *:not(#root) {
//       scrollbar-width: none;
//     }

//     /* === MOBILE === */
//     @media (max-width: 768px) {
//       #root::-webkit-scrollbar {
//         width: 6px;
//       }
//     }
//   `;

//   return (
//     <I18nextProvider i18n={i18n}>
//       <style>{globalStyles}</style>

//       {isAdminPage ? (
//         /* ==================================================
//            ADMIN LAYOUT
//         ================================================== */
//         <div className="w-full min-h-screen bg-[#0a0a0a] relative">
//           {/* Background admin */}
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/5 rounded-full blur-3xl" />
//             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/5 rounded-full blur-3xl" />
//           </div>

//           <NavAdmin />

//           <main className="relative w-full">
//             <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 pt-24 pb-10">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       ) : (
//         /* ==================================================
//            PUBLIC LAYOUT
//         ================================================== */
//         <div className="w-full min-h-screen bg-[#0a0a0a] text-gray-100 relative">
//           {/* Background décoratif */}
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a34ee5]/20 rounded-full blur-3xl" />
//             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7828a8]/20 rounded-full blur-3xl" />
//           </div>

//           {/* Header FIXED */}
//           {!isLoginPage && (
//             <div className="fixed top-0 left-0 right-0 z-50">
//               <Header logoColor="#a34ee5" />
//             </div>
//           )}

//           {/* MAIN */}
//           <main className="relative pt-32 pb-16">
//             <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
//               <Outlet />
//             </div>
//           </main>

//           {/* Footer */}
//           {!isLoginPage && (
//             <div className="relative z-10">
//               <Footer />
//             </div>
//           )}
//         </div>
//       )}
//     </I18nextProvider>
//   );
// };

// export default App;


import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";

/**
 * 🎨 APP BETCOM AI - COMPLET ET OPTIMISÉ
 * ✅ Charte graphique BETCOM (noir #000000 et #1d1d1b)
 * ✅ Design sobre, moderne et institutionnel
 * ✅ Scroll unique et stylé
 * ✅ Pas de débordement
 * ✅ Mobile-friendly
 * ✅ Scroll to top automatique à chaque navigation
 */

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  /* =============================
     🎯 SCROLL TO TOP ON ROUTE CHANGE
     CRUCIAL: Scroll #root car c'est lui qui a overflow-y: auto
  ============================== */
  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    
    if (rootElement) {
      rootElement.scrollTop = 0;
    }
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const timer = setTimeout(() => {
      if (rootElement) {
        rootElement.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  /* =============================
     ROUTES
  ============================== */
  const adminPaths = [
    "/newsPost", "/listeContacts", "/listeRejoindre",
    "/listePostulantsCommunity", "/listPartners",
    "/listeAbonnement", "/platformPost", "/valeurPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost",
    "/activitiesPost", "/homePost", "/partnerPost",
    "/servicePost", "/portfolioPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) {
    return <Navigate to="/login" replace />;
  }

  /* =============================
     🎨 GLOBAL STYLES - CHARTE BETCOM
     Couleurs primaires: #000000 (noir) et #1d1d1b (gris très foncé)
     Design sobre, moderne et institutionnel
  ============================== */
  const globalStyles = `
    /* === STRUCTURE DE BASE === */
    html {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    body {
      overflow: hidden;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    #root {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      -webkit-overflow-scrolling: touch;
      background: #ffffff;
    }

    /* === EMPÊCHE DÉBORDEMENT === */
    * {
      box-sizing: border-box;
    }

    body, #root, #root > div {
      max-width: 100%;
    }

    .w-full {
      width: 100% !important;
      max-width: 100% !important;
    }

    .min-h-screen {
      width: 100% !important;
    }

    /* === SCROLLBAR BETCOM (sobre et professionnel) === */
    
    /* Firefox */
    #root {
      scrollbar-width: thin;
      scrollbar-color: #1d1d1b #f5f5f5;
    }

    /* Chrome, Edge, Safari */
    #root::-webkit-scrollbar {
      width: 8px;
    }

    #root::-webkit-scrollbar-track {
      background: #f5f5f5;
    }

    #root::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #1d1d1b 0%, #000000 100%);
      border-radius: 4px;
    }

    #root::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #2d2d2b 0%, #1d1d1b 100%);
    }

    /* === CACHE LES AUTRES SCROLLBARS === */
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    *:not(#root)::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    html,
    body,
    *:not(#root) {
      scrollbar-width: none;
    }

    /* === MOBILE === */
    @media (max-width: 768px) {
      #root::-webkit-scrollbar {
        width: 4px;
      }
    }

    /* === TYPOGRAPHIE BETCOM === */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #000000;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      letter-spacing: -0.02em;
    }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{globalStyles}</style>

      {isAdminPage ? (
        /* ==================================================
           ADMIN LAYOUT - BETCOM AI
        ================================================== */
        <div className="w-full min-h-screen bg-white relative">
          {/* Background admin subtil */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d1d1b]/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1d1d1b]/3 rounded-full blur-3xl" />
          </div>

          <NavAdmin />

          <main className="relative w-full">
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 pt-24 pb-10">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        /* ==================================================
           PUBLIC LAYOUT - BETCOM AI
           Design sobre, moderne et institutionnel
        ================================================== */
        <div className="w-full min-h-screen bg-white text-[#000000] relative">
          {/* Background décoratif subtil (dégradé gris) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[#1d1d1b]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#1d1d1b]/3 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Header FIXED */}
          {!isLoginPage && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1d1d1b]/10">
              <Header logoColor="#000000" />
            </div>
          )}

          {/* MAIN */}
          <main className="relative pt-32 pb-16">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          {!isLoginPage && (
            <div className="relative z-10 border-t border-[#1d1d1b]/10">
              <Footer />
            </div>
          )}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;