// //  في كل شي
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SideBar from '../SideBar';

// function CreateCinemaHall() {
//   const navigate = useNavigate();
//   const [hallNumber, setHallNumber] = useState('');
//   const [hallType, setHallType] = useState('Standard');
//   const [rows, setRows] = useState(5);
//   const [columns, setColumns] = useState(10);
//   const [aisles, setAisles] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [reservedSeats] = useState(['A1', 'B3', 'C5']);

//   const totalSeats = rows * columns;

//   const generateRowLabels = (count) => {
//     const labels = [];
//     for (let i = 0; i < count; i++) {
//       let label = '';
//       let num = i;
//       while (num >= 0) {
//         label = String.fromCharCode(65 + (num % 26)) + label;
//         num = Math.floor(num / 26) - 1;
//       }
//       labels.push(label);
//     }
//     return labels;
//   };

//   const configureHall = (type) => {
//     switch (type) {
//       case '4K':
//         return { rows: 12, columns: 10 };
//       case 'VIP':
//         return { rows: 8, columns: 10 };
//       default:
//         return { rows: 10, columns: 15 };
//     }
//   };

//   const handleHallTypeChange = (type) => {
//     setHallType(type);
//     const config = configureHall(type);
//     setRows(config.rows);
//     setColumns(config.columns);
//     setAisles([]);
//   };

//   const toggleSeatSelection = (seat) => {
//     if (reservedSeats.includes(seat)) return;
//     if (selectedSeats.includes(seat)) {
//       setSelectedSeats(selectedSeats.filter((s) => s !== seat));
//     } else {
//       setSelectedSeats([...selectedSeats, seat]);
//     }
//   };

//   const addAisle = (seat) => {
//     if (aisles.includes(seat)) {
//       // إذا كان الكرسي مدرجًا كممر، نقوم بإزالته (استعادته)
//       setAisles(aisles.filter((s) => s !== seat));
//     } else {
//       // إذا لم يكن الكرسي مدرجًا كممر، نقوم بإضافته
//       setAisles([...aisles, seat]);
//     }
//   };

//   const renderSeats = () => {
//     const rowLabels = generateRowLabels(rows);

//     // إضافة الصفوف والكراسي
//     return rowLabels.map((label, i) => {
//       const row = [];
//       for (let j = 1; j <= columns; j++) {
//         const seat = `${label}${j}`;
//         const isReserved = reservedSeats.includes(seat);
//         const isSelected = selectedSeats.includes(seat);
//         const isAisle = aisles.includes(seat);

//         // إذا كان الكرسي ممرًا، نترك فراغًا بدلاً من عرض الكرسي
//         if (isAisle) {
//           row.push(
//             <div
//               key={seat}
//               onContextMenu={(e) => {
//                 e.preventDefault(); // منع ظهور قائمة الزر الأيمن
//                 addAisle(seat); // استدعاء دالة التحويل إلى ممر أو استعادة الكرسي
//               }}
//               className="inline-flex items-center justify-center"
//               style={{
//                 width: '50px',
//                 height: '50px',
//                 margin: '0 4px',
//                 border: '1px dashed gray', // إظهار حدود خفيفة للممر
//               }}
//             ></div>
//           );
//           continue;
//         }

//         row.push(
//           <div
//             key={seat}
//             onClick={() => toggleSeatSelection(seat)}
//             onContextMenu={(e) => {
//               e.preventDefault(); // منع ظهور قائمة الزر الأيمن
//               addAisle(seat); // استدعاء دالة التحويل إلى ممر أو استعادة الكرسي
//             }}
//             className={`inline-flex items-center justify-center cursor-pointer transition-all ${
//               isReserved
//                 ? 'bg-red-500 cursor-not-allowed' // تلوين الكرسي المحجوز مسبقًا بالأحمر
//                 : isSelected
//                 ? 'bg-green-500'
//                 : 'hover:bg-gray-400'
//             }`}
//             style={{
//               width: '50px',
//               height: '50px',
//               backgroundImage: `url(${isReserved ? '/images/cinema.png' : isSelected ? '/images/cinema.png' : '/images/cinema.png'})`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               borderRadius: '4px',
//               margin: '0 4px',
//             }}
//             title={!isAisle ? seat : ''}
//           >
//             {!isAisle && ''}
//           </div>
//         );
//       }

