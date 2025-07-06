import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// مكون صورة مع لودر (نفس Table3)
function ImageWithLoader({ src, alt }) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden flex items-center justify-center relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="loader border-2 border-gray-300 border-solid border-t-beige3 rounded-full w-6 h-6 animate-spin"></span>
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

const Head =
  "text-xs text-left  text-main font-semibold px-6 py-4 uppercase bg-gray-700 text-gray-200";
const Text = "text-sm text-left pl-6 leading-6 whiteSpace-nowrap px-5 py-3";

const Rows = (data, i, users, onEditClick, onDeleteClick, onBlockClick) => {
  // دعم عرض بيانات المستخدمين من الـ API
  const imgUrl = data.image && data.image.url
    ? (data.image.url.startsWith('http') ? data.image.url : `http://cinemate-001-site1.jtempurl.com/${data.image.url}`)
    : '/images/user.png';
  const userId = data.id || data._id || '2R75T8';
  const userName = data.fullName || data.name || '';
  const userEmail = data.email || data.Email || '';
  // لا يوجد تاريخ إنشاء في الـ API الحالي، يمكن إخفاؤه أو وضع قيمة افتراضية
  const userDate = data.createAt || data.createdAt || '';

  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      {/* users */}
      {users ? (
        <>
          <td className={`${Text}`}>
            <div className="w-12 h-12 bg-dry border border-border rounded-xl overflow-hidden">
              <ImageWithLoader src={imgUrl} alt={userName} />
            </div>
          </td>
          <td className={`${Text}`}>{userId}</td>

          <td className={`${Text}`}>{userName}</td>
          <td className={`${Text}`}>{userEmail}</td>
          <td className={`${Text}`}>
            <button
              onClick={() => onBlockClick && onBlockClick(data)}
              className={`rounded-lg flex items-center justify-center w-20 h-8 transition-all duration-200 ${data.isBlocked ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {data.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </td>
          <td className={`${Text} float-right flex gap-2 items-center`}>
            <button
              onClick={() => onEditClick && onEditClick(data)}
              className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
            >
              Edit <FaEdit />
            </button>
            <button
              onClick={() => onDeleteClick && onDeleteClick(data)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200"
            >
              <MdDelete />
            </button>
          </td>
        </>
      ) : (
        // categories
        <>
          <td className={`${Text}`}>{data.title}</td>
          <td className={`${Text}`}></td>
          <td className={`${Text}`}></td>
          <td className={`${Text} float-right flex gap-2 items-center`}>
            <button
              onClick={() => onEditClick && onEditClick(data)}
              className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
            >
              Edit <FaEdit />
            </button>
            <button
              onClick={() => onDeleteClick && onDeleteClick(data)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center w-8 h-8 transition-all duration-200"
            >
              <MdDelete />
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

// table2
function Table2({ data, users, onEditClick, onDeleteClick, onBlockClick }) {
  return (
    <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 border-solid shadow-md">
      <table className="w-full table-auto divide-y divide-gray-800">
        <thead>
          <tr>
            {users ? (
              <>
                <th scope="col" className={`${Head}`}>
                  Image
                </th>
                <th scope="col" className={`${Head}`}>
                  id
                </th>

                <th scope="col" className={`${Head}`}>
                  Full Name
                </th>
                <th scope="col" className={`${Head}`}> 
                  Email
                </th>
                <th scope="col" className={`${Head}`}>Block Status</th>
              </>
            ) : (
              <>
                <th scope="col" className={`${Head} text-left `}>
                  Title
                </th>
                <th scope="col" className={`${Head}`}></th>
                <th scope="col" className={`${Head}`}></th>
              </>
            )}
            <th scope="col" className={`${Head}  text-right pr-10`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((data, i) =>
            Rows(data, i, users, onEditClick, onDeleteClick, onBlockClick)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table2;
