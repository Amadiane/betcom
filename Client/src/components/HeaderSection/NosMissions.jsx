import { useEffect, useState } from "react";
import axios from "axios";
import CONFIG from "../../config/config.js";

const NosMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH MISSIONS =================
  const fetchMissions = async () => {
    try {
      const res = await axios.get(CONFIG.API_ABOUT_LIST);
      if (Array.isArray(res.data)) {
        setMissions(res.data);
      } else {
        setMissions([]);
        console.warn("Les données reçues ne sont pas un tableau :", res.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des missions :", error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // ================= RENDER =================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#000000] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune mission disponible</h3>
          <p className="text-gray-500">Le contenu sera bientôt disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#1d1d1b] to-[#000000] py-24 px-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-bold uppercase tracking-[0.2em]">
              Notre Excellence
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            À Propos de BETCOM AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Architecture, Ingénierie & Innovation
          </p>

          {/* Decorative Line */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white/50"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {missions.map((mission, index) => (
          <div key={mission.id} className="mb-32 last:mb-0">
            {/* HISTORIQUE - Full Width Hero */}
            {mission.historique_title_fr && (
              <div className="mb-20">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-2xl group">
                  {mission.historique_image_url && (
                    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
                      <img
                        src={mission.historique_image_url}
                        alt={mission.historique_title_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                        <div className="max-w-4xl">
                          <div className="inline-block px-5 py-2 bg-white/95 backdrop-blur-sm rounded-xl mb-6">
                            <span className="text-[#000000] font-bold text-sm uppercase tracking-widest">
                              Historique
                            </span>
                          </div>
                          
                          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                            {mission.historique_title_fr}
                          </h2>
                          
                          {mission.historique_title_en && (
                            <p className="text-xl text-white/80 font-light italic mb-6">
                              {mission.historique_title_en}
                            </p>
                          )}
                          
                          <div className="w-20 h-1 bg-white/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Description Section */}
                  <div className="p-10 md:p-16 bg-white">
                    <div className="max-w-4xl">
                      <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6 font-light">
                        {mission.historique_description_fr}
                      </p>
                      
                      {mission.historique_description_en && (
                        <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-[#1d1d1b] pl-6 py-3">
                          {mission.historique_description_en}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISION - Side by Side Layout */}
            {mission.vision_title_fr && (
              <div className="mb-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Image */}
                  {mission.vision_image_url && (
                    <div className="order-2 md:order-1 relative overflow-hidden rounded-3xl shadow-2xl group h-[400px] md:h-[500px]">
                      <img
                        src={mission.vision_image_url}
                        alt={mission.vision_title_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/20 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="order-1 md:order-2 space-y-6">
                    <div className="inline-block px-5 py-2 bg-gradient-to-r from-[#000000] to-[#1d1d1b] rounded-xl">
                      <span className="text-white font-bold text-sm uppercase tracking-widest">
                        Vision & Mission
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-[#000000] tracking-tight leading-tight">
                      {mission.vision_title_fr}
                    </h2>
                    
                    {mission.vision_title_en && (
                      <p className="text-lg text-gray-500 font-light italic">
                        {mission.vision_title_en}
                      </p>
                    )}
                    
                    <div className="w-16 h-1 bg-gradient-to-r from-[#000000] to-[#1d1d1b] rounded-full"></div>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {mission.vision_description_fr}
                    </p>
                    
                    {mission.vision_description_en && (
                      <p className="text-base text-gray-600 leading-relaxed italic border-l-4 border-gray-300 pl-6 py-3">
                        {mission.vision_description_en}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ORGANISATION - Reverse Layout */}
            {mission.organisation_title_fr && (
              <div className="mb-20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className="space-y-6">
                    <div className="inline-block px-5 py-2 bg-gradient-to-r from-[#000000] to-[#1d1d1b] rounded-xl">
                      <span className="text-white font-bold text-sm uppercase tracking-widest">
                        Organisation
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-[#000000] tracking-tight leading-tight">
                      {mission.organisation_title_fr}
                    </h2>
                    
                    {mission.organisation_title_en && (
                      <p className="text-lg text-gray-500 font-light italic">
                        {mission.organisation_title_en}
                      </p>
                    )}
                    
                    <div className="w-16 h-1 bg-gradient-to-r from-[#000000] to-[#1d1d1b] rounded-full"></div>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {mission.organisation_description_fr}
                    </p>
                    
                    {mission.organisation_description_en && (
                      <p className="text-base text-gray-600 leading-relaxed italic border-l-4 border-gray-300 pl-6 py-3">
                        {mission.organisation_description_en}
                      </p>
                    )}
                  </div>
                  
                  {/* Image */}
                  {mission.organisation_image_url && (
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl group h-[400px] md:h-[500px]">
                      <img
                        src={mission.organisation_image_url}
                        alt={mission.organisation_title_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/20 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DIRECTION - Featured Card */}
            {mission.direction_title_fr && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black shadow-2xl">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {mission.direction_image_url && (
                    <div className="relative overflow-hidden h-[400px] md:h-[600px]">
                      <img
                        src={mission.direction_image_url}
                        alt={mission.direction_title_fr}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-10 md:p-16 flex flex-col justify-center">
                    <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-xl mb-6 self-start">
                      <span className="text-white font-bold text-sm uppercase tracking-widest">
                        Message de la Direction
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                      {mission.direction_title_fr}
                    </h2>
                    
                    {mission.direction_title_en && (
                      <p className="text-xl text-white/70 font-light italic mb-8">
                        {mission.direction_title_en}
                      </p>
                    )}
                    
                    <div className="w-16 h-1 bg-white/60 rounded-full mb-8"></div>
                    
                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      {mission.direction_message_fr}
                    </p>
                    
                    {mission.direction_message_en && (
                      <p className="text-base text-white/70 leading-relaxed italic border-l-4 border-white/30 pl-6 py-3">
                        {mission.direction_message_en}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#000000] to-[#1d1d1b] py-20 px-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Une équipe, une culture, l'excellence
          </h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            BETCOM AI - Architecture & Ingénierie
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-white/50"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NosMissions;