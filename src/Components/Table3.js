import React, { useState } from 'react';
import { FaCloudUploadAlt, FaEdit } from 'react-icons/fa';
import { GoEye } from 'react-icons/go';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import EditSnacksModal from './Modals/EditeSnacksModal'

const Head = 'text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200';
const Text = 'text-sm text-left leading-6 whiteSpace-nowrap px-5 py-3';

const Rows = (snack, i, admin, openModal, setSelectedSnack) => {
  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      <td className={`${Text}`}>
        <div className="w-12 h-12 p-1 bg-dry border border-border rounded-xl overflow-hidden">
          <img
            src={`/images/Nachos/${snack.image}`}
            alt={snack?.name}
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className={`${Text} truncate`}>{snack.name}</td>
      <td className={`${Text}`}>{snack.varieties}</td>
      <td className={`${Text}`}>{snack.time}</td>
      <td className={`${Text} float-right flex gap-2 items-center`}>
        {admin ? (
          <>
            <button
              onClick={() => {
                setSelectedSnack(snack); 
                openModal();
              }}
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

function Table3({ data, admin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [selectedSnack, setSelectedSnack] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            Rows(snack, i, admin, openModal, setSelectedSnack)
          )}
        </tbody>
      </table>
    <EditSnacksModal
      isOpen={isModalOpen}
      onClose={closeModal}
      snack={selectedSnack}  
    />
  
  </div>

  );
}

export default Table3;
