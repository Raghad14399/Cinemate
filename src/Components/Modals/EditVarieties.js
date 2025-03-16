import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import Uploader from '../Uploader'; 

function EditVarieties({ isOpen, onClose, varieties, onEdit }) {
  const [varietiesName, setVarietyName] = useState('');
  const [varietiesImage, setVarietiesImage] = useState('');

  useEffect(() => {
    setVarietyName(varieties?.name || '');
    setVarietiesImage(varieties?.image || '');
  }, [varieties]);

  const handleEditVariety = () => {
    if (varietiesName) {
      onEdit({ name: varietiesName, image: varietiesImage }); 
    } else {
      alert('Please enter a variety name.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{ top: '10%' }} 
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose} 
        />
      )}

      {/* Modal content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[80%] md:w-[500px] lg:w-[600px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? '-translate-y-6' : '-translate-y-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Varieties</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-400">
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Variety Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">Variety Name</label>
            <input
              type="text"
              value={varietiesName}
              onChange={(e) => setVarietyName(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter new variety name"
            />
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">Variety Image</label>
            <Uploader onUpload={(image) => setVarietiesImage(image)} />
          </div>

          {/* Image Preview */}
          {varietiesImage && (
            <div className="flex justify-start mt-4">
              <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300">
                <img
                  src={varietiesImage}
                  alt={varietiesName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* Update Button */}
          <button
            onClick={handleEditVariety}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
          >
            <HiPencilAlt className="text-lg" /> Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditVarieties;
