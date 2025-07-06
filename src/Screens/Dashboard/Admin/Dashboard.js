import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import { FaSearch } from "react-icons/fa";
import { FaRegListAlt, FaUser } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
import { MdFastfood } from "react-icons/md";
import Table from "../../../Components/Table";
import { movieService } from "../../../api/services";

import { snackService } from '../../../api/snackService';
import { authService } from '../../../api/services';

function Dashboard() {
  const [snacksCount, setSnacksCount] = useState(0);
  const [moviesCount, setMoviesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setCountsLoading(true);
      try {
        const [snacks, movies, users] = await Promise.all([
          snackService.getSnacksCount(),
          movieService.getMoviesCount(),
          authService.getUsersCount(),
        ]);
        setSnacksCount(snacks || 0);
        setMoviesCount(movies || 0);
        setUsersCount(users || 0);
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
        setSnacksCount(0);
        setMoviesCount(0);
        setUsersCount(0);
      } finally {
        setCountsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const DashboardData = [
    {
      bg: "bg-orange-600",
      icon: FaRegListAlt,
      title: "Total Movies",
      total: moviesCount,
    },
    {
      bg: "bg-blue-900",
      icon: MdFastfood,
      title: "Total Snacks",
      total: snacksCount,
    },
    {
      bg: "bg-green-600",
      icon: FaUser,
      title: "Total Users",
      total: usersCount,
    },
  ];
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 10;
  const [allFilteredMovies, setAllFilteredMovies] = useState([]);

  // دالة جلب الأفلام مستقلة
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getAllMovies({ PageIndex: 0, PageSize: 200 });
      if (response?.data?.success && Array.isArray(response.data.data)) {
        // ترتيب من الأحدث للأقدم حسب year أو id
        const sorted = [...response.data.data].sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          if (b.fromDate && a.fromDate && b.fromDate !== a.fromDate) return new Date(b.fromDate) - new Date(a.fromDate);
          return b.id - a.id;
        });
        // تحويل البيانات لنفس هيكل Table في MovieList.js
        const formatted = sorted.map((movie) => ({
          ...movie,
          Category: movie.movieTypes?.map((type) => type.englishName).join(", ") || "N/A",
          language: movie.movieLanguages?.map((lang) => lang.englishName).join(", ") || "N/A",
          time: movie.durationInMinutes ? `${movie.durationInMinutes} min` : "N/A",
          image: movie.image || movie.image?.url || "default-movie.jpg",
        }));
        setRecentMovies(formatted);
        setAllFilteredMovies(formatted);
      } else {
        setRecentMovies([]);
        setAllFilteredMovies([]);
      }
    } catch (err) {
      setRecentMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // فلترة الأفلام عند البحث
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAllFilteredMovies(recentMovies);
    } else {
      const filtered = recentMovies.filter(
        (movie) =>
          movie.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.year?.toString().includes(searchQuery)
      );
      setAllFilteredMovies(filtered);
    }
  }, [searchQuery, recentMovies]);

  // حساب عدد الصفحات
  useEffect(() => {
    const calculatedPages = Math.max(
      1,
      Math.ceil(allFilteredMovies.length / moviesPerPage)
    );
    setTotalPages(calculatedPages);
    setCurrentPage(1);
  }, [allFilteredMovies.length, moviesPerPage, searchQuery]);

  // الحصول على الأفلام للصفحة الحالية فقط
  const filteredMovies = allFilteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <SideBar>
      <h2 className="text-xl font-bold"> Dashboard </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {DashboardData.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-main border-border grid grid-cols-4 gap-2"
          >
            <div
              className={`col-span-1 rounded-full h-12 w-12 flex-colo ${data.bg}`}
            >
              <data.icon />
            </div>
            <div className="col-span-3">
              <h2>{data.title}</h2>
              {countsLoading ? (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                <p className="mt-2 font-bold">{data.total}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-md font-medium my-6 text-border"> Recent Movies</h3>
      {/* البحث */}
      <div className="flex items-center justify-start w-3/4 mb-4">
        <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md" onSubmit={e => e.preventDefault()}>
          <button
            type="button"
            className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            tabIndex={-1}
          >
            <FaSearch />
          </button>
          <input
            type="text"
            placeholder="Search Movie Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none px-2 py-2 text-white"
          />
        </form>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
          <span className="ml-3 text-white">Loading movies...</span>
        </div>
      ) : filteredMovies.length > 0 ? (
        <>
          <Table data={filteredMovies} admin={true} onMovieUpdate={fetchMovies} />
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-beige3 text-white hover:bg-dry"
                  } transition duration-300`}
                >
                  <span>&lt;</span>
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => goToPage(index + 1)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentPage === index + 1
                          ? "bg-beige3 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition duration-300`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-beige3 text-white hover:bg-dry"
                  } transition duration-300`}
                >
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {searchQuery ? "No movies found matching your search." : "No movies available."}
          </p>
        </div>
      )}
    </SideBar>
  );
}

export default Dashboard;
