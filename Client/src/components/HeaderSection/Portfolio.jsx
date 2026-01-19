import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUp } from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO - Page de détail d'UN projet individuel
 */

const Portfolio = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL /portfolio/:id
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.toUpperCase().substring(0, 2);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/${id}/`);
        if (!res.ok) throw new Error('Project not found');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Fetch error:', err);
        // Rediriger vers la page projects si le projet n'existe pas
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, navigate]);

  const getText = (field) => {
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

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <button 
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const projectName = getText('project_name');
  const location = getText('location');
  const descriptionTitle = getText('description_title');
  const description = getText('description');
  const client = getText('client');
  const surface = getText('surface');
  const completionDate = getText('completion_date');
  
  const allImages = Array.from({ length: 20 }, (_, i) => 
    project[`image_${i+1}_url`]
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">

      {/* Bouton Retour vers Projects - Position absolue par-dessus l'image */}
      {/* <div className="absolute top-8 left-6 lg:left-16 z-10">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-black font-semibold hover:bg-white transition-all duration-300 shadow-lg"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <ArrowLeft className="w-5 h-5" />
          {t('portfolio.back') || 'Back to Projects'}
        </button>
      </div> */}

      {/* IMAGE DE COUVERTURE - FULL WIDTH SANS ESPACE */}
      {project.cover_photo_url && (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[90vh] bg-gray-100 overflow-hidden mb-16">
          <img
            src={project.cover_photo_url}
            alt={projectName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CONTENU - AVEC PADDING */}
      <div className="px-6 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          
          {/* TITRE + LOCALISATION */}
          <div className="mb-20">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight"
              style={{ fontFamily: "'Creato Display', sans-serif" }}
            >
              {projectName || `Project ${project.id}`}
            </h1>
            
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
                <h2 
                  className="text-2xl font-bold text-black mb-6"
                  style={{ fontFamily: "'Creato Display', sans-serif" }}
                >
                  {descriptionTitle}
                </h2>
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
        <div className="px-6 lg:px-16 mb-16">
          <div className="max-w-[1600px] mx-auto">
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
                  className="masonry-item"
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={`${projectName} - Image ${index + 1}`}
                      className="w-full h-auto object-contain"
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

      {/* Bouton Retour en bas */}
      <div className="px-6 lg:px-16 py-16 border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto text-center">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-3 text-lg font-bold text-black hover:gap-4 transition-all duration-300"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <ArrowLeft className="w-6 h-6" />
            {t('portfolio.back_all') || 'Back to All Projects'}
          </button>
        </div>
      </div>

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