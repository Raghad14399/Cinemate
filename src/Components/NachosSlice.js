import React from 'react';
import { Link } from 'react-router-dom';

function NachosSlice({ nachosSlice }) {
  return (
    <div className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
      <Link to={`/nachos/${nachosSlice?.name}`} className="w-full relative"> 
        <div className="overflow-hidden">
          <img
            src={`/images/Nachos/${nachosSlice?.image}`}
            alt={nachosSlice?.name}
            className="w-full h-64 object-cover scale-150"
          />
        </div>
      </Link>
      <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <h3 className="font-semibold truncate">{nachosSlice?.name}</h3>
      </div>
    </div>
  );
}

export default NachosSlice;
