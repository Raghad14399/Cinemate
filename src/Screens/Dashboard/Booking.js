import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import { Input, MobileInput } from '../../Components/UsedInputs';
import { IoClose } from 'react-icons/io5';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const navigate = useNavigate();
  const { state } = useLocation();

  // استخدام useMemo لتخزين قيمة availableHalls بشكل آمن
  // بيانات الفيلم كاملة (تم تمريرها من FavoritesMovies)
  const movieTimes = useMemo(() => Array.isArray(state?.movieTimes) ? state.movieTimes : [], [state]);
  const availableHalls = useMemo(() => Array.isArray(state?.availableHalls) ? state.availableHalls : [], [state]);

  // تحديد قائمة التواريخ المتاحة فعلياً للفيلم (unique)
  const availableDates = useMemo(() => {
    if (!Array.isArray(movieTimes) || movieTimes.length === 0) return [];
    const dates = movieTimes.map(mt => mt.date).filter(Boolean);
    // unique only
    return [...new Set(dates)].sort();
  }, [movieTimes]);

  // عند توفر تواريخ، اختر أول تاريخ متاح تلقائياً إذا لم يكن هناك تاريخ محدد أو إذا تغيرت القائمة
  useEffect(() => {
    if (availableDates.length > 0) {
      if (!selectedDate || !availableDates.includes(selectedDate)) {
        setSelectedDate(availableDates[0]);
      }
    } else if (selectedDate) {
      setSelectedDate("");
    }
  }, [availableDates]);

  // فلترة القاعات حسب التاريخ
  useEffect(() => {
    if (!selectedDate) {
      setFilteredHalls(availableHalls);
      return;
    }
    // القاعات التي لها أوقات عرض في هذا اليوم
    const hallsWithTimes = availableHalls.filter(hall =>
      movieTimes.some(mt => mt.hall?.id === hall.id && mt.date === selectedDate)
    );
    setFilteredHalls(hallsWithTimes);
  }, [selectedDate, availableHalls, movieTimes]);

  // الحالة لتتبع القاعة والوقت المختار
  const [selectedHallId, setSelectedHallId] = useState(null);
  const [selectedMovieTime, setSelectedMovieTime] = useState(null);
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(10);
  const [aisles, setAisles] = useState([]); // الممرات للقاعة المختارة

  useEffect(() => {
    // إذا تم اختيار قاعة ووقت، حدث الصفوف والأعمدة والممرات بناءً على القاعة
    if (selectedHallId && selectedMovieTime) {
      const hall = availableHalls.find(h => h.id === selectedHallId);
      if (hall) {
        setRows(hall.rowCount || hall.rows || 15);
        setColumns(hall.columnCount || hall.columns || 10);
        setAisles(Array.isArray(hall.aisles) ? hall.aisles : []);
      }
    }
  }, [selectedHallId, selectedMovieTime, availableHalls]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  // جلب المقاعد المحجوزة من الـ API عند تغيير القاعة أو وقت العرض
  useEffect(() => {
    const fetchReservedSeats = async () => {
      if (selectedMovieTime && selectedMovieTime.id) {
        try {
          // استخدم endpoint المناسب لجلب المقاعد المحجوزة
          const response = await fetch(`/api/Bookings/${selectedMovieTime.id}/booking-hall-chairs`);
          if (!response.ok) throw new Error("فشل في جلب المقاعد المحجوزة");
          const data = await response.json();
          // توقع أن البيانات عبارة عن مصفوفة أرقام أو رموز المقاعد
          setReservedSeats(Array.isArray(data) ? data : []);
        } catch (err) {
          setReservedSeats([]);
        }
      } else {
        setReservedSeats([]);
      }
    };
    fetchReservedSeats();
  }, [selectedMovieTime]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const seatPrice = 100;

  useEffect(() => {
    if (availableHalls.length > 0) {
      setRows(availableHalls[0].rows);
      setColumns(availableHalls[0].columns);
    }
  }, [availableHalls]);

  

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
        const isAisle = aisles.includes(seat);
        if (isAisle) {
          // رسم الممر كفراغ (غير قابل للنقر)
          row.push(
            <div
              key={seat}
              className="inline-flex items-center justify-center"
              style={{
                width: '50px',
                height: '50px',
                margin: '0 4px',
                border: '1px dashed gray',
                background: 'transparent',
              }}
            ></div>
          );
          continue;
        }
        const isReserved = reservedSeats.includes(seat);
        const isSelected = selectedSeats.includes(seat);
        row.push(
          <div
            key={seat}
            onClick={() => toggleSeatSelection(seat)}
            className={`relative cursor-pointer transition-all flex items-center justify-center ${
              isReserved
                ? 'bg-red-500 cursor-not-allowed'
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
              opacity: isReserved ? 0.6 : 1,
            }}
            title={seat}
          >
            <span
              className="text-[12px] text-white font-bold"
              style={{ opacity: 0.2 }}
            >
              {seat}
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
        selectedHallId,
        selectedMovieTime,
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
        <h2 className="text-xl font-bold hover:text-beige3">Book Your Ticket</h2>
        {/* Date Picker, only allowed dates for the movie */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-main p-4 rounded-2xl border border-beige3 shadow">
          <label className="text-sm font-semibold text-beige3 min-w-[90px]">Select Date:</label>
          <select
            className="p-2 rounded-xl border border-border bg-main text-white focus:outline-none focus:ring-2 focus:ring-beige3 transition-all shadow-sm min-w-[150px]"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            disabled={availableDates.length === 0}
          >
            <option value="">Choose a date...</option>
            {availableDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input label="Full Name" placeholder="e.g. John Doe" type="text" bg={true} />
          <MobileInput label="Phone Number" placeholder="" onChange={(value) => console.log(value)} />
        </div>

        <div className="mt-6">
          {/* واجهة اختيار القاعات وأوقات العرض */}
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            {filteredHalls.length === 0 && (
              <div className="col-span-2 text-center bg-[#f8e7d2] text-beige3 p-6 rounded-xl font-bold text-lg shadow">
                No halls available for this date. Please select another date.
              </div>
            )}
            {filteredHalls.map((hall) => {
              // جلب أوقات العرض الخاصة بهذه القاعة
              // Show only showtimes for this hall and selected date
              const hallMovieTimes = movieTimes.filter(mt => mt.hall?.id === hall.id && (!selectedDate || mt.date === selectedDate));
              return (
                <div
                  key={hall.id}
                  className={`bg-main border-2 border-border rounded-2xl p-5 shadow-lg flex flex-col gap-4 transition-all ${selectedHallId === hall.id ? 'border-beige3 shadow-beige3' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-beige3 mb-1">{hall.name}</h3>
                      <span className="text-xs text-border">{hall.isVip ? 'VIP' : 'Standard'} | {hall.chairCount} Seats</span>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${hall.isVip ? 'bg-yellow-700 text-yellow-300' : 'bg-gray-700 text-gray-200'}`}>{hall.isVip ? 'VIP' : 'Standard'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hallMovieTimes.length === 0 && <span className="text-xs text-gray-400">No showtimes available</span>}
                    {hallMovieTimes.map((mt) => (
                      <button
                        key={mt.id}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border border-beige3 transition-all ${selectedMovieTime?.id === mt.id ? 'bg-beige3 text-white' : 'bg-main text-beige3 hover:bg-beige3 hover:text-white'}`}
                        onClick={() => {
                          setSelectedHallId(hall.id);
                          setSelectedMovieTime(mt);
                        }}
                      >
                        {mt.time}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
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