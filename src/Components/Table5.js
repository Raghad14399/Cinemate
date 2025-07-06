import { FaEdit, FaCog } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

const Head = 'text-xs text-left text-main font-semibold px-4 py-2 uppercase bg-gray-700 text-gray-200';
const Text = 'text-xs text-left leading-6 whitespace-nowrap px-4 py-2 text-center'; 

// تحويل الوقت إلى تنسيق 12 ساعة مع AM/PM
const convertTo12HourFormat = (time) => {
  const [hours, minutes, seconds] = time.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
};

const Rows = (data, i, tickets, navigate) => {
  console.log("Row Data:", data);
  // تحديث لون الحالة
  const statusColor = data.status.toLowerCase() === 'accepted' ? 'text-green-500' 
    : data.status.toLowerCase() === 'pending' ? 'text-beige3' 
    : data.status.toLowerCase() === 'canceled' ? 'text-red-500' 
    : 'text-gray-400';

  // تحديث نص الحالة لتكون بالحرف الكبير
  const statusText = data.status.toLowerCase() === 'canceled' ? 'Canceled' 
    : data.status.toLowerCase() === 'accepted' ? 'Accepted' 
    : data.status.toLowerCase() === 'pending' ? 'Pending' 
    : data.status;

  // Truncate seats if more than 10
  const displaySeat = data.seat && typeof data.seat === 'string' 
    ? (data.seat.split(',').length > 10 
        ? `${data.seat.split(',').map(s => s.trim()).slice(0, 7).join(', ')} ...` 
        : data.seat)
    : data.seat;

  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      {tickets ? (
        <>
          <td className={`${Text} text-center`}>{data.email}</td>
          <td className={`${Text}`}>{data.hallNumber}</td>
          <td className={`${Text} text-center`}>{displaySeat}</td>
          <td className={`${Text} text-center`}>{data.createAt ? data.createAt : "12, Jan 2024"}</td>
          <td className={`${Text} text-center`}>{data.time ? convertTo12HourFormat(data.time) : "12:00 AM"}</td>
          <td className={`${Text} text-center ${statusColor}`}>
            {data.status === 'canceled' ? 'Canceled' : data.status}
          </td>
          <td className={`${Text} text-center`}>
            {data.receiptImage && data.receiptImage.id ? (
              <span className="text-green-500 font-bold">✔</span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>
          <td className={`${Text} text-center flex justify-center items-center`}>
           
            <button
              onClick={() => navigate("/accept-resipts", { state: data })}
              className="bg-gray-700 hover:bg-blue-700 hover:text-white text-border rounded-lg flex items-center justify-center px-6 py-2 transition-all duration-200"
            >
              <FaCog className="mr-2" /> 
              Manage 
            </button>
          </td>
        </>
      ) : (
        <>
          <td className={`${Text} font-bold`}>{data._id ? data._id : "2R75T8"}</td>
          <td className={`${Text}`}>{data.createAt ? data.createAt : "12, Jan 2024"}</td>
          <td className={`${Text}`}>{data.title}</td>
          <td className={`${Text} flex justify-center items-center`}>
            <button
              onClick={() => navigate("/respits")} 
              className="border border-border bg-gray-700 hover:bg-green-500 hover:text-white text-border flex items-center gap-2 rounded-lg py-1 px-3 transition-all duration-200"
            >
              Edit <FaEdit />
            </button>
            <button 
              onClick={() => navigate("/respits")} 
              className="bg-gray-700 hover:bg-blue-700 hover:text-white text-border rounded-lg flex items-center justify-center px-6 py-2 transition-all duration-200"
            >
              <FaCog className="mr-2" /> 
              Manage 
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

// table5
function Table5({ data, tickets }) { 
  const navigate = useNavigate(); 

  return (
    <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 border-solid shadow-md">
      <table className="w-full table-auto divide-y divide-gray-800">
        <thead>
          <tr>
            {tickets ? (
              <>
                <th scope="col" className={`${Head} text-center`}>Email</th>
                <th scope="col" className={`${Head}`}>Hall Name</th>
                <th scope="col" className={`${Head} text-center`}>Seat</th>
                <th scope="col" className={`${Head} text-center`}>Date</th>
                <th scope="col" className={`${Head} text-center`}>Time</th>
                <th scope="col" className={`${Head} text-center`}>Status</th>
                <th scope="col" className={`${Head} text-center`}>Receipt</th>
              </>
            ) : (
              <>
                <th scope="col" className={`${Head}`}>Name</th>
                <th scope="col" className={`${Head}`}>Date</th>
                <th scope="col" className={`${Head}`}>Phone Number</th>
              </>
            )}
            <th scope="col" className={`${Head} text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((data, i) => Rows(data, i, tickets, navigate))} 
        </tbody>
      </table>
    </div>
  );
}

export default Table5;
