import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Enjoy } from '../../Data/MovieData';

// مكون صورة مع لودر سبينر ذهبي
function ImageWithLoader({ src, alt, className }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className="relative w-full h-full">
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
        className={`w-full h-full object-cover animate-fadeIn rounded-2xl ${className || ''} ${loaded ? '' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}



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
                <ImageWithLoader
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
