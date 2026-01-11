import { useState, useEffect } from "react";
import CONFIG from "../../config/config.js";
import {
  PlusCircle, Image as ImageIcon, Loader2, Edit2, Trash2, X, Eye, Save, RefreshCw,
  Calendar, Check, ChevronLeft, ChevronRight
} from "lucide-react";

const PortfolioPost = () => {
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FORM STATES
  const [title_fr, setTitleFr] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [description_fr, setDescriptionFr] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);

  // Supplementary images (image_1 -> image_20)
  const [imagesFiles, setImagesFiles] = useState({});

  // FETCH PORTFOLIO
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/portfolio/`);
      const data = await res.json();
      setPortfolioList(data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setTitleFr("");
    setTitleEn("");
    setDescriptionFr("");
    setDescriptionEn("");
    setIsActive(true);
    setCoverPhotoFile(null);
    setImagesFiles({});
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title_fr", title_fr);
      formData.append("title_en", title_en);
      formData.append("description_fr", description_fr);
      formData.append("description_en", description_en);
      formData.append("is_active", isActive);

      if (coverPhotoFile) {
        formData.append("cover_photo", coverPhotoFile);
      }

      // Ajouter les images supplémentaires
      Object.keys(imagesFiles).forEach((key) => {
        if (imagesFiles[key]) {
          formData.append(key, imagesFiles[key]);
        }
      });

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/portfolio/${editingId}/`
        : `${CONFIG.BASE_URL}/api/portfolio/`;

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      console.log("SUCCESS:", data);

      await fetchPortfolio();
      resetForm();
      setShowForm(false);
      setShowList(true);
    } catch (error) {
      console.error("SAVE ERROR:", error);
    }

    setLoading(false);
  };

  // DELETE
  const deletePortfolio = async (id) => {
    if (!window.confirm("Supprimer ce portfolio ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/portfolio/${id}/`, { method: "DELETE" });
      await fetchPortfolio();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // EDIT
  const editPortfolio = (item) => {
    setEditingId(item.id);
    setTitleFr(item.title_fr);
    setTitleEn(item.title_en);
    setDescriptionFr(item.description_fr);
    setDescriptionEn(item.description_en);
    setIsActive(item.is_active);
    setShowForm(true);
    setShowList(false);
  };

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolioList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(portfolioList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black">Gestion du Portfolio</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchPortfolio}
              disabled={loading}
              className="px-4 py-2 border rounded-xl"
            >
              {loading ? "Chargement..." : "Actualiser"}
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) resetForm();
                setShowList(showForm);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl"
            >
              {showForm ? "Fermer" : "Nouveau Portfolio"}
            </button>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Titre (FR)"
                  value={title_fr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  required
                  className="border p-3 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Title (EN)"
                  value={title_en}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="border p-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <textarea
                  placeholder="Description (FR)"
                  value={description_fr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  className="border p-3 rounded-xl"
                  rows={4}
                />
                <textarea
                  placeholder="Description (EN)"
                  value={description_en}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="border p-3 rounded-xl"
                  rows={4}
                />
              </div>

              {/* Cover photo */}
              <div className="mb-6">
                <label className="font-semibold">Cover Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverPhotoFile(e.target.files[0])}
                  className="w-full border p-3 rounded-xl"
                />
                {coverPhotoFile && <p className="text-green-600 mt-1">{coverPhotoFile.name}</p>}
              </div>

              {/* Images supplémentaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i}>
                    <label>Image {i + 1}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImagesFiles((prev) => ({
                          ...prev,
                          [`image_${i + 1}`]: e.target.files[0],
                        }))
                      }
                      className="w-full border p-3 rounded-xl"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="w-5 h-5 accent-orange-500"
                />
                <label>Portfolio actif</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl"
              >
                {editingId ? "Mettre à jour" : "Créer Portfolio"}
              </button>
            </form>
          </div>
        )}

        {/* LIST */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl p-6">
            {loading ? (
              <p>Chargement...</p>
            ) : portfolioList.length === 0 ? (
              <p>Aucun portfolio pour le moment.</p>
            ) : (
              <div className="grid gap-6">
                {currentItems.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4 flex flex-col lg:flex-row gap-4">
                    {item.cover_photo && (
                      <img
                        src={item.cover_photo}
                        alt=""
                        className="w-full lg:w-48 h-48 object-cover rounded-xl"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold">{item.title_fr}</h3>
                      <p>{item.description_fr}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => editPortfolio(item)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deletePortfolio(item.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1 ? "bg-orange-500 text-white" : "border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPost;
