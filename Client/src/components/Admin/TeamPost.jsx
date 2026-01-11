import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Users, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight, Image as ImageIcon,
  Check, Sparkles, Archive, Mail, Linkedin, Briefcase, UserCircle, Crown
} from "lucide-react";

/**
 * 🎨 TEAM BETCOM - ULTRA MODERNE
 * Charte: Noir #000000, Gris #1d1d1b, Blanc #ffffff
 * Typographie: Creato Display (titres) + Poppins (corps)
 * Style: Minimaliste, professionnel, architecture/ingénierie
 */

const TeamPost = () => {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    position_fr: "",
    position_en: "",
    bio_fr: "",
    bio_en: "",
    photo: null,
    email: "",
    linkedin: "",
    role: "membre",
    is_leader: false,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const NAVADMIN_HEIGHT = 80;
  const SCROLL_OFFSET = 20;

  const scrollToForm = () => {
    setTimeout(() => {
      window.scrollTo({ 
        top: NAVADMIN_HEIGHT + SCROLL_OFFSET,
        behavior: "smooth" 
      });
    }, 100);
  };

  const fetchMembres = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_TEAM_LIST}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setMembres(data.results || data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      position_fr: "",
      position_en: "",
      bio_fr: "",
      bio_en: "",
      photo: null,
      email: "",
      linkedin: "",
      role: "membre",
      is_leader: false,
      is_active: true,
    });
    setPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.photo && typeof formData.photo !== "string") {
        imageUrl = await uploadToCloudinary(formData.photo);
      } else if (typeof formData.photo === "string") {
        imageUrl = formData.photo;
      }

      const payload = { ...formData, photo: imageUrl };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? CONFIG.API_TEAM_UPDATE(editingId) : CONFIG.API_TEAM_CREATE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage("✓ Enregistré avec succès");
      resetForm();
      await fetchMembres();
      setShowForm(false);
      setShowList(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (membre) => {
    setFormData({
      full_name: membre.full_name,
      position_fr: membre.position_fr,
      position_en: membre.position_en,
      bio_fr: membre.bio_fr,
      bio_en: membre.bio_en,
      email: membre.email,
      linkedin: membre.linkedin,
      role: membre.role,
      is_leader: membre.is_leader,
      is_active: membre.is_active,
      photo: membre.photo,
    });
    setPreview(membre.photo_url);
    setEditingId(membre.id);
    setShowForm(true);
    setShowList(false);
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      await fetch(CONFIG.API_TEAM_DELETE(id), { method: "DELETE" });
      setSuccessMessage("✓ Membre supprimé");
      await fetchMembres();
      setSelectedMember(null);
      setSelectedCards([]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const toggleCardSelection = (id) => {
    setSelectedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) return;
    if (!window.confirm(`Supprimer ${selectedCards.length} membre(s) ?`)) return;

    for (const id of selectedCards) {
      try {
        await fetch(CONFIG.API_TEAM_DELETE(id), { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    }
    
    setSuccessMessage(`✓ ${selectedCards.length} membre(s) supprimé(s)`);
    setSelectedCards([]);
    await fetchMembres();
  };

  // Filtrer et trier
  const filteredMembres = membres
    .filter(membre => {
      if (filterStatus === 'active' && !membre.is_active) return false;
      if (filterStatus === 'inactive' && membre.is_active) return false;
      if (filterRole === 'dirigeant' && membre.role !== 'dirigeant') return false;
      if (filterRole === 'membre' && membre.role !== 'membre') return false;
      return true;
    })
    .sort((a, b) => {
      // Leaders en premier
      if (a.is_leader && !b.is_leader) return -1;
      if (!a.is_leader && b.is_leader) return 1;
      // Puis par date de création (plus ancien en premier)
      if (a.created_at && b.created_at) {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return a.id - b.id;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembres.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Chargement de l'équipe...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative pb-32">
      
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-6 py-12">
        
        {/* HEADER MINIMALISTE */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-6xl font-bold text-black mb-3 tracking-tight" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                Notre Équipe
              </h1>
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {filteredMembres.length} {filteredMembres.length > 1 ? 'membres' : 'membre'} · Excellence et expertise
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchMembres}
                disabled={loading}
                className="p-3 bg-white border-2 border-black hover:bg-black hover:text-white rounded-lg transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setShowList(false);
                  resetForm();
                  scrollToForm();
                }}
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Ajouter un membre</span>
              </button>
            </div>
          </div>

          {/* FILTRES MINIMALISTES */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'all' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterStatus === 'active' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Check className="w-4 h-4" />
                Actifs
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'inactive' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Inactifs
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterRole === 'all' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Tous les rôles
              </button>
              <button
                onClick={() => setFilterRole('dirigeant')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterRole === 'dirigeant' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Crown className="w-4 h-4" />
                Dirigeants
              </button>
              <button
                onClick={() => setFilterRole('membre')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterRole === 'membre' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-black'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Membres
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg flex items-center gap-3">
            <div className="flex-1 text-red-800 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X size={18} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-r-lg flex items-center gap-3">
            <div className="flex-1 text-green-800 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {successMessage}
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
              <X size={18} />
            </button>
          </div>
        )}

        {/* DRAWER FORM */}
        {showForm && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
              onClick={() => { 
                setShowForm(false); 
                setShowList(true); 
                resetForm(); 
              }}
            ></div>
            <div className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-white border-l-2 border-black z-50 overflow-y-auto animate-slide-in">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
                  <h3 className="text-3xl font-bold text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {editingId ? "Modifier" : "Nouveau membre"}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowForm(false); 
                      setShowList(true); 
                      resetForm(); 
                    }} 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6 text-black" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Nom complet *
                    </label>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleChange} 
                      placeholder="Jean Dupont" 
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all" 
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Briefcase className="w-4 h-4" />
                        Poste (FR)
                      </label>
                      <input 
                        type="text" 
                        name="position_fr" 
                        value={formData.position_fr} 
                        onChange={handleChange} 
                        placeholder="Directeur Général" 
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all" 
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Position (EN)
                      </label>
                      <input 
                        type="text" 
                        name="position_en" 
                        value={formData.position_en} 
                        onChange={handleChange} 
                        placeholder="CEO" 
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all" 
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Biographie (FR)
                    </label>
                    <textarea 
                      name="bio_fr" 
                      value={formData.bio_fr} 
                      onChange={handleChange} 
                      rows="4" 
                      placeholder="Biographie du membre en français..."
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all resize-none" 
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Biography (EN)
                    </label>
                    <textarea 
                      name="bio_en" 
                      value={formData.bio_en} 
                      onChange={handleChange} 
                      rows="4" 
                      placeholder="Member biography in English..."
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all resize-none" 
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="email@betcom.com" 
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all" 
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </label>
                      <input 
                        type="url" 
                        name="linkedin" 
                        value={formData.linkedin} 
                        onChange={handleChange} 
                        placeholder="https://linkedin.com/in/..." 
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all" 
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Rôle
                    </label>
                    <select 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:border-black transition-all"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <option value="membre">Membre</option>
                      <option value="dirigeant">Dirigeant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Photo
                    </label>
                    {preview ? (
                      <div className="relative group rounded-lg overflow-hidden border-2 border-gray-300">
                        <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                        <button 
                          type="button" 
                          onClick={() => { 
                            setPreview(null); 
                            setFormData({ ...formData, photo: null }); 
                          }} 
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-8 h-8 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="block h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-black cursor-pointer bg-gray-50 transition-all">
                        <div className="h-full flex flex-col items-center justify-center gap-3">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Cliquez pour ajouter une photo
                          </span>
                        </div>
                        <input 
                          type="file" 
                          name="photo" 
                          accept="image/*" 
                          onChange={handleChange} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-all">
                      <input 
                        type="checkbox" 
                        name="is_leader" 
                        checked={formData.is_leader} 
                        onChange={handleChange} 
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                      />
                      <span className="font-semibold text-black flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Crown className="w-4 h-4" />
                        Membre dirigeant
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-black transition-all">
                      <input 
                        type="checkbox" 
                        name="is_active" 
                        checked={formData.is_active} 
                        onChange={handleChange} 
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                      />
                      <span className="font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Membre actif
                      </span>
                      {formData.is_active && (
                        <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full px-6 py-4 bg-black hover:bg-gray-800 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{editingId ? "Mettre à jour" : "Créer"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* GRID */}
        {showList && (
          <>
            {loading ? (
              <div className="flex justify-center py-32">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-32">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                  Aucun membre
                </h3>
                <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Commencez par ajouter votre premier membre d'équipe
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentItems.map((membre) => {
                    const isSelected = selectedCards.includes(membre.id);
                    return (
                      <div key={membre.id}>
                        <div 
                          className={`group relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'border-black shadow-xl' 
                              : 'border-gray-200 hover:border-black hover:shadow-lg'
                          }`} 
                          onClick={() => toggleCardSelection(membre.id)}
                        >
                          {/* Image container */}
                          <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
                            {membre.photo_url ? (
                              <img 
                                src={membre.photo_url} 
                                alt={membre.full_name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                onError={(e) => { e.target.style.display = 'none'; }} 
                              />
                            ) : (
                              <UserCircle className="w-32 h-32 text-gray-400" />
                            )}
                            
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* Selection checkbox */}
                            <div className="absolute top-3 left-3">
                              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-black border-black' 
                                  : 'bg-white/80 border-white backdrop-blur-sm'
                              }`}>
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                              </div>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              {membre.is_leader && (
                                <span className="px-3 py-1 bg-black/90 backdrop-blur-sm text-white rounded text-xs font-bold flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  Leader
                                </span>
                              )}
                              {membre.is_active ? (
                                <span className="px-3 py-1 bg-green-600/90 backdrop-blur-sm text-white rounded text-xs font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-600/90 backdrop-blur-sm text-white rounded text-xs font-bold">
                                  <Archive className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="text-xl font-bold text-black mb-1 line-clamp-1" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                              {membre.full_name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              {membre.position_fr || membre.position_en}
                            </p>
                            {membre.email && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span className="truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  {membre.email}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Hover actions */}
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/95 via-black/90 to-transparent">
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedMember(membre); 
                                }} 
                                className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded text-sm font-semibold transition-all"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                              >
                                <Eye size={16} className="mx-auto" />
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleEdit(membre); 
                                }} 
                                className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded text-sm font-semibold transition-all"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                              >
                                <Edit2 size={16} className="mx-auto" />
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleDelete(membre.id); 
                                }} 
                                className="px-3 py-2 bg-red-600/80 hover:bg-red-700/90 backdrop-blur-sm border border-red-500/40 text-white rounded transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION MINIMALISTE */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1} 
                      className="p-3 bg-white border-2 border-gray-300 rounded-lg text-black hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button 
                          key={pageNumber} 
                          onClick={() => handlePageChange(pageNumber)} 
                          className={`px-5 py-3 rounded-lg font-bold transition-all ${
                            currentPage === pageNumber 
                              ? "bg-black text-white" 
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-black"
                          }`}
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages} 
                      className="p-3 bg-white border-2 border-gray-300 rounded-lg text-black hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* FLOATING BAR - Design minimaliste */}
      {selectedCards.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-white border-2 border-black rounded-xl shadow-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                <Check className="w-5 h-5 text-black" />
                <span className="font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedCards.length} sélectionné{selectedCards.length > 1 ? 's' : ''}
                </span>
              </div>
              <button 
                onClick={handleBulkDelete} 
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Trash2 className="w-5 h-5" />
                <span>Supprimer</span>
              </button>
              <button 
                onClick={() => setSelectedCards([])} 
                className="p-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DÉTAILS - Design minimaliste */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center px-4 z-[9999]" 
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="bg-white border-2 border-black w-full max-w-4xl rounded-xl overflow-hidden max-h-[90vh] flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b-2 border-gray-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Creato Display', sans-serif" }}>
                    {selectedMember.full_name}
                  </h2>
                  {selectedMember.is_leader && (
                    <Crown className="w-6 h-6 text-black" />
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {selectedMember.position_fr || selectedMember.position_en}
                </p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    selectedMember.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedMember.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedMember.role === 'dirigeant' ? 'Dirigeant' : 'Membre'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              {selectedMember.photo_url && (
                <div className="mb-8 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={selectedMember.photo_url} 
                    className="w-full h-96 object-cover" 
                    alt={selectedMember.full_name} 
                  />
                </div>
              )}

              {selectedMember.bio_fr && (
                <div className="mb-6 p-6 bg-gray-50 border-l-4 border-black rounded-r-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Biographie (FR)
                  </p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedMember.bio_fr}
                  </p>
                </div>
              )}

              {selectedMember.bio_en && (
                <div className="mb-6 p-6 bg-gray-50 border-l-4 border-black rounded-r-lg">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Biography (EN)
                  </p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {selectedMember.bio_en}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {selectedMember.email && (
                  <a 
                    href={`mailto:${selectedMember.email}`} 
                    className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Mail className="w-5 h-5" />
                    {selectedMember.email}
                  </a>
                )}
                {selectedMember.linkedin && (
                  <a 
                    href={selectedMember.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slide-up {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default TeamPost;