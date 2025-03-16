import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SideBar from '../SideBar';
import { HiPlusCircle } from 'react-icons/hi';
import { FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { Hall } from '../../../Data/HallData';

function CinemaHalls() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); 

  const handleAddHall = () => {
    navigate('/create-hall');
  };

  const handleHallClick = (hall) => {
    navigate('/edite-hall', {
      state: {
        hallNumber: hall.id, 
        hallType: hall.name, 
        totalSeats: hall.totalseats,
        rows:hall.rows,
        columns: hall.columns,
      },
    });
  };

  const filteredHalls = Hall.filter((hall) =>
    hall.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center justify-start w-3/4">
            <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
              <button
                type="button"
                onClick={() => console.log('Search button clicked')}
                className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search Hall Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-black focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
              />
            </form>
          </div>

          <button
            onClick={handleAddHall} 
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-lg hover:bg-dry border border-beige3 shadow-md transition"
          >
            <HiPlusCircle className="text-lg" /> Add Hall
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
              onClick={() => handleHallClick(hall)}
            >
              <img
                src={`/images/halls/${hall.image }`}
                alt={hall.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4 bg-lightGray rounded-b-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">{hall.name}</h3>
                <p className="text-gray-600">Seats: {hall.totalseats}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="text-gray-500 hover:text-green-500 transition duration-200"
                    title="Edit"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 transition duration-200"
                    title="Delete"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SideBar>
  );
}

export default CinemaHalls;
