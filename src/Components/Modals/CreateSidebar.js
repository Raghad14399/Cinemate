import React, { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

function CreateSidebar({ isOpen, onClose, onAddCategory }) {
  const [englishName, setEnglishName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = () => {
    if (!englishName) {
      alert("Please enter a Movie Type name.");
      return;
    }

    setIsSubmitting(true);

    // إنشاء كائن البيانات
    const categoryData = {
      englishName,
    };

    // استدعاء دالة الإضافة
    onAddCategory(categoryData)
      .then(() => {
        // إعادة تعيين الحقول
        setEnglishName("");
      })
      .catch((error) => {
        console.error("Error adding Movie Type:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[80%] md:w-[500px] lg:w-[600px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "translate-y-24" : "-translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">
            Create Movie Type
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out ml-4"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Movie Types Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 p-3 text-border">
              Movie Types Name
            </label>
            <input
              type="text"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter Movie Types name"
              disabled={isSubmitting}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddCategory}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <HiPlusCircle className="text-lg" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSidebar;
