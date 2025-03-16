
import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { CgSpinner } from 'react-icons/cg';
import { Drink } from '../Data/PopcornData';
import DrinkSlice from '../Components/DrinkSlice';

function Drinkd() {
  const maxPage = 8;
  const [page, setPage] = useState(maxPage);

  const HandleLoadingMore = () => {
    setPage(page + maxPage);
  };

  return (
    <Layout>
      <div className='min-height-screen containermx-auto px-2 my-6 animate-fadeIn'> 
        <div className='min-height-screen containermx-auto px-12 my-6'>

          <div className='grid xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6 min-height-screen containermx-auto px-20 my-6'> 
            {Drink.slice(0, page).map((drinkSlice, index) => (
              <DrinkSlice key={index} drinkSlice={drinkSlice} />
            ))}
          </div>
          {/* Loading more */}
          <div className='w-full flex-colo md:my-20 my-10'>
            <button onClick={HandleLoadingMore} className='flex-rows gap-3 text-white py-3 px-8 rounded-2xl font-semibold border-2 border-beige3'>
              Loading More <CgSpinner className='animate-spin' />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Drinkd