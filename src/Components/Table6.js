import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdOutlinePerson } from 'react-icons/md';

const Head = 'text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200';
const Text = 'text-sm text-left leading-6 whitespace-nowrap px-5 py-3';

const Rows = (data, i, onEditClick) => {
  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      {/* Icon */}
      <td className={`${Text}`}>
        <div className="w-12 h-12 p-1 bg-dry border border-border rounded-full flex items-center justify-center">
          <MdOutlinePerson size={24} className="text-gray-400 hover:text-beige3 transition-colors duration-200" />
        </div>
      </td>

      {/* Name */}
      <td className={`${Text}`}>{data.fullName || data.name || "N/A"}</td>

      {/* Phone Number */}
      <td className={`${Text}`}>{data.phoneNumber || "N/A"}</td>

      {/* Email */}
      <td className={`${Text}`}>{data.email || "N/A"}</td>

      {/* Role */}
      <td className={`${Text}`}>{data.role || "N/A"}</td>

      {/* Actions */}
      <td className={`${Text} float-right flex gap-2 items-center`}>
        <button
          onClick={() => onEditClick(data)}
          className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
        >
          Edit <FaEdit />
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200">
          <MdDelete />
        </button>
      </td>
    </tr>
  );
};

// Table Component
function Table6({ data, onEditClick }) {
  return (
    <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 shadow-md">
      <table className="w-full table-auto divide-y divide-gray-800">
        <thead>
          <tr>
            <th scope="col" className={`${Head}`}>Icon</th>
            <th scope="col" className={`${Head}`}>Name</th>
            <th scope="col" className={`${Head}`}>Phone Number</th>
            <th scope="col" className={`${Head}`}>Email</th>
            <th scope="col" className={`${Head}`}>Role</th>
            <th scope="col" className={`${Head} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((employee, i) => {
            if (!employee) {
              console.error("Invalid employee data at index:", i);
              return null; // لا تعرض أي شيء للعناصر الفارغة
            }

            return Rows(employee, i, onEditClick);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table6;