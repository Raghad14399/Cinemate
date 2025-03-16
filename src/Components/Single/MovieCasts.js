import React, { useRef } from 'react';
import Titles from '../Titles';
import { FaUserFriends } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules'; 
import { UsersData } from '../../Data/MovieData';
import { BsCaretLeft, BsCaretRight } from 'react-icons/bs'; 
import 'swiper/css';
import 'swiper/css/navigation';

function MovieCasts() {
  const nextElRef = useRef(null);
  const prevElRef = useRef(null);
  const classNames = "hover:bg-dry transitions text-sm rounded-2xl w-8 h-8 flex-colo bg-beige3 text-white";

  return (
    <div className='my-12'>
      <Titles title='Casts' Icon={FaUserFriends} />
      <div className='mt-10'>
        <Swiper
          navigation={{ nextEl: nextElRef.current, prevEl: prevElRef.current }} 
          slidesPerView={4}
          spaceBetween={40}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={1500}
          modules={[Autoplay, Navigation]} 
          onSwiper={(swiper) => {
            swiper.params.navigation.nextEl = nextElRef.current;
            swiper.params.navigation.prevEl = prevElRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {UsersData.map((user, i) => (
            <SwiperSlide key={i}>
              <div className='p-4 h-rate hovered border border-border bg-dry rounded-2xl overflow-hidden animate-fadeIn'>
                <img
                  src={`/images/${user.image}`}
                  alt={user.name}
                  className='w-full h-full object-cover rounded-2xl'
                />
                <div className='px-4 hoveres gap-6 text-center absolute bg-black bg-opacity-70 top-0 left-0 right-0 bottom-0 rounded-2xl'>
                  <p className='text-center text-white'>{user.name}</p> 
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

export default MovieCasts;
