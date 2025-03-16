import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { HiPencilAlt } from 'react-icons/hi';
import Uploader from '../Uploader';

function EditSnacksModal({ isOpen, onClose, snack }) {
  const [name, setName] = useState('');
  const [varieties, setVarieties] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (snack) {
      setName(snack.name);
      setVarieties(snack.varieties);
      setImage(snack.image);
    }
  }, [snack]);

  const handleEditSnack = () => {
    if (name && varieties) {
      alert(`Snack edited: ${name}`);
      onClose(); 
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{ top: '2%' }} 
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}

      {/* Modal content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] md:w-[600px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? 'scale-100' : 'scale-90'
        }`}
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

        {/* Content */}
        <div className="space-y-6">
          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Snack Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Snack Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter snack name"
              />
            </div>

            {/* Varieties */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Varieties</label>
              <input
                type="text"
                value={varieties}
                onChange={(e) => setVarieties(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter snack varieties"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">Movie Image</label>
            <Uploader className="w-full" />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="flex justify-start mt-4">
              <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={`/images/Nachos/${image}`}
                  alt={name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-4">
            <button
              onClick={handleEditSnack}
              className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
            >
              <HiPencilAlt className="text-lg" /> Edit Snack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSnacksModal;