import { FaEdit, FaCog } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

const Head = 'text-xs text-left text-main font-semibold px-4 py-2 uppercase bg-gray-700 text-gray-200';
const Text = 'text-xs text-left leading-6 whitespace-nowrap px-4 py-2 text-center'; 

const Rows = (data, i, tickets, navigate) => {
  const statusColor = data.status === 'paid' ? 'text-green-500' : data.status === 'waiting' ? 'text-beige3' : 'text-gray-400';

  return (
    <tr key={i} className="hover:bg-gray-800 transition-colors duration-200">
      {tickets ? (
        <>
          <td className={`${Text}`}>
            <div className="w-12 h-12 p-1 bg-dry border border-border rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`/images/${data.image ? data.image : "user.png"}`}
                alt={data?.name}
              />
            </div>
          </td>
          <td className={`${Text}`}>{data.name}</td>
          <td className={`${Text}`}>{data.phoneNumber}</td>
          <td className={`${Text}`}>{data.hallNumber}</td>
          <td className={`${Text}`}>{data.seat}</td>
          <td className={`${Text}`}>{data.createAt ? data.createAt : "12, Jan 2024"}</td>
          <td className={`${Text}`}>{data.createAt ? data.createAt : "12.AM"}</td>
          <td className={`${Text} ${statusColor}`}>{data.status}</td> 
          <td className={`${Text} flex justify-center items-center`}>
            <button 
              onClick={() => navigate("/respits")}
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
    <div className="overflow-hidden relative w-full rounded-xl border border-gray-700 shadow-md">
      <table className="w-full table-auto divide-y divide-gray-800">
        <thead>
          <tr>
            {tickets ? (
              <>
                <th scope="col" className={`${Head}`}>Image</th>
                <th scope="col" className={`${Head}`}>Name</th>
                <th scope="col" className={`${Head}`}>Phone Number</th>
                <th scope="col" className={`${Head}`}>Hall Number</th>
                <th scope="col" className={`${Head}`}>Seat</th>
                <th scope="col" className={`${Head}`}>Date</th>
                <th scope="col" className={`${Head}`}>Time</th>
                <th scope="col" className={`${Head}`}>Status</th>
              </>
            ) : (
              <>
                <th scope="col" className={`${Head}`}>Name</th>
                <th scope="col" className={`${Head}`}>Date</th>
                <th scope="col" className={`${Head}`}>Phone Number</th>
              </>
            )}
            <th scope="col" className={`${Head} text-right`}>Actions</th>
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
