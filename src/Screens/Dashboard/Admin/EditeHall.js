import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import SideBar from '../SideBar';

function EditCinemaHall() {
  const { state } = useLocation(); 
  const hallDataFromState = state || {}; 
  const { hallNumber, hallType, rows, columns, aisles } = hallDataFromState;
  const navigate = useNavigate(); 

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats] = useState(['A1', 'B3', 'C5']);
  const [hallData, setHallData] = useState({
    hallNumber: hallNumber || '',
    hallType: hallType || 'Standard',
    rows: rows || 10,
    columns: columns || 15,
    aisles: Array.isArray(aisles) ? aisles : [], 
  });

  const totalSeats = hallData.rows && hallData.columns ? hallData.rows * hallData.columns - (Array.isArray(hallData.aisles) ? hallData.aisles.length : 0) : 0;

  useEffect(() => {
    setHallData({
      hallNumber: hallNumber || '',
      hallType: hallType || 'Standard',
      rows: rows || 10,
      columns: columns || 15,
      aisles: Array.isArray(aisles) ? aisles : [],
    });
  }, [hallNumber, hallType, rows, columns, aisles]);

  const toggleSeatSelection = (seat) => {
    if (reservedSeats.includes(seat)) return; 
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const addAisle = (seat) => {
    if (Array.isArray(hallData.aisles) && !hallData.aisles.includes(seat)) {
      setHallData((prevData) => ({
        ...prevData,
        aisles: [...prevData.aisles, seat],
      }));
    } else if (Array.isArray(hallData.aisles)) {
      setHallData((prevData) => ({
        ...prevData,
        aisles: prevData.aisles.filter((s) => s !== seat),
      }));
    }
  };

  const renderSeats = () => {
    const seatLayout = [];
    const rowLabels = Array.from({ length: hallData.rows }, (_, i) => String.fromCharCode(65 + i));

    for (let i = 0; i < hallData.rows; i++) {
      const row = [];
      for (let j = 1; j <= hallData.columns; j++) {
        const seat = `${rowLabels[i]}${j}`;
        const isReserved = reservedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);
        const isAisle = Array.isArray(hallData.aisles) && hallData.aisles.includes(seat);

        row.push(
          <div
            key={seat}
            onClick={() => toggleSeatSelection(seat)}
            onContextMenu={(e) => {
              e.preventDefault();
              addAisle(seat);
            }}
            className={`flex items-center justify-center cursor-pointer transition-all ${ 
              isAisle
                ? 'bg-transparent'
                : isReserved
                ? 'bg-dry cursor-not-allowed'
                : isSelected
                ? 'bg-green-500'
                : ' hover:bg-gray-400'
            }`}
            style={{
              width: '50px',
              height: '50px',
              backgroundImage: `url(${isAisle ? '' : isReserved ? '/images/cinema.png' : isSelected ? '/images/cinema.png' : '/images/cinema.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '4px',
              margin: '0 4px',
            }}
            title={!isAisle ? seat : ''}
          >
            {!isAisle && ''}
          </div>
        );
      }
      seatLayout.push(
        <div key={rowLabels[i]} className="flex justify-center items-center gap-2">
          <span className="font-bold text-gray-700">{rowLabels[i]}</span>
          <div className="flex">{row}</div>
        </div>
      );
    }

    return <div className="flex flex-col gap-4">{seatLayout}</div>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Hall Number: ${hallData.hallNumber}, Type: ${hallData.hallType}, Total Seats: ${totalSeats}`);
    console.log(`Aisles: ${hallData.aisles}`);
  };

  const handleClose = () => {
    navigate('/halls');
  };

  return (
    <SideBar>
      <div className="p-6 bg-lightGray rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <button
            onClick={handleClose}
            className="text-xl font-bold text-gray-500  rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">Edit Cinema Hall</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="hallNumber" className="text-sm font-medium text-border">
                Hall Number
              </label>
              <input
                id="hallNumber"
                type="text"
                value={hallData.hallNumber}
                onChange={(e) => setHallData({ ...hallData, hallNumber: e.target.value })}
                placeholder="Enter hall number"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="hallType" className="text-sm font-medium text-border">
                Hall Type
              </label>
              <input
                id="hallType"
                value={hallData.hallType}
                onChange={(e) => setHallData({ ...hallData, hallType: e.target.value })}
                className="text-sm p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="rows" className="text-sm font-medium text-border">
                Rows
              </label>
              <input
                id="rows"
                type="text"
                value={hallData.rows}
                onChange={(e) => setHallData({ ...hallData, rows: Number(e.target.value) })}
                placeholder="Number of rows"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="columns" className="text-sm font-medium text-border">
                Columns
              </label>
              <input
                id="columns"
                type="text"
                value={hallData.columns}
                onChange={(e) => setHallData({ ...hallData, columns: Number(e.target.value) })}
                placeholder="Number of columns"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-500 font-medium text-sm">
            <span>Total Seats:</span>
            <span className="text-lg font-bold">{totalSeats}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-beige3 text-white text-sm font-medium rounded-2xl hover:bg-dry border border-beige3 transition duration-300"
          >
            Edit Hall
          </button>
        </form>

        <div className="mt-10">
          <h2 className="text-base font-semibold text-beige3 mb-4 p-3">Seat Layout</h2>
          <div style={{ position: 'relative' }}>{renderSeats()}</div>
        </div>
      </div>
    </SideBar>
  );
}

export default EditCinemaHall;
