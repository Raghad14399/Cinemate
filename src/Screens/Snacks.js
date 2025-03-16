import React from 'react';
import Layout from './../Layout/Layout'; 
import PopularSnack from '../Components/Snacks/SnackVarieties';
import Banner1 from '../Components/Snacks/Banner1';

function Snacks() {
  return (
    <Layout>
      <div className='min-height-screen containermx-auto px-32 my-6 animate-fadeIn'>
          <Banner1/>
          <PopularSnack/>
      </div>
    </Layout>
  );
}

export default Snacks;
