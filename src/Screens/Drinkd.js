import React from 'react';
import Layout from '../Layout/Layout';
import DrinkSlice from '../Components/Snacks/DrinkSlice';
import DrinksGrid from './DrinksGrid';

function Drinkd() {
  return (
    <Layout>
      <div className='min-height-screen containermx-auto px-2 my-6 animate-fadeIn'> 
        <div className='min-height-screen containermx-auto px-12 my-6'>
          <div className='min-height-screen containermx-auto px-20 my-6'> 
            {/* سيتم جلب البيانات من DrinkSlice الرئيسي هنا */}
            <DrinksGrid />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Drinkd;