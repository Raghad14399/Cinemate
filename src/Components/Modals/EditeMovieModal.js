import React, { useState, useEffect } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import Uploader from '../Uploader';

function EditMovieModal({ isOpen, onClose, movie }) {
  const [movieName, setMovieName] = useState('');
  const [movieCategory, setMovieCategory] = useState('');
  const [movieLanguage, setMovieLanguage] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieHour, setMovieHour] = useState('');
  const [movieImage, setMovieImage] = useState('');

  useEffect(() => {
    if (movie) {
      setMovieName(movie.name);
      setMovieCategory(movie.Category);
      setMovieLanguage(movie.language);
      setMovieYear(movie.year);
      setMovieHour(movie.time);
      setMovieImage(movie.image);
    }
  }, [movie]);

  const handleEditMovie = () => {
    if (movieName && movieCategory && movieLanguage && movieYear && movieHour) {
      alert(`Movie edited: ${movieName}`);
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
          <h2 className="text-xl font-bold">Edit </h2>
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
            {/* Movie Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Movie Name</label>
              <input
                type="text"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter movie name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Category</label>
              <input
                type="text"
                value={movieCategory}
                onChange={(e) => setMovieCategory(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter movie category"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Language */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Language</label>
              <input
                type="text"
                value={movieLanguage}
                onChange={(e) => setMovieLanguage(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter movie language"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Year</label>
              <input
                type="text"
                value={movieYear}
                onChange={(e) => setMovieYear(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter movie year"
              />
            </div>

            {/* Hour */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">Hour</label>
              <input
                type="text"
                value={movieHour}
                onChange={(e) => setMovieHour(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter movie hour"
              />
            </div>
          </div>

          {/* Uploader */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">Movie Image</label>
            <Uploader className="w-full" />
          </div>

          {/* Image */}
          {movieImage && (
            <div className="flex justify-start">
              <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={`/images/movies/${movieImage}`}
                  alt={movieName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="mt-4">
            <button
              onClick={handleEditMovie}
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

export default EditMovieModal;