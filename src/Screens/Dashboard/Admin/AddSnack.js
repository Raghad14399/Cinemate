import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import { Input, Message } from "../../../Components/UsedInputs";
import Uploader from "../../../Components/Uploader";
import { Varieties } from "../../../Data/MovieData";
import { ImUpload } from "react-icons/im";
import { FaPlus } from 'react-icons/fa';
import { snackService, imageService } from "../../../api/services";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddSnack() {
  const [toastId, setToastId] = useState(null);
  const [varieties, setVarieties] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState("");
  const [snakVariants, setSnakVariants] = useState([{ size: "", price: "" }]);
  const [snackName, setSnackName] = useState("");

  const [description, setDescription] = useState("");
  const [imageId, setImageId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setSnackName("");
    setDescription("");
    setImageId(null);
    setImagePreview(null);
    setSelectedVariety("");
    setSnakVariants([{ size: "", price: "" }]);
    setError("");
    setSuccess("");
  };

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
      console.log("Image upload response:", response);

      if (response?.data?.success && response.data?.data?.id) {
        setImageId(response.data.data.id);
      } else if (response?.data?.id) {
        setImageId(response.data.id);
      } else {
        setError("فشل رفع الصورة: الاستجابة غير متوقعة من الخادم");
        setImageId(null);
      }
    } catch (err) {
      setError("فشل رفع الصورة: " + (err?.response?.data?.message || err.message || "خطأ غير معروف"));
      setImageId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (toastId) toast.dismiss(toastId);

    // Validation
    if (!snackName.trim()) {
      toast.error("Snack name is required.");
      return;
    }
    if (!selectedVariety) {
      toast.error("Please select a variety (Snack or Drink).");
      return;
    }
    if (!imageId) {
      toast.error("Please upload an image for the snack.");
      return;
    }
    const validVariants = snakVariants.filter(v => v.size.trim() && v.price.trim());
    if (validVariants.length === 0) {
      toast.error("Please add at least one valid price variant (size and price).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        arabicName: snackName,
        englishName: snackName,
        description,
        imageId,
        type: selectedVariety,
        snakVariants: validVariants.map(v => ({ ...v, price: Number(v.price) }))
      };

      await snackService.createSnack(payload);
      
      const newToastId = toast.success("Snack added successfully!");
      setToastId(newToastId);
      resetForm();

    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "An unknown error occurred";
      const newToastId = toast.error(errorMessage);
      setToastId(newToastId);
      console.error("Error creating snack:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="colored" />
      <SideBar>
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold ">
            Create Snack
          </h2>

          {/* Snack Name and Variety */}
          <div className="w-full grid md:grid-cols-2 gap-6">
            <div className="w-full">
              <Input
                label="Snack Name"
                placeholder="e.g. Classic Popcorn"
                type="text"
                bg={true}
                name="snackName"
                value={snackName}
                onChange={(e) => setSnackName(e.target.value)}
              />
            </div>
            <div className="text-sm w-full">
              <label className="text-border font-semibold">Varieties</label>
              <select
                className="w-full mt-3 p-4 bg-main border border-border text-white rounded-2xl"
                value={selectedVariety}
                onChange={handleVarietiesChange}
              >
                <option value="">Select a variety</option>
                {varieties.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Snack Variants (Size/Price) */}
          <div className="w-full flex flex-col gap-4 border-2 border-beige3 rounded-2xl p-6 bg-main shadow-md">
            <label className="font-semibold text-base text-beige3 mb-2">Snack Price Variants</label>
            {snakVariants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                <div className="w-full md:col-span-5">
                  <Input
                    label="Size"
                    placeholder="e.g. Large / Medium / Small"
                    type="text"
                    bg={true}
                    value={variant.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                  />
                </div>
                <div className="w-full md:col-span-5">
                  <Input
                    label="Price (SYP)"
                    placeholder="Enter price"
                    type="number"
                    bg={true}
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  {snakVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 text-sm transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="w-full flex justify-end mt-2 ">
              <button
                type="button"
                onClick={addVariant}
                className="font-medium transitions border border-beige3 flex items-center gap-2 text-white py-2 px-8 rounded-2xl bg-main hover:bg-beige3"
              >
                <FaPlus className="mr-2" /> Add Variant
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="w-full grid md:grid-cols-2 gap-6">
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
          <Message
            label="Snack Description"
            placeholder="Make it short and sweet"
            value={description}
            onChange={val => setDescription(val)}
          />

         
          {/* Submit */}
          {error && <div className="text-red-500 text-center my-2">{error}</div>}
          {success && <div className="text-green-500 text-center my-2">{success}</div>}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`font-medium transitions border border-beige3 flex-rows gap-4 text-white py-3 px-20 rounded-2xl w-full sm:w-auto ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-main hover:bg-beige3"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <ImUpload size={20} /> Publish Snack
              </>
            )}
          </button>
        </div>
      </SideBar>
    </>
  );
}

export default AddSnack;
