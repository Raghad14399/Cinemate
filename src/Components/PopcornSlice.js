import React from 'react';
import { Link } from 'react-router-dom';

function PopcornSlice({ popcornSlice }) {
  return (
    <div className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
      <Link to={`/popcorn/${popcornSlice?.englishName}`} className="w-full relative">
        <div className="overflow-hidden">
          <img
            src={popcornSlice?.image && popcornSlice?.image.url ? popcornSlice.image.url : '/images/logo1.png'}
            alt={popcornSlice?.englishName}
            className="w-full h-64 object-cover scale-150"
          />
        </div>
      </Link>
      <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <h3 className="font-semibold truncate">{popcornSlice?.englishName}</h3>
      </div>
    </div>
  );
}

export default PopcornSlice;
