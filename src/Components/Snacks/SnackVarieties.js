import React, { useEffect, useState } from 'react';
import { MdFastfood } from 'react-icons/md';
import Titles from '../Titles';
import { useNavigate } from 'react-router-dom';
import { snackService } from '../../api/snackService';

// مكون صورة مع لودر سبينر ذهبي
function ImageWithLoader({ src, alt }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-100">
      {!loaded && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 z-10">
          <svg className="animate-spin" width="40" height="40" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="#D2CCB5" strokeWidth="8" />
            <path d="M65 35a30 30 0 1 1-60 0" stroke="#080A1A" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}


function SnackVarieties() {
  const navigate = useNavigate();
  const [snackTypes, setSnackTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const snackTypeObject = { id: 'static_snack', type: 'Snak', englishName: 'Snacks' };
    const drinkTypeObject = { id: 'static_drink', type: 'Drink', englishName: 'Drinks' };
    setSnackTypes([snackTypeObject, drinkTypeObject]);
    setLoading(false);
  }, []);

  const handleNavigation = (type) => {
    if (type === 'Snak') {
      navigate('/snaks');
    }
    if (type === 'Drink') {
      navigate('/drink');
    }
  };

  return (
    <div className='my-16 px-0'>
      <Titles title='Snack Varieties' Icon={MdFastfood} size={60} />
      {loading ? (
        <div className="flex justify-center items-center min-h-[180px]">
          <svg className="animate-spin" width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" stroke="#D2CCB5" strokeWidth="8" />
            <path d="M65 35a30 30 0 1 1-60 0" stroke="#080A1A" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:mt-12 mt-6'>
          {snackTypes.map((snack) => {
            let imgSrc;
            if (snack.type === 'Snak') {
              imgSrc = '/Snacks.png';
            } else if (snack.type === 'Drink') {
              imgSrc = '/Drink.png';
            } else {
              imgSrc = '/images/placeholder.png';
            }
            
            return (
              <div
                key={snack.id}
                onClick={() => handleNavigation(snack.type)}
                className="bg-dry border border-border shadow-md rounded-2xl p-4 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:bg-lightGray relative cursor-pointer"
              >
                <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                  <ImageWithLoader src={imgSrc} alt={snack.englishName} />
                </div>
                <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
                  <h3 className="font-semibold truncate">{snack.englishName}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SnackVarieties;
