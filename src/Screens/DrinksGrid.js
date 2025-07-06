import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DrinkSlice from '../Components/DrinkSlice';
import { snackService } from '../api/snackService';

function DrinksGrid() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter drinks based on search query
  const filteredDrinks = drinks.filter(drink =>
    drink.englishName && drink.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic based on filtered drinks
  const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage);
  const paginatedDrinks = filteredDrinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Determine which items to display
  const itemsToDisplay = searchQuery ? filteredDrinks : paginatedDrinks;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  useEffect(() => {
    const fetchDrinks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await snackService.getAllSnacks({ SnakType: 'Drink', PageIndex: 0, PageSize: 1000 });
        if (res && res.data && Array.isArray(res.data)) {
          const englishDrinks = res.data.filter(item => item.englishName);
          setDrinks(englishDrinks);
        } else {
          setError("No drinks found.");
        }
      } catch (err) {
        setError("Failed to load drinks.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
  }, []);

  if (loading) {
    return (
      <div className="min-height-screen containermx-auto px-2 my-6 animate-fadeIn">
        <div className="min-height-screen containermx-auto px-12 my-6">
          <div className="grid xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6 min-height-screen containermx-auto px-20 my-6">
            <div className="col-span-full flex justify-center items-center min-h-[220px]">
              <svg className="animate-spin" width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="35" r="30" stroke="#D2CCB5" strokeWidth="8" />
                <path d="M65 35a30 30 0 1 1-60 0" stroke="#080A1A" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-12 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="my-8">
        <div className="flex items-center bg-dry p-2 rounded-lg border border-gray-600">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for a drink..."
            className="w-full bg-transparent border-none focus:outline-none text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid for drinks */}
      <div className='grid xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6'>
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((drink, index) => (
            <DrinkSlice key={drink.id || index} drinkSlice={drink} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold">
            {searchQuery ? "No drinks found matching your search." : "No drinks available."}
          </div>
        )}
      </div>

      {/* Pagination - Hide when searching */}
      {!searchQuery && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 md:my-12">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-beige3 text-white hover:bg-dry'
              } transition duration-300`}
            >
              <FaChevronLeft size={14} />
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentPage === page
                      ? 'bg-beige3 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition duration-300`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-beige3 text-white hover:bg-dry'
              } transition duration-300`}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrinksGrid;
