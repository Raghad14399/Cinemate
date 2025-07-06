import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table";
import SideBar from "../SideBar";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { movieService } from "../../../api/services";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";

function MoviesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false); // حالة النافذة المنبثقة
  const [movies, setMovies] = useState([]); // قائمة الأفلام من الـ API
  const [allFilteredMovies, setAllFilteredMovies] = useState([]); // جميع الأفلام المفلترة
  const [loading, setLoading] = useState(false); // حالة التحميل

  // متغيرات التصفح (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 10; // عدد الأفلام في كل صفحة

  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to load movies. Please try again."
  );

  // تحميل الأفلام عند تحميل المكون
  useEffect(() => {
    loadMovies();
  }, []);

  // فلترة الأفلام عند تغيير البحث
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAllFilteredMovies(movies);
    } else {
      const filtered = movies.filter(
        (movie) =>
          movie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.year.toString().includes(searchQuery)
      );
      setAllFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  // حساب عدد الصفحات وإعادة تعيين الصفحة الحالية
  useEffect(() => {
    // عند البحث، لا نعرض pagination
    if (searchQuery) {
      console.log(
        `Search mode: not calculating pages, showing all ${allFilteredMovies.length} results`
      );
      setTotalPages(1); // تعيين صفحة واحدة فقط عند البحث
      setCurrentPage(1);
      return;
    }

    // عند عدم البحث، نحسب عدد الصفحات بناءً على إجمالي عدد الأفلام
    const calculatedPages = Math.max(
      1,
      Math.ceil(movies.length / moviesPerPage)
    );
    console.log(
      `Normal mode: calculating ${calculatedPages} pages for ${movies.length} items (moviesPerPage=${moviesPerPage})`
    );
    setTotalPages(calculatedPages);
    // إعادة تعيين الصفحة الحالية إلى 1 عند تغيير نتائج البحث
    setCurrentPage(1);
  }, [allFilteredMovies.length, movies.length, moviesPerPage, searchQuery]);

  // تحميل الأفلام من الـ API
  const loadMovies = async () => {
    setLoading(true);
    try {
      // جلب جميع الأفلام مع PageSize كبير لضمان الحصول على جميع البيانات
      const response = await executeApiCall(() =>
        movieService.getAllMovies({
          PageIndex: 0,
          PageSize: 1000, // رقم كبير لجلب جميع الأفلام
        })
      );

      if (response?.data?.success && response.data.data) {
        // تحويل البيانات لتتوافق مع Table component
        const formattedMovies = response.data.data.map((movie) => ({
          id: movie.id,
          name: movie.name,
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
          image: movie.image?.url || "default-movie.jpg",
          status: movie.status,
          rate: movie.rate,
          description: movie.description,
          trailerUrl: movie.trailerUrl,
          fromDate: movie.fromDate,
          toDate: movie.toDate,
          movieClassification: movie.movieClassification,
          director: movie.director,
          movieCasts: movie.movieCasts,
          movieTimes: movie.movieTimes,
          imageID: movie.image?.id,
          secondaryImageID: movie.secondaryImage?.id,
          movieLanguageIds: movie.movieLanguages?.map((lang) => lang.id) || [],
          movieSubtitleIds: movie.movieSubtitles?.map((sub) => sub.id) || [],
          movieTypeIds: movie.movieTypes?.map((type) => type.id) || [],
          movieClassificationId: movie.movieClassification?.id,
          movieCastIds: movie.movieCasts?.map((cast) => cast.id) || [],
          durationInMinutes: movie.durationInMinutes,
        }));

        setMovies(formattedMovies);
        setAllFilteredMovies(formattedMovies);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // الحصول على الأفلام للصفحة الحالية فقط
  const filteredMovies = searchQuery
    ? allFilteredMovies // عند البحث، نعرض جميع النتائج بدون تقسيم للصفحات
    : allFilteredMovies.slice(
        (currentPage - 1) * moviesPerPage,
        currentPage * moviesPerPage
      );

  // دوال التنقل بين الصفحات
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // دالة لفتح النافذة المنبثقة
  const openAlert = () => {
    setIsAlertOpen(true);
  };

  // دالة لإغلاق النافذة المنبثقة
  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  // دالة لتنفيذ الإجراء عند التأكيد
  const handleConfirm = () => {
    console.log("All items deleted!");
    closeAlert(); // إغلاق النافذة بعد التأكيد
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="flex items-center justify-start w-3/4">
          <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
            <button
              type="button"
              onClick={() => console.log("Search button clicked")}
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
        <div className="flex-btn gap-2 ">
          <h2 className="text-xl font-bold">Movies List</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading movies...</span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <Table
            data={filteredMovies}
            admin={true}
            onMovieUpdate={loadMovies} // تمرير دالة إعادة التحميل
          />
        )}

        {/* No Movies Found */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchQuery
                ? "No movies found matching your search."
                : "No movies available."}
            </p>
          </div>
        )}

        {/* Pagination - عرض شريط التنقل بين الصفحات فقط إذا كان هناك أكثر من صفحة واحدة وليس هناك بحث نشط */}
        {!searchQuery && totalPages > 1 && movies.length > moviesPerPage && (
          <div className="flex justify-center items-center mt-8">
            <div className="flex items-center space-x-2">
              {/* زر الصفحة السابقة */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-beige3 text-white hover:bg-dry"
                } transition duration-300`}
              >
                <FaChevronLeft size={14} />
              </button>

              {/* أرقام الصفحات */}
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

              {/* زر الصفحة التالية */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-beige3 text-white hover:bg-dry"
                } transition duration-300`}
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Pop-up Alert */}
        {isAlertOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={closeAlert} // إغلاق النافذة عند النقر خارجها
          >
            <div
              className="bg-dry p-8 rounded-2xl shadow-lg text-center w-[90%] md:w-[400px]"
              onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخلها
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Are you sure?
              </h3>
              <p className="text-gray-400 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition duration-300"
                  onClick={handleConfirm} // تنفيذ الإجراء عند التأكيد
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-700 transition duration-300"
                  onClick={closeAlert} // إغلاق النافذة عند الإلغاء
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SideBar>
  );
}

export default MoviesList;
