import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

function EditSidebar({ isOpen, onClose, category, onEdit }) {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    setCategoryName(category || '');
  }, [category]);

  const handleEditCategory = () => {
    if (categoryName) {
      onEdit(categoryName); 
    } else {
      alert('Please enter a category name.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
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
          isOpen ? 'translate-y-[-60%]' : '-translate-y-18' 
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Category</h2>
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
            <label className="block text-sm font-semibold mb-2 p-3 text-border">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main "
              placeholder="Enter new category name"
            />
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEditCategory}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
          >
            <HiPencilAlt className="text-lg" /> Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSidebar;