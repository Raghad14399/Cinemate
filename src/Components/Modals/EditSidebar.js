import React, { useState, useEffect } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

function EditSidebar({ isOpen, onClose, category, onEdit }) {
  const [englishName, setEnglishName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setEnglishName(category.title || "");
    } else {
      setEnglishName("");
    }
  }, [category]);

  const handleEditCategory = () => {
    if (!englishName) {
      alert("Please enter a category name.");
      return;
    }

    setIsSubmitting(true);

    // إنشاء كائن البيانات
    const categoryData = {
      englishName,
    };

    // استدعاء دالة التعديل
    onEdit(categoryData)
      .catch((error) => {
        console.error("Error updating category:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[80%] md:w-[500px] lg:w-[600px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "translate-y-[-60%]" : "-translate-y-18"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Movie Type</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Category Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 p-3 text-border">
              Category Name
            </label>
            <input
              type="text"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditCategory}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <HiPencilAlt className="text-lg" /> Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSidebar;