//       return (
//         <div key={label} className="flex items-center gap-4">
//           {/* Row Label */}
//           <div className="w-[50px] flex items-center justify-center font-bold text-gray-700">
//             {label}
//           </div>
//           {/* Seats */}
//           <div className="flex gap-2" style={{ minWidth: `${columns * 58}px` }}>
//             {row}
//           </div>
//         </div>
//       );
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(`Hall Number: ${hallNumber}, Type: ${hallType}, Total Seats: ${totalSeats}`);
//     console.log(`Aisles: ${aisles}`);
//   };

//   return (
//     <SideBar>
//       <div className="p-6 bg-lightGray rounded-lg shadow-md">
//         <button
//           className="absolute top-4 right-4 text-gray-500 font-bold py-1 px-3 rounded-full"
//           onClick={() => navigate('/halls')}
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-bold text-white mb-6">Create a New Cinema Hall</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex gap-4">
//             <div className="flex flex-col gap-1 w-1/2">
//               <label htmlFor="hallNumber" className="text-sm font-medium text-border">
//                 Hall Number
//               </label>
//               <input
//                 id="hallNumber"
//                 type="text"
//                 value={hallNumber}
//                 onChange={(e) => setHallNumber(e.target.value)}
//                 placeholder="Enter hall number"
//                 className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
//               />
//             </div>
//             <div className="flex flex-col gap-1 w-1/2">
//               <label htmlFor="hallType" className="text-sm font-medium text-border">
//                 Hall Type
//               </label>
//               <select
//                 id="hallType"
//                 value={hallType}
//                 onChange={(e) => handleHallTypeChange(e.target.value)}
//                 className="text-sm p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
//               >
//                 <option value="Standard">Standard</option>
//                 <option value="VIP">VIP</option>
//                 <option value="4K">4K</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="flex flex-col gap-1 w-1/2">
//               <label htmlFor="rows" className="text-sm font-medium text-border">
//                 Rows
//               </label>
//               <input
//                 id="rows"
//                 type="text"
//                 value={rows}
//                 onChange={(e) => setRows(Number(e.target.value))}
//                 placeholder="Number of rows"
//                 className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
//               />
//             </div>
//             <div className="flex flex-col gap-1 w-1/2">
//               <label htmlFor="columns" className="text-sm font-medium text-border">
//                 Columns
//               </label>
//               <input
//                 id="columns"
//                 type="text"
//                 value={columns}
//                 onChange={(e) => setColumns(Number(e.target.value))}
//                 placeholder="Number of columns"
//                 className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-beige3 text-white text-sm font-medium rounded-2xl hover:bg-dry border border-beige3 transition duration-300"
//           >
//             Create Hall
//           </button>
//         </form>

//         {/* Legend Section */}
//         <div className="mt-6 flex justify-center items-center gap-6">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 bg-red-500 rounded-full"></div>
//             <span className="text-base text-gray-700">Reserved</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 bg-green-500 rounded-full"></div>
//             <span className="text-base text-gray-700">Selected</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 bg-transparent border border-gray-700 rounded-full"></div>
//             <span className="text-base text-gray-700">Aisle (Hidden)</span>
//           </div>
//         </div>

//         <div className="mt-10">
//           {/* Shared Scroll Container */}
//           <div
//             className="flex flex-col gap-4"
//             style={{
//               maxHeight: '500px',
//               overflowY: 'auto', // تمكين التمرير الرأسي المشترك
//               overflowX: 'auto', // تمكين التمرير الأفقي للكراسي
//             }}
//           >
//             {renderSeats()}
//           </div>
//         </div>
//       </div>
//     </SideBar>
//   );
// }

// export default CreateCinemaHall;

// ################################################
// ################################################
// ################################################
// ################################################



// حجز الكرسي وعمل ممر فقط

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';

