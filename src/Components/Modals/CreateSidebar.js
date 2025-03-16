import React, { useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

function CreateSidebar({ isOpen, onClose, categories }) {
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = () => {
    if (categoryName) {
      alert(`Category added: ${categoryName}`);
      setCategoryName('');
    } else {
      alert('Please enter a category name.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
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
          isOpen ? 'translate-y-24' : '-translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Create Category</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out ml-4"
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
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter category name"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddCategory}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
          >
            <HiPlusCircle className="text-lg" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSidebar;