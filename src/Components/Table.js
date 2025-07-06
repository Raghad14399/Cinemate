import React, { useState } from "react";
import { FaCloudUploadAlt, FaEdit } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import EditMovieModal from "./Modals/EditeMovieModal";
import { movieService } from "../api/services";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";

const Head =
  "text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200";
const Text = "text-sm text-left leading-6 whiteSpace-nowrap px-5 py-3";

function Table({ data, admin, onMovieUpdate }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to delete movie. Please try again."
  );

  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedMovie(null);
    // إعادة تحميل البيانات بعد التعديل
    if (onMovieUpdate) {
      onMovieUpdate();
    }
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;

    try {
      setIsLoading(true);
      await executeApiCall(() => movieService.deleteMovie(movieToDelete.id));

      // إعادة تحميل البيانات بعد الحذف
      if (onMovieUpdate) {
        onMovieUpdate();
      }

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Rows = (movie, i) => (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      <td className={`${Text}`}>
        <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden">
          <img
            src={(() => {
              // دعم حالتين: movie.image string أو كائن فيه url
              let img = movie.image;
              if (typeof img === 'object' && img !== null) img = img.url;
              if (!img) return "/images/movies/default-movie.jpg";
              if (typeof img !== 'string') return "/images/movies/default-movie.jpg";
              if (img.startsWith("Images/")) return `http://cinemate-001-site1.jtempurl.com/${img}`;
              if (img.startsWith("http")) return img;
              return `/images/movies/${img}`;
            })()}
            alt={movie?.name}
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/movies/default-movie.jpg";
            }}
          />
        </div>
      </td>
      <td className={`${Text} truncate`}>{movie.name}</td>
      <td className={`${Text}`}>{movie.Category}</td>
      <td className={`${Text}`}>{movie.language}</td>
      <td className={`${Text}`}>{movie.year}</td>
      <td className={`${Text}`}>{movie.time}</td>
      <td className={`${Text} float-right flex gap-2 items-center`}>
        {admin ? (
          <>
            <button
              onClick={() => handleEditClick(movie)}
              className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
            >
              Edit <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteClick(movie)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDelete />
            </button>
          </>
        ) : (
          <>
            <button className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200">
              <Link
                to={`/booking/${movie.name}`}
                state={{ availableHalls: movie.halls }}
                className="flex items-center gap-2"
              >
                Booking <FaCloudUploadAlt />
              </Link>
            </button>
            <Link
              to={`/movie/${movie?.name}`}
              className="bg-gray-700 hover:bg-subMain text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200"
            >
              <GoEye />
            </Link>
          </>
        )}
      </td>
    </tr>
  );

  return (
    <>
      <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 shadow-md">
        <table className="w-full table-auto divide-y divide-gray-800">
          <thead>
            <tr>
              <th scope="col" className={`${Head}`}>
                Image
              </th>
              <th scope="col" className={`${Head}`}>
                Name
              </th>
              <th scope="col" className={`${Head}`}>
                Movie Types
              </th>
              <th scope="col" className={`${Head}`}>
                Language
              </th>
              <th scope="col" className={`${Head}`}>
                Year
              </th>
              <th scope="col" className={`${Head}`}>
                Duration
              </th>
              <th scope="col" className={`${Head} text-right`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {data.map((movie, i) => Rows(movie, i))}
          </tbody>
        </table>
      </div>

      <EditMovieModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        movie={selectedMovie}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center w-[90%] md:w-[400px] border border-border">
            <h3 className="text-xl font-bold text-white mb-4">Delete Movie</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{movieToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={isLoading}
                className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-700 transition duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
