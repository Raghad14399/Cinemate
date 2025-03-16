import React from 'react';

function Head({ title }) {
  return (
    <div className='w-10/12 bg-deepGray lg:h-96 relative overflow-hidden rounded-2xl mx-auto'> 
      <img 
        src="/images/head1.png" 
        alt="aboutus" 
        className='w-full h-full object-cover' 
      />
      <div className='absolute lg:top-40 top-32 w-full flex justify-center items-center'>
        <h1 className='text-2xl lg:text-h1 text-white text-center font-bold'>
          {title && title}
        </h1>
      </div>
    </div>
  );
}

export default Head;
