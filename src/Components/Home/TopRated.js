import React, { useRef } from 'react';
import { BsBookmarkStarFill, BsCaretLeft, BsCaretRight } from 'react-icons/bs'; 
import Titles from '../Titles';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Movies } from '../../Data/MovieData';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Rating from '../Stars';
import 'swiper/css';
import 'swiper/css/navigation';

function TopRated() {
  const nextElRef = useRef(null);
  const prevElRef = useRef(null);
  const classNames = "hover:bg-dry transitions text-sm rounded-2xl w-8 h-8 flex-colo bg-beige3 text-gray";

  return (
    <div className='my-16'>
      <Titles title='Top Rated' Icon={BsBookmarkStarFill} />
      <div className='mt-10'>
        <Swiper
          navigation={{ nextEl: nextElRef.current, prevEl: prevElRef.current }}
          slidesPerView={4}
          spaceBetween={40}
          autoplay={true}
          speed={1000}
          loop={true}
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => {
            swiper.params.navigation.nextEl = nextElRef.current;
            swiper.params.navigation.prevEl = prevElRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {Movies.map((movie, index) => (
            <SwiperSlide key={index}>
              <div className='p-4 h-rate hovered border border-border bg-dry rounded-2xl overflow-hidden animate-fadeIn'>
                <img
                  src={`/images/Movies/${movie.image}`}
                  alt={movie.name}
                  className='w-full h-full object-cover rounded-2xl'
                />
                <div className='px-4 hoveres gap-6 text-center absolute bg-black bg-opacity-70 top-0 left-0 right-0 bottom-0 rounded-2xl'>
                  <button className='w-12 h-12 flex-colo transitions hover:bg-beige3 rounded-full bg-white bg-opacity-30 text-white'>
                    <FaHeart />
                  </button>
                  <Link
                    className='font-semibold text-xl truncated line-clamp-2'
                    to={`/movie/${movie.name}`}
                  >
                    {movie.name}
                  </Link>
                  <div className='flex gap-2 text-star'>
                    <Rating value={movie.rate} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='w-full px-1 flex-rows gap-6 pt-12'>
          <button className={classNames} ref={prevElRef}>
            <BsCaretLeft />
          </button>
          <button className={classNames} ref={nextElRef}>
            <BsCaretRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopRated;
