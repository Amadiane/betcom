import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  PlusCircle,
  Image as ImageIcon,
  Loader2,
  Edit2,
  Trash2,
  X,
  Check,
  Save,
  RefreshCw,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const PortfolioPost = () => {
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  // FORM STATES
  const [title_fr, setTitleFr] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [description_fr, setDescriptionFr] = useState("");
  const [description_en, setDescriptionEn] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [images, setImages] = useState(Array(20).fill(null)); // image_1 à image_20
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // UI STATES
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // CLOUDINARY UPLOAD
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const uploaded = await uploadRes.json();
    if (uploaded.secure_url) return uploaded.secure_url;

    console.error("Cloudinary upload failed:", uploaded);
    return null;
  };

  // CREATE OR UPDATE PORTFOLIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload cover photo
      const cover_photo_url = await uploadImageToCloudinary(coverPhoto);

      // Upload images_1..20
      const images_urls = await Promise.all(
        images.map((img) => uploadImageToCloudinary(img))
      );

      // FormData pour le POST (backend attend multipart/form-data)
      const formData = new FormData();
      formData.append("title_fr", title_fr);
      formData.append("title_en", title_en);
      formData.append("description_fr", description_fr);
      formData.append("description_en", description_en);
      formData.append("is_active", isActive);

      if (coverPhoto) formData.append("cover_photo", coverPhoto);

      images.forEach((img, idx) => {
        if (img) formData.append(`image_${idx + 1}`, img);
      });

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/portfolio/${editingId}/`
        : `${CONFIG.BASE_URL}/api/portfolio/`;

      const res = await fetch(url, {
        method,
        body: formData, // Important: multipart/form-data
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      await fetchPortfolio();
      resetForm();
      setShowForm(false);
      setShowList(true);
    } catch (error) {
      console.error("SAVE ERROR:", error);
    }

    setLoading(false);
  };

  // DELETE PORTFOLIO
  const deletePortfolio = async (id) => {
    if (!window.confirm("Supprimer ce portfolio ?")) return;

    try {
      await fetch(`${CONFIG.BASE_URL}/api/portfolio/${id}/`, {
        method: "DELETE",
      });
      await fetchPortfolio();
      setSelectedPortfolio(null);
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // EDIT PORTFOLIO
  const editPortfolio = (item) => {
    setEditingId(item.id);
    setTitleFr(item.title_fr);
    setTitleEn(item.title_en);
    setDescriptionFr(item.description_fr);
    setDescriptionEn(item.description_en);
    setIsActive(item.is_active !== undefined ? item.is_active : true);
    setShowForm(true);
    setShowList(false);
  };

  // RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setTitleFr("");
    setTitleEn("");
    setDescriptionFr("");
    setDescriptionEn("");
    setCoverPhoto(null);
    setImages(Array(20).fill(null));
    setIsActive(true);
  };

  // PAGINATION LOGIC
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
          <h1 className="text-3xl font-black">Gestion des Portfolios</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchPortfolio}
              disabled={loading}
              className="px-4 py-2 bg-white border rounded-xl"
            >
              Actualiser
            </button>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  resetForm();
                  setShowList(false);
                } else {
                  setShowList(true);
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl"
            >
              {showForm ? "Fermer" : "Nouveau Portfolio"}
            </button>
          </div>
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Titre FR"
                  value={title_fr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Titre EN"
                  value={title_en}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <textarea
                  placeholder="Description FR"
                  value={description_fr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  className="border p-2 rounded"
                />
                <textarea
                  placeholder="Description EN"
                  value={description_en}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="font-semibold">Cover Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverPhoto(e.target.files[0])}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {images.map((img, idx) => (
                  <div key={idx}>
                    <label>Image {idx + 1}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImages((prev) => {
                          const copy = [...prev];
                          copy[idx] = e.target.files[0];
                          return copy;
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <span>Portfolio actif</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl"
              >
                {loading ? "Enregistrement..." : editingId ? "Mettre à jour" : "Créer"}
              </button>
            </form>
          </div>
        )}

        {/* LISTE DES PORTFOLIOS */}
        {showList && (
          <div className="grid gap-6">
            {currentItems.map((item) => (
              <div key={item.id} className="border rounded p-4 shadow">
                <h2 className="font-bold">{item.title_fr}</h2>
                <p>{item.description_fr}</p>
                {/* Cover photo */}
                {item.cover_photo_url && (
                  <img
                    src={item.cover_photo_url}
                    alt={item.title_fr}
                    className="w-48 h-48 object-cover rounded-lg mt-2"
                  />
                )}
                {/* Images 1 à 20 */}
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {Array.from({ length: 20 }, (_, idx) => {
                    const key = `image_${idx + 1}_url`;
                    return item[key] ? (
                      <img
                        key={idx}
                        src={item[key]}
                        alt={`Image ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : null;
                  })}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editPortfolio(item)}>
                    <Edit2 /> Modifier
                  </button>
                  <button onClick={() => deletePortfolio(item.id)}>
                    <Trash2 /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPost;
