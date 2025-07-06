import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const Head = 'text-xs text-left text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200';
const Text = 'text-sm text-left leading-6 whiteSpace-nowrap px-5 py-3';

const Rows = (data, i, users, onEditClick) => { 
  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      {/* users */}
      {users ? (
        <>
          <td className={`${Text}`}>
            <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`/images/variety/${data.image ? data.image : "user.png"}`}
                alt={data?.name}
                style={{ display: 'block' }}
              />
            </div>
          </td>
          <td className={`${Text}`}>{data?._id ? data._id : "2R75T8"}</td>
          <td className={`${Text}`}>{data.createAt ? data.createAt : "12, Jan 2024"}</td>
          <td className={`${Text}`}>{data.name}</td>
        </>
      ) : (
        // categories
        <>
          <td className={`${Text}`}>
            <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`/images/variety/${data.image ? data.image : "user.png"}`}
                alt={data?.name}
                style={{ display: 'block' }}
              />
            </div>
          </td>
          <td className={`${Text}`}>{data.name}</td>
        </>
      )}
    </tr>
  );
};

// table4
function Table4({ data, users, onEditClick }) { 
  return (
    <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 shadow-md">
      <table className="w-full table-auto divide-y divide-gray-800">
        <thead>
          <tr>
            {users ? (
              <>
                <th scope="col" className={`${Head}`}>Image</th>
                <th scope="col" className={`${Head}`}>id</th>
                <th scope="col" className={`${Head}`}>Date</th>
                <th scope="col" className={`${Head}`}>Name food</th>
              </>
            ) : (
              <>
                <th scope="col" className={`${Head}`}>Image</th>
                <th scope="col" className={`${Head}`}>Name</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((data, i) => Rows(data, i, users, onEditClick))} 
        </tbody>
      </table>
    </div>
  );
}

export default Table4
