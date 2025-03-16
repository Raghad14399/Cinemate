import React, { useState } from 'react';
import { FaCloudUploadAlt, FaEdit } from 'react-icons/fa';
import { GoEye } from 'react-icons/go';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import EditMovieModal from './Modals/EditeMovieModal';

const Head = 'text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200';
const Text = 'text-sm text-left leading-6 whiteSpace-nowrap px-5 py-3';

function Table({ data, admin }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedMovie(null);
  };

  const Rows = (movie, i) => (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      <td className={`${Text}`}>
        <div className="w-12 h-12 p-1 bg-dry border border-border rounded-xl overflow-hidden">
          <img
            src={`/images/movies/${movie.image}`}
            alt={movie?.name}
            className="w-full h-full object-cover"
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
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200">
              <MdDelete />
            </button>
          </>
        ) : (
          <>
            <button className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200">
              <Link to={`/booking/${movie.name}`} state={{ availableHalls: movie.halls }} className="flex items-center gap-2">
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
              <th scope="col" className={`${Head}`}>Image</th>
              <th scope="col" className={`${Head}`}>Name</th>
              <th scope="col" className={`${Head}`}>Category</th>
              <th scope="col" className={`${Head}`}>Language</th>
              <th scope="col" className={`${Head}`}>Year</th>
              <th scope="col" className={`${Head}`}>Hours</th>
              <th scope="col" className={`${Head} text-right`}>Actions</th>
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
    </>
  );
}

export default Table;
