import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, ArrowUp } from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO BETCOM - MASONRY 2 COLONNES - COINS POINTUS
 */

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language.toUpperCase().substring(0, 2);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/`);
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        
        let projectsArray = [];
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          projectsArray = data.results;
        }
        
        const activeProjects = projectsArray.filter(p => p.is_active === true);
        setProjects(activeProjects);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getText = (project, field) => {
    if (!project) return '';
    return currentLang === 'FR' 
      ? (project[`${field}_fr`] || project[`${field}_en`] || '')
      : (project[`${field}_en`] || project[`${field}_fr`] || '');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Projects List - Image commence directement */}
      <section className="pb-24">
        <div className="space-y-32">
          
          {projects.length === 0 ? (
            <div className="px-6 lg:px-16">
              <div className="max-w-[1600px] mx-auto text-center p-16 border-2 border-gray-200 rounded-2xl">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-black mb-3">Aucun projet trouvé</h3>
              </div>
            </div>
          ) : (
            projects.map((project) => {
              const projectName = getText(project, 'project_name');
              const location = getText(project, 'location');
              const descriptionTitle = getText(project, 'description_title');
              const description = getText(project, 'description');
              const client = getText(project, 'client');
              const surface = getText(project, 'surface');
              const completionDate = getText(project, 'completion_date');
              
              const allImages = Array.from({ length: 20 }, (_, i) => 
                project[`image_${i+1}_url`]
              ).filter(Boolean);
              
              return (
                <div key={project.id} className="border-b border-gray-200 pb-32">
                  
                  {/* IMAGE DE COUVERTURE - PLEINE PAGE AVEC CLASSE */}
                  {project.cover_photo_url && (
                    <div 
                      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[90vh] bg-gray-100 overflow-hidden cursor-pointer group mb-16"
                      onClick={() => navigate(`/portfolio/${project.id}`)}
                    >
                      <img
                        src={project.cover_photo_url}
                        alt={projectName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* CONTENU - AVEC PADDING */}
                  <div className="px-6 lg:px-16">
                    <div className="max-w-[1600px] mx-auto">
                      
                      {/* TITRE + LOCALISATION */}
                      <div className="mb-20">
                        <h2 
                          className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight cursor-pointer hover:underline"
                          style={{ fontFamily: "'Creato Display', sans-serif" }}
                          onClick={() => navigate(`/portfolio/${project.id}`)}
                        >
                          {projectName || `Projet ${project.id}`}
                        </h2>
                        
                        {location && (
                          <p 
                            className="text-xl text-gray-600 font-light"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {location}
                          </p>
                        )}
                      </div>
                      
                      {/* LAYOUT 2 COLONNES - DESCRIPTION + INFOS */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 mb-16">
                        
                        {/* COLONNE GAUCHE - Description */}
                        <div className="lg:col-span-6">
                          {descriptionTitle && (
                            <h3 
                              className="text-2xl font-bold text-black mb-6"
                              style={{ fontFamily: "'Creato Display', sans-serif" }}
                            >
                              {descriptionTitle}
                            </h3>
                          )}
                          
                          {description && (
                            <div 
                              className="text-base text-gray-700 leading-relaxed space-y-4"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              {description.split('\n').map((para, idx) => (
                                para.trim() && <p key={idx}>{para}</p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* COLONNE DROITE - Détails */}
                        <div className="lg:col-span-6">
                          <div className="space-y-8 lg:pl-20">
                            {client && (
                              <div>
                                <p className="text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Client: </span>
                                  <span className="text-gray-600">{client}</span>
                                </p>
                              </div>
                            )}
                            
                            {surface && (
                              <div>
                                <p className="text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Size: </span>
                                  <span className="text-gray-600">{surface}</span>
                                </p>
                              </div>
                            )}
                            
                            {completionDate && (
                              <div>
                                <p className="text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Completion Date: </span>
                                  <span className="text-gray-600">{completionDate}</span>
                                </p>
                              </div>
                            )}

                            {project.category && (
                              <div>
                                <p className="text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Category: </span>
                                  <span className="text-gray-600">
                                    {project.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🧱 MASONRY GRID - 2 COLONNES - COINS POINTUS */}
                  {allImages.length > 0 && (
                    <div className="px-6 lg:px-16">
                      <div className="max-w-[1600px] mx-auto">
                        
                        {/* 
                          ✅ 2 colonnes sur desktop/tablette
                          ✅ 1 colonne sur mobile
                          ✅ Coins pointus (pas de rounded)
                          ✅ Images gardent leur ratio
                        */}
                        <div 
                          className="masonry-container"
                          style={{
                            columnCount: window.innerWidth >= 640 ? 2 : 1,
                            columnGap: '1.5rem',
                          }}
                        >
                          {allImages.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="masonry-item cursor-pointer group"
                              style={{
                                breakInside: 'avoid',
                                marginBottom: '1.5rem',
                              }}
                              onClick={() => navigate(`/portfolio/${project.id}`)}
                            >
                              {/* 
                                ⚠️ COINS POINTUS - Pas de rounded-lg 
                                Juste overflow-hidden pour effet hover
                              */}
                              <div className="relative overflow-hidden bg-gray-100">
                                <img
                                  src={imageUrl}
                                  alt={`${projectName} - Image ${index + 1}`}
                                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                  style={{
                                    display: 'block',
                                    maxWidth: '100%',
                                    height: 'auto',
                                  }}
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}

          {/* CTA */}
          {projects.length > 0 && (
            <div className="px-6 lg:px-16">
              <div className="max-w-[1600px] mx-auto text-center pt-16">
                <div className="w-16 h-px bg-black mx-auto mb-8"></div>
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6" 
                  style={{ fontFamily: "'Creato Display', sans-serif" }}
                >
                  {t('portfolio.cta.title') || 'Prêt à démarrer votre projet ?'}
                </h2>
                <p 
                  className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light" 
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {t('portfolio.cta.subtitle') || 'Contactez-nous pour discuter'}
                </p>
                <a
                  href="/contacternous"
                  className="group inline-flex items-center gap-4 text-xl font-bold text-black hover:gap-6 transition-all duration-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {t('portfolio.cta.button') || 'Contactez-nous'}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition-all duration-300 shadow-2xl z-50 group"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-7 h-7 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      {/* CSS Masonry responsive intégré */}
      <style jsx>{`
        @media (max-width: 639px) {
          .masonry-container {
            column-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;