function CreateCinemaHall() {
  const navigate = useNavigate();
  const [hallNumber, setHallNumber] = useState('');
  const [hallType, setHallType] = useState('Standard');
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(10);
  const [aisles, setAisles] = useState([]); // قائمة الممرات

  const totalSeats = rows * columns;

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

  const configureHall = (type) => {
    switch (type) {
      case '4K':
        return { rows: 12, columns: 10 };
      case 'VIP':
        return { rows: 8, columns: 10 };
      default:
        return { rows: 10, columns: 15 };
    }
  };

  const handleHallTypeChange = (type) => {
    setHallType(type);
    const config = configureHall(type);
    setRows(config.rows);
    setColumns(config.columns);
    setAisles([]);
  };

  const addAisle = (seat) => {
    if (aisles.includes(seat)) {
      setAisles(aisles.filter((s) => s !== seat)); // إزالة الكرسي من الممرات
    } else {
      setAisles([...aisles, seat]); // إضافة الكرسي إلى الممرات
    }
  };

  const renderSeats = () => {
    const rowLabels = generateRowLabels(rows);

    // إضافة الصفوف والكراسي
    return rowLabels.map((label, i) => {
      const row = [];
      for (let j = 1; j <= columns; j++) {
        const seat = `${label}${j}`;
        const isAisle = aisles.includes(seat); // هل الكرسي مدرج كممر؟

        // إذا كان الكرسي مدرجًا كممر، نعرض فراغًا
        if (isAisle) {
          row.push(
            <div
              key={seat}
              onClick={() => addAisle(seat)} // النقر بالزر الأيسر لاستعادة الكرسي
              className="inline-flex items-center justify-center"
              style={{
                width: '50px',
                height: '50px',
                margin: '0 4px',
                border: '1px dashed gray', // حدود خفيفة للممر
              }}
            ></div>
          );
          continue;
        }

        // إذا لم يكن الكرسي مدرجًا كممر، نعرضه بشكله الأصلي
        row.push(
          <div
            key={seat}
            onClick={() => addAisle(seat)} // النقر بالزر الأيسر لتحويل الكرسي إلى ممر
            className="inline-flex items-center justify-center cursor-pointer transition-all relative"
            style={{
              width: '50px',
              height: '50px',
              backgroundImage: `url(/images/cinema.png)`, // صورة الكرسي الأصلية
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '4px',
              margin: '0 4px',
            }}
            title={seat} // عرض اسم الكرسي عند التحويم
          >
            {/* الرقم الخاص بالكرسي مع الشفافية */}
            <span
              className="absolute text-gray-400 font-bold text-xs opacity-30"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {seat}
            </span>
          </div>
        );
      }

      return (
        <div key={label} className="flex items-center gap-4">
          {/* Row Label */}
          <div className="w-[50px] flex items-center justify-center font-bold text-gray-700">
            {label}
          </div>
          {/* Seats */}
          <div className="flex gap-2" style={{ minWidth: `${columns * 58}px` }}>
            {row}
          </div>
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Hall Number: ${hallNumber}, Type: ${hallType}, Total Seats: ${totalSeats}`);
    console.log(`Aisles: ${aisles}`);
  };

  return (
    <SideBar>
<div className="p-6 bg-lightGray rounded-lg shadow-md">
  <button
    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold py-1 px-3 rounded-full transition duration-300 ease-in-out"
    onClick={() => navigate('/halls')}
    aria-label="Close"
  >
    ✕
  </button>

        <h2 className="text-xl font-bold text-white mb-6">Create a New Cinema Hall</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="hallNumber" className="text-sm font-medium text-border">
                Hall Number
              </label>
              <input
                id="hallNumber"
                type="text"
                value={hallNumber}
                onChange={(e) => setHallNumber(e.target.value)}
                placeholder="Enter hall number"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
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
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
                <option value="4K">4K</option>
              </select>
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
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
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
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                placeholder="Number of columns"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-beige3 text-white text-sm font-medium rounded-2xl hover:bg-dry border border-beige3 transition duration-300"
          >
            Create Hall
          </button>
        </form>

        {/* Legend Section */}
        <div className="mt-6 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-cover bg-center"
              style={{
                backgroundImage: `url(/images/cinema.png)`,
              }}
            ></div>
            <span className="text-base text-gray-700">Seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-transparent border border-gray-700 rounded-full"
            ></div>
            <span className="text-base text-gray-700">Aisle (Hidden)</span>
          </div>
        </div>

        <div className="mt-10">
          {/* Shared Scroll Container */}
          <div
            className="flex flex-col gap-4"
            style={{
              maxHeight: '500px',
              overflowY: 'auto', // تمكين التمرير الرأسي المشترك
              overflowX: 'auto', // تمكين التمرير الأفقي للكراسي
            }}
          >
            {renderSeats()}
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default CreateCinemaHall;