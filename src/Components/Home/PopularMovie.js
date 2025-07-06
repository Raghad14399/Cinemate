import React, { useState, useEffect } from "react";
import { BsCollectionFill } from "react-icons/bs";
import Titles from "../Titles";
import Movie from "../Movie";
import Pagination from "./Pagination";
import { movieService } from "../../api/services";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";

function PopularMovie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 8;

  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to load Now Showing."
  );

  // تحميل الأفلام عند تحميل المكون
  useEffect(() => {
    loadPopularMovies(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // تحميل الأفلام الشائعة من الـ API
  const loadPopularMovies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await executeApiCall(() =>
        movieService.getAllMovies({
          orderByRate: true,
          Status: 'Now Showing',
          PageSize: moviesPerPage,
          PageIndex: page,
        })
      );
      if (response?.data?.success && response.data.data) {
        const formattedMovies = response.data.data.map((movie) => ({
          id: movie.id,
          name: movie.name,
          image: movie.image?.url || "default-movie.jpg",
          Category:
            movie.movieTypes?.map((type) => type.englishName).join(", ") ||
            "N/A",
          language:
            movie.movieLanguages?.map((lang) => lang.englishName).join(", ") ||
            "N/A",
          year: movie.year,
          time: movie.durationInMinutes
            ? `${movie.durationInMinutes} min`
            : "N/A",
          rate: movie.rate,
          desc: movie.description,
          titleImage:
            movie.secondaryImage?.url ||
            movie.image?.url ||
            "default-movie.jpg",
        }));
        setMovies(formattedMovies);
        // حاول استخراج totalPages من response إذا متاح، أو احسبه يدويًا
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else if (response.data.totalCount) {
          setTotalPages(Math.ceil(response.data.totalCount / moviesPerPage));
        } else {
          // fallback: إذا لم يوجد totalPages أو totalCount
          setTotalPages(formattedMovies.length < moviesPerPage ? page : page + 1);
        }
      }
    } catch (error) {
      console.error("Error loading Now Showing:", error);
    } finally {
      setLoading(false);
    }
  };

  // دوال الباجنيشن
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="my-16">
      <Titles title="Now Showing" Icon={BsCollectionFill} />

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
          <span className="ml-3 text-white">Loading Now Showing...</span>
        </div>
      ) : (
        <>
          <div className="grid sm:mt-12 mt-6 xl:grid-cols-4 sm:grid-cols-2 grid-gols-1 gap-10 animate-fadeIn">
            {movies.map((movie, index) => (
              <Movie key={movie.id || index} movie={movie} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
          />
        </>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            No "Now Showing" available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default PopularMovie;
