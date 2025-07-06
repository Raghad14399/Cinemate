import React, { useRef, useState, useEffect } from 'react';
import { BsCaretLeft, BsCaretRight, BsClockHistory } from 'react-icons/bs'; 
import Titles from '../Titles';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { movieService } from '../../api/services';
import { Link } from 'react-router-dom';
import Rating from '../Stars';
import useAuthErrorHandler from '../../hooks/useAuthErrorHandler';
import 'swiper/css';
import 'swiper/css/navigation';

function getImageSrc(imageUrl) {
  if (!imageUrl || imageUrl === "default-movie.jpg") {
    return "/images/movies/default-movie.jpg";
  }
  if (imageUrl.startsWith("Images/")) {
    return `http://cinemate-001-site1.jtempurl.com/${imageUrl}`;
  }
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  return `/images/movies/${imageUrl}`;
}

function TopRated() {
  const nextElRef = useRef(null);
  const prevElRef = useRef(null);
  const classNames = "hover:bg-dry transitions text-sm rounded-2xl w-8 h-8 flex-colo bg-beige3 text-gray";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { executeApiCall } = useAuthErrorHandler("فشل تحميل أفلام Coming Soon");

  useEffect(() => {
    const fetchComingSoon = async () => {
      setLoading(true);
      try {
        const response = await executeApiCall(() =>
          movieService.getAllMovies({ Status: 'Coming Soon', PageSize: 12 })
        );
        if (response?.data?.success && response.data.data) {
          const formattedMovies = response.data.data.map((movie) => ({
            id: movie.id,
            name: movie.name,
            image: movie.image?.url || "default-movie.jpg",
            rate: movie.rate,
            desc: movie.description,
          }));
          setMovies(formattedMovies);
        }
      } catch (e) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComingSoon();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='my-16'>
      <Titles title='Coming Soon' Icon={BsClockHistory} />
      <div className='mt-10'>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading Coming Soon...</span>
          </div>
        ) : (
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
            {movies.map((movie, index) => (
              <SwiperSlide key={movie.id || index}>
                <div className='p-4 h-rate hovered border border-border bg-dry rounded-2xl overflow-hidden animate-fadeIn'>
                  <img
                    src={getImageSrc(movie.image)}
                    alt={movie.name}
                    className='w-full h-full object-cover rounded-2xl'
                    onError={e => { e.target.onerror = null; e.target.src = "/images/movies/default-movie.jpg"; }}
                  />
                  <div className='px-4 hoveres gap-6 text-center absolute bg-black bg-opacity-70 top-0 left-0 right-0 bottom-0 rounded-2xl'>
                    <Link
                      className='font-semibold text-xl truncated line-clamp-2'
                      to={`/movie/${movie.id}`}
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
        )}
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
