import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiPencilAlt } from 'react-icons/hi';
import Uploader from '../Uploader';

import { snackService, imageService } from '../../api/services';

function EditSnacksModal({ isOpen, onClose, snack, refreshSnacks }) {
  const [snackName, setSnackName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [description, setDescription] = useState("");
  const [varieties, setVarieties] = useState([]); // القائمة المنسدلة
  const [selectedVariety, setSelectedVariety] = useState("");
  const [snakVariants, setSnakVariants] = useState([{ size: "", price: "" }]);
  const [imageId, setImageId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // جلب بيانات السناك عند الفتح
  useEffect(() => {
    if (snack && snack.id) {
      setLoading(true);
      snackService.getSnackById(snack.id)
        .then((res) => {
          const snackData = res.data?.data;
          if (!snackData) return;
          setSnackName(snackData.englishName || "");
          setArabicName(snackData.arabicName || "");
          setDescription(snackData.description || "");
          setSelectedVariety(snackData.type || "");
          setImageId(snackData.image?.id || null);
          setImagePreview(snackData.image?.url ? `http://cinemate-001-site1.jtempurl.com/${snackData.image.url}` : null);
          const variants = Array.isArray(snackData.snakVariants) ? snackData.snakVariants : snackData.variants;
          setSnakVariants(Array.isArray(variants) && variants.length > 0 ? variants.map(v => ({ size: v.size, price: v.price })) : [{ size: '', price: '' }]);
        })
        .catch(() => setError("Failed to fetch snack info."))
        .finally(() => setLoading(false));
    }
  }, [snack]);

  // تحميل قائمة الأنواع
  useEffect(() => {
    setVarieties([
      { name: "Drink" },
      { name: "Snak" }
    ]);
  }, []);

  const handleVarietiesChange = (e) => {
    setSelectedVariety(e.target.value);
  };

  const handleVariantChange = (idx, field, value) => {
    setSnakVariants((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addVariant = () => {
    setSnakVariants((prev) => [...prev, { size: "", price: "" }]);
  };

  const removeVariant = (idx) => {
    setSnakVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    if (!file) return;
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("Image", file);
      formData.append("Title", "");
      formData.append("Url", "");
      const response = await imageService.uploadImage(formData);
      if (response?.data?.success && response.data?.data?.id) {
        setImageId(response.data.data.id);
      } else if (response?.data?.id) {
        setImageId(response.data.id);
      }
    } catch {
      setError("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSnack = async () => {
  console.log("[EditSnack] بدأ تنفيذ التعديل للسناك");
  console.log("[EditSnack] snack.id:", snack?.id);
  console.log("[EditSnack] snackName:", snackName);
  console.log("[EditSnack] selectedVariety:", selectedVariety);
  console.log("[EditSnack] imageId:", imageId);
  console.log("[EditSnack] snakVariants:", snakVariants);

    if (!snackName || !arabicName || !selectedVariety || !imageId) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        arabicName,
        englishName: snackName,
        description,
        imageId,
        type: selectedVariety,
        snakVariants: snakVariants.map(v => ({ size: v.size, price: Number(v.price) }))
      };
      console.log("[EditSnack] Payload being sent:", payload);
      const response = await snackService.updateSnack(snack.id, payload);
      console.log("[EditSnack] API response:", response);
      setSuccess("Snack updated successfully!");
      if (refreshSnacks) {
        console.log("[EditSnack] Calling refreshSnacks()...");
        refreshSnacks();
      }
      console.log("[EditSnack] Calling onClose()...");
      onClose();
    } catch (err) {
    let errorMsg = "Failed to update snack.";
    console.error("[EditSnack] Update error:", err);
    if (err && err.response) {
      console.error("[EditSnack] Error response:", err.response);
      console.error("[EditSnack] Error response data:", err.response.data);
      console.error("[EditSnack] Error response status:", err.response.status);
      console.error("[EditSnack] Error response statusText:", err.response.statusText);
      if (err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.errors) {
          errorMsg = JSON.stringify(err.response.data.errors);
        }
      }
    }
    setError(errorMsg);
  } finally {
      setLoading(false);
      console.log("[EditSnack] انتهى تنفيذ التعديل للسناك");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      style={{ top: '2%' }}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[95vw] max-w-2xl p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${isOpen ? 'scale-100' : 'scale-90'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Snack</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out"
          >
            <IoClose />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); handleEditSnack(); }}>
          <div className="w-full grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label>English Name</label>
              <input
                type="text"
                className="form-control w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                value={snackName}
                onChange={e => setSnackName(e.target.value)}
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter English Name"
              />
            </div>
            <div className="flex flex-col gap-2 text-border">
              <label htmlFor="Varieties" className="font-medium text-sm">
                Varieties
              </label>
              <select
                id="Varieties"
                value={selectedVariety}
                onChange={handleVarietiesChange}
                className="bg-main border border-border text-gray-400 rounded-2xl p-3 font-semibold text-sm transition-colors duration-300 hover:bg-dry hover:text-white"
              >
                <option value="">Select Varieties</option>
                {varieties.map((variety, index) => (
                  <option key={index} value={variety.name}>
                    {variety.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Snack Variants (Size/Price) */}
          <div className="w-full flex flex-col gap-4 border-2 border-beige3 rounded-2xl p-6 bg-main shadow-md mt-6">
            <label className="font-semibold text-base text-beige3 mb-2">Snack Price Variants</label>
            {snakVariants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                <div className="w-full md:col-span-5">
                  <input
                    placeholder="e.g. Large / Medium / Small"
                    type="text"
                    className="w-full p-3 bg-gray-800 rounded-xl text-sm"
                    value={variant.size}
                    onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                  />
                </div>
                <div className="w-full md:col-span-5">
                  <input
                    placeholder="Enter price"
                    type="number"
                    className="w-full p-3 bg-gray-800 rounded-xl text-sm"
                    value={variant.price}
                    onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex gap-2 justify-end">
                  {snakVariants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(idx)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-sm transition-all">Remove</button>
                  )}
                  {idx === snakVariants.length - 1 && (
                    <button
                      type="button"
                      onClick={addVariant}
                      className={`font-medium transitions border border-beige3 flex-rows gap-2 text-white py-2 px-8 rounded-2xl w-full sm:w-auto bg-main hover:bg-beige3`}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="w-full grid md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-2 group">
              <p className="text-border font-semibold text-sm">Image </p>
              <Uploader onFileSelect={handleImageUpload} />
              {(imagePreview || imageId) && (
                <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 mt-2">
                  <img
                    src={imagePreview ? imagePreview : (imageId ? `/api/Image/${imageId}` : "/images/Drink/2.jpg")}
                    alt="snack"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2 text-border">Snack Description</label>
            <textarea
              className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
              placeholder="Make it short and sweet"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          {error && <div className="text-red-500 text-center my-2">{error}</div>}
          {success && <div className="text-green-500 text-center my-2">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`font-medium transitions border border-beige3 flex-rows gap-4 text-white py-3 px-20 rounded-2xl w-full sm:w-auto ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-main hover:bg-beige3"}`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <HiPencilAlt className="text-lg" /> Edit Snack
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditSnacksModal;