import React from 'react';
import { MdFastfood } from 'react-icons/md';
import Titles from '../Titles';
import { Varieties } from '../../Data/MovieData';
import { useNavigate } from 'react-router-dom';

function SnackVarieties() {
  const navigate = useNavigate();

  const handleNavigation = (varietyName) => {
    if (varietyName === 'Popcorn') {
      navigate('/popcorn');
    }
    if (varietyName === 'Nachos') {
      navigate('/nachos');
    }
    if (varietyName === 'Drinks') {
      navigate('/drink');
    }
  };

  return (
    <div className='my-16 px-0'>
      <Titles title='Snack Varieties' Icon={MdFastfood} size={60} />

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:mt-12 mt-6'>
        {Varieties.slice(0, 3).map((variety, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(variety.name)}
            className='bg-dry border border-border shadow-md rounded-2xl p-4 flex flex-col items-center text-center transform transition-all duration-500 
            hover:scale-105 hover:shadow-xl hover:bg-lightGray relative cursor-pointer'
          >
            <div className="w-full h-64 overflow-hidden rounded-2xl relative">
              <img
                src={`/images/variety/${variety.image}`}
                alt={variety.name}
                className='w-full h-full object-cover transform transition-transform duration-500 hover:scale-110'
              />
              <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center text-white text-xl font-semibold'>
                <h3>{variety.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SnackVarieties;
