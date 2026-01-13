import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, ArrowUp } from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO BETCOM - LAYOUT EXACT PERKINS+WILL
 * Cover image → Layout 2 colonnes (infos/description) → Grid images
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
      
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-16">
        {/* <div className="max-w-[1600px] mx-auto">
          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-black mb-8 leading-tight" 
            style={{ fontFamily: "'Creato Display', sans-serif" }}
          >
            {t('portfolio.title') || 'Nos Projets'}
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl font-light leading-relaxed" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('portfolio.subtitle') || 'Découvrez nos réalisations'}
          </p>
        </div> */}
      </section>

      {/* Projects List */}
      <section className="pb-24 px-6 lg:px-16">
        <div className="max-w-[1600px] mx-auto space-y-32">
          
          {projects.length === 0 ? (
            <div className="text-center p-16 border-2 border-gray-200 rounded-2xl">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-black mb-3">Aucun projet trouvé</h3>
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
              
              // Récupérer les images 1 à 20
              const allImages = Array.from({ length: 20 }, (_, i) => 
                project[`image_${i+1}_url`]
              ).filter(Boolean);
              
              return (
                <div key={project.id} className="border-b border-gray-200 pb-32">
                  
                  {/* IMAGE DE COUVERTURE EN GRAND */}
                  {project.cover_photo_url && (
                    <div 
                      className="w-full h-[70vh] bg-gray-100 overflow-hidden cursor-pointer group mb-12"
                      onClick={() => navigate(`/portfolio/${project.id}`)}
                    >
                      <img
                        src={project.cover_photo_url}
                        alt={projectName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* LAYOUT 2 COLONNES - INFOS + DESCRIPTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
                    
                    {/* COLONNE GAUCHE - Nom + Location + Description */}
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

                    {/* COLONNE DROITE - Détails */}
                    <div className="lg:col-span-5">
                      <div className="lg:sticky lg:top-32 space-y-6">
                        
                        {/* Client */}
                        {client && (
                          <div>
                            <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              <span className="font-bold text-black">Client: </span>
                              <span className="text-gray-700">{client}</span>
                            </p>
                          </div>
                        )}
                        
                        {/* Size */}
                        {surface && (
                          <div>
                            <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              <span className="font-bold text-black">Size: </span>
                              <span className="text-gray-700">{surface}</span>
                            </p>
                          </div>
                        )}
                        
                        {/* Completion Date */}
                        {completionDate && (
                          <div>
                            <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              <span className="font-bold text-black">Completion Date: </span>
                              <span className="text-gray-700">{completionDate}</span>
                            </p>
                          </div>
                        )}

                        {/* Category */}
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
                        
                        {/* Bouton Voir Projet */}
                        {/* <button
                          onClick={() => navigate(`/portfolio/${project.id}`)}
                          className="mt-6 w-full px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          View Project
                          <ArrowRight className="w-5 h-5" />
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* GRID IMAGES - Style Perkins+Will */}
                  {allImages.length > 0 && (
                    <div className="space-y-6">
                      {allImages.map((imageUrl, index) => {
                        // Alternance : 1 grande, 2 petites, 1 grande, etc.
                        const isWide = index % 3 === 0;
                        
                        return isWide ? (
                          // Image pleine largeur
                          <div 
                            key={index}
                            className="relative w-full h-[60vh] bg-gray-100 overflow-hidden cursor-pointer group"
                            onClick={() => navigate(`/portfolio/${project.id}`)}
                          >
                            <img
                              src={imageUrl}
                              alt={`${projectName} - Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          // Deux images côte à côte (si l'image suivante existe)
                          index % 3 === 1 && (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="text-center pt-16">
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
          )}
        </div>
      </section>

      {/* Scroll to Top Button */}
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