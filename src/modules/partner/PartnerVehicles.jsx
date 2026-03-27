import React, { useState, useEffect, useRef } from "react";
import api from "../../api/index.js";

const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const labelCls = "block font-body text-sm font-semibold text-neutralDark mb-1";

const empty = { title: "", description: "", dailyRate: "", category: "" };

export default function PartnerVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileRef = useRef(null);

  const fetchVehicles = () =>
    api.get("/vehicles?my=true").then((r) => setVehicles(r.data || [])).catch(console.error);

  useEffect(() => { fetchVehicles(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.title.trim()) return setError("Vehicle title is required");
    if (!form.dailyRate || isNaN(form.dailyRate)) return setError("Valid daily rate is required");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("dailyRate", form.dailyRate);
      if (form.category) data.append("category", form.category);
      if (imageFile) data.append("image", imageFile);

      await api.post("/vehicles", data, { headers: { "Content-Type": "multipart/form-data" } });

      setForm(empty);
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setSuccess("Vehicle added successfully!");
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (v) => {
    try {
      await api.patch(`/vehicles/${v.id}/delist`);
      fetchVehicles();
    } catch { }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-primary">My Fleet</h1>
        <p className="font-body text-sm text-gray-400 mt-1">Add and manage your vehicles</p>
      </div>

      {/* Add vehicle form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading text-lg font-bold text-primary mb-6">Add New Vehicle</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Vehicle Title <span className="text-accent">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} placeholder="e.g. Toyota Highlander 2022" />
          </div>

          <div>
            <label className={labelCls}>Daily Rate (₦) <span className="text-accent">*</span></label>
            <input name="dailyRate" type="number" value={form.dailyRate} onChange={handleChange} className={inputCls} placeholder="e.g. 35000" min="0" />
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
              <option value="">Select category</option>
              <option value="Saloon">Saloon</option>
              <option value="SUV">SUV</option>
              <option value="Luxury Sedan">Luxury Sedan</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Vehicle Image</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <div
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-blue-50 transition"
            >
              {imagePreview
                ? <img src={imagePreview} className="h-12 w-16 object-cover rounded" alt="preview" />
                : <span className="text-gray-400 font-body text-sm">📷 Click to upload image</span>}
              {imageFile && <span className="font-body text-xs text-gray-500 truncate">{imageFile.name}</span>}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className={`${inputCls} h-24 resize-none`} placeholder="Describe the vehicle — features, condition, capacity..." />
          </div>

          {error && <p className="md:col-span-2 text-red-500 text-sm font-body bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="md:col-span-2 text-green-600 text-sm font-body bg-green-50 px-4 py-2 rounded-lg">✅ {success}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white font-heading font-bold px-8 py-3 rounded-xl hover:bg-blue-900 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "+ Add Vehicle"}
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle list */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading text-lg font-bold text-primary mb-6">
          Your Vehicles <span className="text-gray-400 font-body text-sm font-normal">({vehicles.length})</span>
        </h2>

        {vehicles.length === 0 ? (
          <p className="font-body text-sm text-gray-400 py-8 text-center">No vehicles yet. Add one above!</p>
        ) : (
          <div className="grid gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition">
                {v.imageUrl
                  ? <img src={v.imageUrl} alt={v.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
                  : <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">🚗</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-primary truncate">{v.title}</p>
                  <p className="font-body text-sm text-gray-500">₦{Number(v.dailyRate).toLocaleString()}/day</p>
                  {v.description && <p className="font-body text-xs text-gray-400 truncate mt-1">{v.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold font-body
                    ${v.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {v.available ? "Available" : "Unavailable"}
                  </span>
                  <button
                    onClick={() => toggleAvailability(v)}
                    className="font-body text-xs text-gray-400 hover:text-primary underline"
                  >
                    {v.available ? "Delist" : "Relist"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
