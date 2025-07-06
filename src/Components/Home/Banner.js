import React, { useState, useEffect } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FlexMovieItems from "../FlexMovieItems";
import { Link } from "react-router-dom";
import { movieService } from "../../api/services";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";

function Banner() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to load banner movies."
  );

  // تحميل الأفلام عند تحميل المكون
  useEffect(() => {
    loadBannerMovies();
  }, []);

  // تحميل أفلام البانر من الـ API
  const loadBannerMovies = async () => {
    setLoading(true);
    try {
      const response = await executeApiCall(() =>
        movieService.getAllMovies({
          Status: "Now Showing", // الأفلام المعروضة حالياً
          PageSize: 6, // أول 6 أفلام
        })
      );

      if (response?.data?.success && response.data.data) {
        // معالجة المدة وتحويلها إلى time
        const formattedMovies = response.data.data.map((movie) => ({
          ...movie,
          time: movie.durationInMinutes ? `${movie.durationInMinutes} min` : "N/A",
        }));
        setMovies(formattedMovies);
      }
    } catch (error) {
      console.error("Error loading banner movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتحديد مصدر الصورة الصحيح
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) {
      return "/images/movies/default-movie.jpg";
    }

    if (imageUrl.startsWith("Images/")) {
      return `http://cinemate-001-site1.jtempurl.com/${imageUrl}`;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `/images/movies/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="relative w-full xl:h-96 lg:h-64 h-48 bg-dry rounded-2xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
        <span className="ml-3 text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full ">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        loop={movies.length > 1}
        speed={1000}
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full xl:h-96 bg-dry lg:h-64 h-48 rounded-2xl"
      >
        {movies.map((movie, index) => (
          <SwiperSlide
            key={movie.id || index}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src={getImageSrc(movie.image?.url)}
              alt={movie.name}
              className="w-full h-full object-cover animate-fadeIn"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/movies/default-movie.jpg";
              }}
            />
            <div className="absolute linear-bg xl:pl-52 sm:pl-32 pl-8 top-0 bottom-0 right-0 left-0 flex flex-col justify-center lg:gap-8 md:gap-5 gap-4">
              <h1 className="xl:text-4xl truncate capitalize font-sans sm:text-2xl text-xl font-bold">
                {movie.name}
              </h1>
              <div className="flex gap-5 items-center text-dryGray">
                <FlexMovieItems movie={movie} />
              </div>
              <div className="flex gap-5 items-center">
                <Link
                  to={`/watch/${movie.id}`}
                  className="bg-beige3 hover:text-main transition text-white px-8 py-3 rounded-2xl font-medium sm:text-sm text-xs"
                >
                  Watch Now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Banner;
