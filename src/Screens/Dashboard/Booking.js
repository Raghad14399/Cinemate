import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import { Input, MobileInput } from '../../Components/UsedInputs';
import { IoClose } from 'react-icons/io5';

const Booking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // استخدام useMemo لتخزين قيمة availableHalls
  const availableHalls = useMemo(() => (state ? state.availableHalls : []), [state]);

  const [hallType, setHallType] = useState(availableHalls.length > 0 ? availableHalls[0].hallType : 'Standard');
  const [movieTime, setMovieTime] = useState('');
  const [rows, setRows] = useState(availableHalls.length > 0 ? availableHalls[0].rows : 15);
  const [columns, setColumns] = useState(availableHalls.length > 0 ? availableHalls[0].columns : 10);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats] = useState(['A1', 'B3', 'C5']);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const seatPrice = 100;

  useEffect(() => {
    if (availableHalls.length > 0) {
      setHallType(availableHalls[0].hallType);
      setRows(availableHalls[0].rows);
      setColumns(availableHalls[0].columns);
    }
  }, [availableHalls]);

  const handleHallTypeChange = (type) => {
    const selectedHall = availableHalls.find((hall) => hall.hallType === type);
    setHallType(type);
    if (selectedHall) {
      setRows(selectedHall.rows);
      setColumns(selectedHall.columns);
    }
  };

  const toggleSeatSelection = (seat) => {
    if (reservedSeats.includes(seat)) return;
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  const generateRowLabels = (count) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      let label = '';
      let num = i;
      while (num >= 0) {
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26) - 1;
      }
      labels.push(label);
    }
    return labels;
  };

  const renderSeats = () => {
    const rowLabels = generateRowLabels(rows);
    const seatLayout = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 1; j <= columns; j++) {
        const seat = `${rowLabels[i]}${j}`;
        const isReserved = reservedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);

        row.push(
          <div
            key={seat}
            onClick={() => toggleSeatSelection(seat)}
            className={`relative cursor-pointer transition-all flex items-center justify-center ${
              isReserved
                ? 'bg-red-500'
                : isSelected
                ? 'bg-green-500'
                : 'bg-transparent hover:opacity-75'
            }`}
            style={{
              width: '50px',
              height: '50px',
              backgroundImage: `url('/images/cinema.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 4px',
              borderRadius: '4px',
            }}
            title={seat}
          >
            {/* نص الكرسي */}
            <span
              className="text-[12px] text-white font-bold"
              style={{
                opacity: 0.2, // تأثير الشفافية
              }}
            >
              {seat} {/* اسم الكرسي مثل A1, A2, ... */}
            </span>
          </div>
        );
      }

      seatLayout.push(
        <div key={rowLabels[i]} className="flex items-center gap-2">
          {/* Row Label */}
          <span className="font-bold text-gray-700 w-[50px] flex justify-center">{rowLabels[i]}</span>
          {/* Seats */}
          <div className="flex">{row}</div>
        </div>
      );
    }

    return (
      <div
        className="flex flex-col gap-4"
        style={{
          maxHeight: '500px', // ارتفاع ثابت للقسم
          overflow: 'auto', // تمكين التمرير في جميع الاتجاهات
        }}
      >
        {seatLayout}
      </div>
    );
  };

  const calculateTotalPrice = () => selectedSeats.length * seatPrice;

  const handleBookNow = () => {
    navigate('/book-now', {
      state: {
        hallType,
        movieTime,
        selectedSeats,
        totalPrice: calculateTotalPrice(),
      },
    });
  };

  const handleBackToFavorites = () => {
    navigate('/favorites');
  };

  return (
    <SideBar>
      <button
        className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 transition duration-300 ease-in-out"
        onClick={() => setShowConfirmation(true)}
      >
        <IoClose />
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-50 z-50">
          <div
            className="bg-dry border border-border p-12 rounded-lg shadow-lg text-center w-2/3 h-auto max-w-4xl"
            style={{ marginTop: '5rem' }}
          >
            <p className="text-xl font-bold mb-8">Are you sure you want to leave this page?</p>
            <div className="flex justify-center gap-8">
              <button
                className="bg-beige3 text-white px-8 py-3 rounded-lg hover:bg-beige3 transition-all"
                onClick={handleBackToFavorites}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-black px-8 py-3 rounded-lg hover:bg-gray-400 transition-all"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold hover:text-beige3">Booking from Site</h2>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Full Name" placeholder="Raghad Saud" type="text" bg={true} />
          <MobileInput label="Phone Number" placeholder="" onChange={(value) => console.log(value)} />
        </div>

        <div className="mt-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="hallType" className="text-sm font-medium text-border">
                Hall Type
              </label>
              <select
                id="hallType"
                value={hallType}
                onChange={(e) => handleHallTypeChange(e.target.value)}
                className="text-sm p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              >
                {availableHalls.map((hall) => (
                  <option key={hall.hallType} value={hall.hallType}>
                    {hall.hallType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="movieTime" className="text-sm font-medium text-border">
                Movie Time
              </label>
              <input
                id="movieTime"
                type="time"
                value={movieTime}
                onChange={(e) => setMovieTime(e.target.value)}
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige text-text"
              />
            </div>
          </div>

          <div className="mt-8 p-6">
            <h2 className="text-base font-semibold text-beige3 mb-4">Seat Layout</h2>
            {renderSeats()}

            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-border">Reserved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-border">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-border">Available</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="w-full bg-main p-4 rounded-2xl shadow-md border-2 border-border border-dashed">
              <div className="text-sm font-semibold text-border p-4">
                <span>Total Price: ${calculateTotalPrice()}</span>
              </div>

              <div className="flex gap-2 mt-2 p-2 items-center">
                {selectedSeats.map((seat, index) => (
                  <React.Fragment key={index}>
                    <div className="px-3 py-1 bg-green-500 text-white rounded-2xl">
                      {seat}
                    </div>
                    {index < selectedSeats.length - 1 && <span className="mx-2 text-white">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="mt-6 bg-beige3 w-full flex-rows gap-6 font-medium transitions hover:bg-dry border border-beige3 flex-rows text-white py-3 rounded-2xl transition-transform duration-300 hover:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </SideBar>
  );
};

export default Booking;