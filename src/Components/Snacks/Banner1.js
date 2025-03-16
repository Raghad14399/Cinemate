import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Enjoy } from '../../Data/MovieData';


function Banner1() {
  return (
      <div className='relative w-full '>
        <Swiper 
          direction="vertical"
          slidesPerView={1} 
          loop={true} 
          speed={1000}
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className='w-full xl:h-96 bg-dry lg:h-64 h-48 rounded-2xl px-4'>
          {
            Enjoy.slice(0, 6).map((movie, index) => (
              <SwiperSlide key={index} className='relative rounded-2xl overflow-hidden'>
                <img 
                  src={`/images/${movie.image}`} 
                  alt={movie.name} 
                  className="w-full h-full object-cover animate-fadeIn" 
                />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
  );
}

export default Banner1
