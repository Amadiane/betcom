// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://tekacom.onrender.com"; // ton URL backend Render

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,


 // 🏢 ABOUT / À PROPOS (CRUD)
  API_ABOUT_LIST: `${BASE_URL}/api/about/`,
  API_ABOUT_CREATE: `${BASE_URL}/api/about/`,
  API_ABOUT_UPDATE: (id) => `${BASE_URL}/api/about/${id}/`, // fonction qui retourne URL complète
  API_ABOUT_DELETE: (id) => `${BASE_URL}/api/about/${id}/`,


  
  // 👥 TEAM
  API_TEAM_LIST: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_CREATE: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_UPDATE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,
  API_TEAM_DELETE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,




  // Ajoute à ton CONFIG
API_TRACK: `${BASE_URL}/api/track/`, // 🔹 endpoint Django pour tracker les actions

// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dwuyq2eoz",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




