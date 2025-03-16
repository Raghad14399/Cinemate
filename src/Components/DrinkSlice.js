import React from 'react';
import { Link } from 'react-router-dom';

function DrinkSlice({ drinkSlice }) {
  return (
    <div className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
      <Link to={`/drink/${drinkSlice?.name}`} className="w-full relative"> 
        <div className="overflow-hidden">
        <img
  src={`/images/Drink/${drinkSlice?.image}`}
  alt={drinkSlice?.name}
  className="w-full h-64 object-contain scale-100"
/>
        </div>
      </Link>
      <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <h3 className="font-semibold truncate">{drinkSlice?.name}</h3>
      </div>
    </div>
  );
}

export default DrinkSlice
