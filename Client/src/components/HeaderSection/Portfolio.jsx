import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, ArrowUp } from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO BETCOM - FULL WIDTH + PROCHE DU MENU
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
      
      {/* Espace du menu */}
      <div className="h-32"></div>

      {/* Projects List - VRAIMENT SANS PADDING */}
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
                  
                  {/* IMAGE DE COUVERTURE - ABSOLUTE FULL WIDTH */}
                  {project.cover_photo_url && (
                    <div 
                      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[85vh] bg-gray-100 overflow-hidden cursor-pointer group mb-12"
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
                      
                      {/* LAYOUT 2 COLONNES */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
                        
                        {/* COLONNE GAUCHE */}
                        <div className="lg:col-span-7">
                          
                          {/* NOM DU PROJET */}
                          <h2 
                            className="text-4xl md:text-5xl font-bold text-black mb-3 leading-tight cursor-pointer hover:underline"
                            style={{ fontFamily: "'Creato Display', sans-serif" }}
                            onClick={() => navigate(`/portfolio/${project.id}`)}
                          >
                            {projectName || `Projet ${project.id}`}
                          </h2>
                          
                          {/* LOCALISATION */}
                          {location && (
                            <p 
                              className="text-xl text-gray-600 font-light mb-8"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              {location}
                            </p>
                          )}

                          {/* TITRE DESCRIPTION */}
                          {descriptionTitle && (
                            <h3 
                              className="text-2xl font-bold text-black mb-4 mt-8"
                              style={{ fontFamily: "'Creato Display', sans-serif" }}
                            >
                              {descriptionTitle}
                            </h3>
                          )}
                          
                          {/* DESCRIPTION */}
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

                        {/* COLONNE DROITE */}
                        <div className="lg:col-span-5">
                          <div className="lg:sticky lg:top-32 space-y-6">
                            
                            {client && (
                              <div>
                                <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Client: </span>
                                  <span className="text-gray-700">{client}</span>
                                </p>
                              </div>
                            )}
                            
                            {surface && (
                              <div>
                                <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Size: </span>
                                  <span className="text-gray-700">{surface}</span>
                                </p>
                              </div>
                            )}
                            
                            {completionDate && (
                              <div>
                                <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Completion Date: </span>
                                  <span className="text-gray-700">{completionDate}</span>
                                </p>
                              </div>
                            )}

                            {project.category && (
                              <div>
                                <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  <span className="font-bold text-black">Category: </span>
                                  <span className="text-gray-700">
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

                  {/* GRID IMAGES - FULL WIDTH */}
                  {allImages.length > 0 && (
                    <div className="space-y-6">
                      {allImages.map((imageUrl, index) => {
                        const isWide = index % 3 === 0;
                        
                        return isWide ? (
                          // Image pleine largeur - ABSOLUTE FULL WIDTH
                          <div 
                            key={index}
                            className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] bg-gray-100 overflow-hidden cursor-pointer group"
                            onClick={() => navigate(`/portfolio/${project.id}`)}
                          >
                            <img
                              src={imageUrl}
                              alt={`${projectName} - Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          // Deux images côte à côte - AVEC PADDING
                          index % 3 === 1 && (
                            <div key={index} className="px-6 lg:px-16">
                              <div className="max-w-[1600px] mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div 
                                    className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer group"
                                    onClick={() => navigate(`/portfolio/${project.id}`)}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`${projectName} - Image ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                  {allImages[index + 1] && (
                                    <div 
                                      className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer group"
                                      onClick={() => navigate(`/portfolio/${project.id}`)}
                                    >
                                      <img
                                        src={allImages[index + 1]}
                                        alt={`${projectName} - Image ${index + 2}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        );
                      })}
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

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-2xl z-50"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Portfolio;