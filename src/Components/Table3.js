import React, { useState } from 'react';
import { FaCloudUploadAlt, FaEdit } from 'react-icons/fa';
import { GoEye } from 'react-icons/go';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

import DeleteConfirmModal from './Modals/DeleteConfirmModal';

const Head = 'text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200';
const Text = 'text-sm text-left leading-6 whiteSpace-nowrap px-5 py-3';

const Rows = (snack, i, admin, onEdit, onDeleteClick) => {
  // الاسم: استخدم الإنجليزي فقط
  const snackName = snack.englishName || '-';
  // الصورة: نفس منطق MovieList
  let imgSrc = snack.image?.url || '';
  if (!imgSrc || imgSrc === 'default-movie.jpg') {
    imgSrc = '/images/placeholder.png';
  } else if (imgSrc.startsWith('Images/')) {
    imgSrc = `http://cinemate-001-site1.jtempurl.com/${imgSrc}`;
  } else if (!imgSrc.startsWith('http')) {
    imgSrc = `/images/snacks/${imgSrc}`;
  }
  // الـ Varieties: فقط النوع (snack.type)
  const varieties = snack.type || '-';

  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      <td className={`${Text}`}>
        <ImageWithLoader src={imgSrc} alt={snackName} />
      </td>
      <td className={`${Text} truncate`}>{snackName}</td>
      <td className={`${Text}`}>{varieties}</td>
      <td className={`${Text}`}></td>
      <td className={`${Text} float-right flex gap-2 items-center`}>
        {admin ? (
          <>
            <button
              onClick={() => onEdit(snack)}
              className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
            >
              Edit <FaEdit />
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200"
              onClick={() => onDeleteClick(snack)}
              title="حذف السناك"
            >
              <MdDelete />
            </button>
          </>
        ) : (
          <>
            <button className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200">
              Booking <FaCloudUploadAlt />
            </button>
            <Link
              to={`/snack/${snack?.name}`}
              className="bg-gray-700 hover:bg-subMain text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200"
            >
              <GoEye />
            </Link>
          </>
        )}
      </td>
    </tr>
  );
};

// مكون صورة مع لودر
function ImageWithLoader({ src, alt }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden flex items-center justify-center relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="loader border-2 border-gray-300 border-t-beige3 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ position: 'relative', zIndex: 5, display: 'block' }}
        onLoad={() => setLoading(false)}
        onError={e => {
          setError(true);
          setLoading(false);
          e.target.onerror = null;
          e.target.src = '/images/placeholder.png';
        }}
      />
    </div>
  );
}

function Table3({ data, admin, onEdit, onDelete, refreshSnacks }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [snackToDelete, setSnackToDelete] = useState(null);

  // Open delete confirmation modal
  const handleDeleteClick = (snack) => {
    setSnackToDelete(snack);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSnackToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Delete handler to call API and refresh
  const handleConfirmDelete = async () => {
    if (!snackToDelete) return;
    try {
      await onDelete(snackToDelete.id);
    } catch (err) {
      // Optionally show error toast
      console.error("Delete Snack Error:", err);
    }
    closeDeleteModal();
  };


  return (
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
              Varieties
            </th>

            <th scope="col" className={`${Head}`}>
            </th>
            <th scope="col" className={`${Head} text-right`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((snack, i) =>
            Rows(snack, i, admin, onEdit, handleDeleteClick)
          )}
        </tbody>
      </table>

    <DeleteConfirmModal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      onConfirm={handleConfirmDelete}
      title={"Confirm Delete Snack"}
      message={snackToDelete ? `Are you sure you want to delete the snack (${snackToDelete.englishName || snackToDelete.arabicName})?` : ""}
    />
  </div>

  );
}

export default Table3;
