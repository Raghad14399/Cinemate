import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { useParams } from "react-router-dom";
import { movieService } from "../api/services";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";
import MovieInfo from "../Components/Single/MovieInfo";
import MovieCasts from "../Components/Single/MovieCasts";
import "swiper/css";
import "swiper/css/navigation";

function SingleMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to load movie details."
  );

  // تحميل تفاصيل الفيلم عند تحميل المكون
  useEffect(() => {
    if (id) {
      loadMovieDetails();
    }
  }, [id]);

  // تحميل تفاصيل الفيلم من الـ API
  const loadMovieDetails = async () => {
    setLoading(true);
    try {
      // محاولة تحميل الفيلم بـ ID أولاً
      let response;

      if (!isNaN(id)) {
        // إذا كان ID رقمي، استخدم getMovieById
        response = await executeApiCall(() =>
          movieService.getMovieById(parseInt(id))
        );
      } else {
        // إذا كان ID نصي (اسم الفيلم)، ابحث في جميع الأفلام
        const allMoviesResponse = await executeApiCall(() =>
          movieService.getAllMovies()
        );
        if (allMoviesResponse?.data?.success && allMoviesResponse.data.data) {
          const foundMovie = allMoviesResponse.data.data.find(
            (movie) =>
              movie.name.toLowerCase() === id.toLowerCase() ||
              movie.name.replace(/\s+/g, "-").toLowerCase() === id.toLowerCase()
          );
          if (foundMovie) {
            response = { data: { success: true, data: foundMovie } };
          }
        }
      }

      if (response?.data?.success && response.data.data) {
        // تحويل البيانات لتتوافق مع MovieInfo component
        const movieData = response.data.data;
        const formattedMovie = {
          id: movieData.id,
          name: movieData.name,
          image: movieData.image?.url || "default-movie.jpg",
          titleImage:
            movieData.secondaryImage?.url ||
            movieData.image?.url ||
            "default-movie.jpg",
          Category:
            movieData.movieTypes?.map((type) => type.englishName).join(", ") ||
            "N/A",
          language:
            movieData.movieLanguages
              ?.map((lang) => lang.englishName)
              .join(", ") || "N/A",
          year: movieData.year,
          time: movieData.durationInMinutes
            ? `${movieData.durationInMinutes} min`
            : "N/A",
          rate: movieData.rate,
          desc: movieData.description,
          video: movieData.trailerUrl,
          status: movieData.status,
          fromDate: movieData.fromDate,
          toDate: movieData.toDate,
          movieClassification: movieData.movieClassification,
          director: movieData.director,
          movieCasts: movieData.movieCasts,
          movieTimes: movieData.movieTimes,
        };

        setMovie(formattedMovie);
      }
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full xl:h-screen flex justify-center items-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige3"></div>
          <span className="ml-3">Loading movie details...</span>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="w-full xl:h-screen flex justify-center items-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
            <p className="text-gray-400">
              The movie you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MovieInfo movie={movie} />
      <div className="container mx-auto min-h-screen px-2 my-6 animate-fadeIn">
        <MovieCasts movie={movie} />
      </div>
    </Layout>
  );
}

export default SingleMovie;
