import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Briefcase, 
  AlertCircle, 
  X, 
  ArrowRight, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import CONFIG from "../../config/config.js";

/**
 * 🎨 PORTFOLIO BETCOM AI - ULTRA MODERN
 * Inspiré de v-p.com avec charte Betcom
 * Noir, blanc, gris + images en couleur
 */

const LoadingSpinner = ({ t }) => (
  <div className="flex flex-col justify-center items-center py-40">
    <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
    <span className="text-sm text-gray-400 mt-6 tracking-widest uppercase">{t('portfolio.loading')}</span>
  </div>
);

const Portfolio = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_PORTFOLIO_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const projectData = Array.isArray(data) ? data : data.results || [];
        
        const activeProjects = projectData.filter(project => project.is_active === true);
        setProjects(activeProjects);
      } catch (err) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner t={t} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-3">{t('portfolio.error.title')}</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            {t('portfolio.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Style NotreEquipe */}
      <section className="relative pt-40 pb-24 px-6 lg:px-16 border-b border-black">
        <div className="max-w-[1800px] mx-auto">
          
          {/* Title */}
          <div className="mb-20">
            <h1 className="text-[10vw] md:text-[8vw] lg:text-[120px] font-bold leading-none tracking-tight text-black mb-8" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t('portfolio.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl font-light leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('portfolio.subtitle')}
            </p>
          </div>

          {/* Stats Line */}
          <div className="flex flex-wrap items-center gap-8 md:gap-16 text-sm uppercase tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div>
              <span className="text-black font-bold text-3xl md:text-4xl">{projects.length}</span>
              <span className="text-gray-400 ml-3">{t('portfolio.stats.projects')}</span>
            </div>
            {projects.length > 0 && (
              <>
                <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
                <div>
                  <span className="text-black font-bold text-3xl md:text-4xl">
                    {projects.reduce((acc, p) => {
                      const count = [p.cover_photo, ...Array(8).fill().map((_, i) => p[`image_${i+1}`])].filter(Boolean).length;
                      return acc + count;
                    }, 0)}
                  </span>
                  <span className="text-gray-400 ml-3">{t('portfolio.stats.images')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-20 px-6 lg:px-16">
        <div className="max-w-[1800px] mx-auto">

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="max-w-2xl mx-auto p-12 border border-gray-200 rounded-2xl text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('portfolio.empty.title')}</h3>
              <p className="text-gray-500">{t('portfolio.empty.subtitle')}</p>
            </div>
          )}

          {/* Projects Grid - Style v-p.com */}
          {!loading && !error && projects.length > 0 && (
            <>
              {/* Grid asymétrique inspiré de v-p.com */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-fr">
                {projects.map((project, index) => {
                  // Pattern asymétrique: 1er grand (8 cols), puis alternance
                  let gridClass = '';
                  if (index === 0) {
                    gridClass = 'lg:col-span-8 lg:row-span-2'; // Hero project
                  } else if (index % 5 === 1) {
                    gridClass = 'lg:col-span-4';
                  } else if (index % 5 === 2) {
                    gridClass = 'lg:col-span-7';
                  } else if (index % 5 === 3) {
                    gridClass = 'lg:col-span-5';
                  } else if (index % 5 === 4) {
                    gridClass = 'lg:col-span-6';
                  } else {
                    gridClass = 'lg:col-span-6';
                  }

                  return (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={handleProjectClick}
                      index={index}
                      gridClass={gridClass}
                      hoveredId={hoveredId}
                      setHoveredId={setHoveredId}
                      t={t}
                    />
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="mt-32 text-center">
                <div className="inline-block mb-8">
                  <div className="w-16 h-1 bg-black"></div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  {t('portfolio.cta.title')}
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('portfolio.cta.subtitle')}
                </p>
                <a
                  href="/contact"
                  className="group inline-flex items-center gap-4 text-xl font-bold text-black hover:gap-6 transition-all duration-300"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {t('portfolio.cta.button')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          t={t}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Project Card - Style minimaliste v-p.com
const ProjectCard = ({ project, onClick, index, gridClass, hoveredId, setHoveredId, t }) => {
  const projectImage = project.cover_photo;
  const isHero = index === 0;
  
  const additionalImages = [1, 2, 3, 4, 5, 6, 7, 8].filter(
    (num) => project[`image_${num}`]
  ).length;

  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => setHoveredId(project.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`group relative cursor-pointer ${gridClass}`}
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="relative bg-white border-2 border-gray-200 hover:border-black rounded-2xl overflow-hidden transition-all duration-500 h-full hover:-translate-y-1 hover:shadow-2xl">
        
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 ${isHero ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          {projectImage ? (
            <img
              src={projectImage}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Briefcase className="w-16 h-16 text-gray-300" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Badge images count */}
          {additionalImages > 0 && (
            <div className="absolute top-4 right-4">
              <div className="px-3 py-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-2">
                <span>+{additionalImages}</span>
              </div>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-bold text-sm uppercase tracking-wider">{t('portfolio.card.view')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`font-bold text-black mb-2 leading-tight group-hover:underline underline-offset-4 transition-all ${
            isHero ? 'text-2xl md:text-3xl' : 'text-xl'
          }`} style={{ fontFamily: "'Creato Display', sans-serif" }}>
            {project.title}
          </h3>
          
          {project.description && (
            <p className="text-gray-600 line-clamp-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

// Modal - Style épuré
const ProjectModal = ({ project, onClose, currentImageIndex, setCurrentImageIndex, t }) => {
  const allImages = [
    project.cover_photo,
    ...([1, 2, 3, 4, 5, 6, 7, 8]
      .map(num => project[`image_${num}`])
      .filter(Boolean))
  ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div
      className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="fixed top-8 right-8 w-16 h-16 bg-black hover:bg-gray-800 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-50 shadow-2xl"
        onClick={onClose}
        aria-label={t('portfolio.modal.close')}
      >
        <X size={28} className="text-white" />
      </button>

      <div
        className="max-w-6xl mx-auto px-6 lg:px-12 py-24 md:py-32"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-10 leading-tight" style={{ fontFamily: "'Creato Display', sans-serif" }}>
          {project.title}
        </h1>

        {/* Main Image */}
        {allImages.length > 0 && (
          <div className="mb-12">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200" style={{ minHeight: '500px', maxHeight: '70vh' }}>
              <img
                src={allImages[currentImageIndex]}
                alt={`${project.title} - ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-black backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-7 h-7 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-black backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-7 h-7 text-white" />
                  </button>
                  
                  {/* Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/80 backdrop-blur-md rounded-full">
                    <span className="text-white font-bold">
                      {currentImageIndex + 1} / {allImages.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-black ring-2 ring-black/30 scale-105' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="mb-12">
            <div className="w-24 h-1 bg-black mb-6"></div>
            <h2 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t('portfolio.modal.description')}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {project.description}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="pt-12 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-black" />
            <h3 className="text-xl font-bold text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
              {t('portfolio.modal.cta.title')}
            </h3>
          </div>
          <p className="text-gray-600 mb-6 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('portfolio.modal.cta.subtitle')}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('portfolio.modal.cta.button')}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;