import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import Table from '../../Components/Table';
import { FaSearch } from 'react-icons/fa';
import { movieService } from '../../api/services';
import useAuthErrorHandler from '../../hooks/useAuthErrorHandler';

function FavoritesMovies() {
  const [searchQuery, setSearchQuery] = useState('');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { executeApiCall } = useAuthErrorHandler('فشل تحميل أفلام Now Showing');

  useEffect(() => {
    const fetchNowShowing = async () => {
      setLoading(true);
      try {
        const response = await executeApiCall(() =>
          movieService.getAllMovies({ Status: 'Now Showing', PageSize: 100 })
        );
        if (response?.data?.success && response.data.data) {
          const formattedMovies = response.data.data.map((movie) => {
            // استخراج القاعات الفريدة من movieTimes
            const halls = Array.isArray(movie.movieTimes)
              ? movie.movieTimes.map(mt => mt.hall).filter(Boolean).reduce((acc, hall) => {
                  if (!acc.find(h => h.id === hall.id)) acc.push(hall);
                  return acc;
                }, [])
              : [];
            return {
              id: movie.id,
              name: movie.name,
              image: movie.image?.url || 'default-movie.jpg',
              Category: movie.movieTypes?.map((type) => type.englishName).join(', ') || 'N/A',
              language: movie.movieLanguages?.map((lang) => lang.englishName).join(', ') || 'N/A',
              year: movie.year,
              time: movie.durationInMinutes ? `${movie.durationInMinutes} min` : 'N/A',
              rate: movie.rate,
              desc: movie.description,
              titleImage: movie.secondaryImage?.url || movie.image?.url || 'default-movie.jpg',
              movieTimes: movie.movieTimes || [],
              halls,
              // يمكنك إضافة خصائص إضافية إذا احتجت
            };
          });
          setMovies(formattedMovies);
        } else {
          setMovies([]);
        }
      } catch (e) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNowShowing();
  }, [executeApiCall]);



  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="flex items-center justify-start w-3/4">
          <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
            <button
              type="button"
              onClick={() => console.log('Search button clicked')}
              className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search Movie Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
            />
          </form>
        </div>

        {/* Header */}
        <div className="flex-btn gap-2 mt-2">
          <h2 className="text-xl font-bold">Booking</h2>
        </div>

        {/* Table */}
        <Table data={movies} admin={false} />


      </div>
    </SideBar>
  );
}

export default FavoritesMovies;