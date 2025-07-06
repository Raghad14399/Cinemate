import React from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = "http://cinemate-001-site1.jtempurl.com"; // عدل إذا كان الدومين مختلفاً

function DrinkSlice({ drinkSlice }) {
  // معالجة رابط الصورة بنفس منطق SnackList
  let imgSrc = drinkSlice?.image?.url || '';
  if (!imgSrc || imgSrc === 'default-movie.jpg') {
    imgSrc = '/images/placeholder.png';
  } else if (imgSrc.startsWith('Images/')) {
    imgSrc = `${API_BASE_URL}/${imgSrc}`;
  } else if (!imgSrc.startsWith('http')) {
    imgSrc = `/images/snacks/${imgSrc}`;
  }

  return (
    <div className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
      <div className="relative w-full h-80 rounded-2xl overflow-hidden">
  <img
    src={imgSrc}
    alt={drinkSlice?.englishName}
    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
  />
</div>
      <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <div>
          <h3 className="font-semibold truncate">{drinkSlice?.englishName}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {drinkSlice.variants && drinkSlice.variants.length > 0 && drinkSlice.variants.map(variant => (
              <span key={variant.id} className="bg-beige3 text-main rounded px-2 py-0.5 text-xs font-bold">
                {variant.size} - {variant.price.toLocaleString()} SYP
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrinkSlice
