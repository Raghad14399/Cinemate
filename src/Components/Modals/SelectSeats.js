import React from 'react';
import { IoClose } from 'react-icons/io5';

function SelectSeats({ isOpen, onClose, seats, reservedSeats, selectedSeats, toggleSeatSelection }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}

      {/* Dropdown content */}
      <div
        className={`relative bg-gray-800 text-white border border-border rounded-lg w-[95%] md:w-[800px] max-h-[80vh] p-6 overflow-y-auto transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? 'scale-100' : 'scale-100'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Select Your Seats</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-400">
            <IoClose />
          </button>
        </div>

        {/* Seats grid */}
        <div className="grid grid-cols-7 gap-4">
          <div className="flex flex-col justify-between items-center">
            {['A', 'B', 'C', 'D', 'E', 'F'].map((row) => (
              <span key={row} className="text-center">{row}</span>
            ))}
          </div>

          {/* Seats columns */}
          <div className="grid grid-cols-6 gap-16">
            {seats.map((seat) => {
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              let seatClasses = 'flex items-center justify-center cursor-pointer transition-all';
              if (isReserved) {
                seatClasses += ' bg-subMain cursor-not-allowed'; 
              } else if (isSelected) {
                seatClasses += ' bg-green-500'; 
              } else {
                seatClasses += ' hover:bg-gray-400'; 
              }

              return (
                <div
                  key={seat}
                  onClick={() => !isReserved && toggleSeatSelection(seat)} 
                  className={seatClasses}
                  style={{
                    width: '50px', 
                    height: '50px', 
                    backgroundImage: `url('/images/cinema.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '4px',
                  }}
                  title={seat}
                >
                  <span className="sr-only">{seat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSeats;
