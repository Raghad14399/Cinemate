import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import Uploader from '../Uploader';

function EditCastModal({ isOpen, onClose, cast }) {
  const [castName, setCastName] = useState('');
  const [castImage, setCastImage] = useState('');

  useEffect(() => {
    if (cast) {
      setCastName(cast.name);
      setCastImage(cast.image);
    }
  }, [cast]);

  const handleEditCast = () => {
    if (castName) {
      alert(`Cast edited: ${castName}`);
      setCastName('');
    } else {
      alert('Please enter a cast name.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pt-12 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
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
          isOpen ? 'scale-100' : 'scale-90'
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Cast</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-400 ml-4">
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Cast Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 p-3 text-border">Cast Name</label>
            <input
              type="text"
              value={castName}
              onChange={(e) => setCastName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter cast name"
            />
          </div>

          {/* Cast Image */}
          <div className="w-full">
            <div className="flex flex-col gap-2 group">
              <p className="text-border font-semibold text-sm">Cast Image</p>
              <Uploader className="w-full" /> 
            </div>
          </div>

          {castImage && (
            <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img src={`/images/${castImage}`} alt={castName} className="w-full h-full object-cover rounded-2xl" />
            </div>
          )}

          {/* Edit Button */}
          <div className="w-full">
            <button
              onClick={handleEditCast}
              className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
            >
              <HiPencilAlt className="text-lg" /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCastModal;
