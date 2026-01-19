import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../config/config";

const Projects = ({ lang = "en" }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PROJECTS (inspiré de Portfolio.jsx)
  // =========================
  useEffect(() => {
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
        setFilteredProjects(activeProjects);
      } catch (err) {
        console.error('Fetch error:', err);
        // En cas d'erreur, on laisse le tableau vide
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // =========================
  // FILTER
  // =========================
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  const categories = [
    "all",
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ];

  // =========================
  // HELPER FUNCTION (inspiré de Portfolio.jsx)
  // =========================
  const getText = (project, field) => {
    if (!project) return '';
    return lang === 'fr' 
      ? (project[`${field}_fr`] || project[`${field}_en`] || '')
      : (project[`${field}_en`] || project[`${field}_fr`] || '');
  };

  // =========================
  // LOADING STATE (inspiré de Portfolio.jsx)
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* ========================= */}
      {/* INLINE CSS */}
      {/* ========================= */}
      <style>{`
        .projects-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .projects-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 50px;
          justify-content: center;
        }

        .projects-filter button {
          padding: 12px 24px;
          border: 2px solid #000;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .projects-filter button:hover {
          background: #000;
          color: #fff;
          transform: translateY(-2px);
        }

        .projects-filter button.active {
          background: #000;
          color: #fff;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 40px;
        }

        .project-card {
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
        }

        .project-image {
          overflow: hidden;
          background: #f5f5f5;
          position: relative;
          padding-bottom: 75%; /* Ratio 4:3 */
        }

        .project-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.1);
        }

        .project-info {
          margin-top: 20px;
          padding: 0 4px;
        }

        .project-info h3 {
          margin: 0 0 8px 0;
          font-size: 22px;
          font-weight: 700;
          color: #000;
          line-height: 1.3;
          font-family: 'Creato Display', sans-serif;
        }

        .project-info p {
          margin: 0;
          font-size: 15px;
          color: #666;
          font-weight: 400;
          font-family: 'Poppins', sans-serif;
        }

        .no-projects {
          text-align: center;
          padding: 80px 20px;
          color: #666;
        }

        .no-projects h3 {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          margin-bottom: 12px;
          font-family: 'Creato Display', sans-serif;
        }

        .no-projects p {
          font-size: 16px;
          font-family: 'Poppins', sans-serif;
        }

        .reset-button {
          margin-top: 24px;
          padding: 12px 24px;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .reset-button:hover {
          background: #333;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
          }

          .projects-container {
            padding: 40px 20px;
          }
        }

        @media (max-width: 480px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="projects-container">
        
        {/* ========================= */}
        {/* FILTER (si des projets existent) */}
        {/* ========================= */}
        {projects.length > 0 && (
          <div className="projects-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={cat === selectedCategory ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All Projects" : cat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}

        {/* ========================= */}
        {/* NO PROJECTS - État global */}
        {/* ========================= */}
        {projects.length === 0 ? (
          <div className="no-projects">
            <h3>📂 No projects available</h3>
            <p>No active projects found at the moment.</p>
            <p style={{ fontSize: "14px", marginTop: "12px", color: "#999" }}>
              Make sure your backend is running and projects are marked as active.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* ========================= */
          /* NO FILTERED PROJECTS */
          /* ========================= */
          <div className="no-projects">
            <h3>No projects in this category</h3>
            <p>No projects found in: <strong>{selectedCategory}</strong></p>
            <button 
              className="reset-button"
              onClick={() => setSelectedCategory("all")}
            >
              Show All Projects
            </button>
          </div>
        ) : (
          /* ========================= */
          /* PROJECTS GRID */
          /* ========================= */
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const title = getText(project, 'project_name') || `Project ${project.id}`;
              const location = getText(project, 'location');
              
              // Gérer différents noms de champs pour l'image (comme dans Portfolio.jsx)
              const cover = project.cover_photo_url 
                || project.cover_photo 
                || project.image_1_url 
                || "/placeholder.jpg";

              return (
                <div 
                  className="project-card" 
                  key={project.id}
                  onClick={() => navigate(`/portfolio/${project.id}`)}
                >
                  <div className="project-image">
                    <img 
                      src={cover} 
                      alt={title}
                      onError={(e) => {
                        console.error("❌ Image failed to load:", cover);
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

                  <div className="project-info">
                    <h3>{title}</h3>
                    {location && <p>{location}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;