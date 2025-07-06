import React, { useEffect, useState } from 'react';
import { snackService } from '../api/snackService';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Layout from '../Layout/Layout';

function Snaks() {
  const [snaks, setSnaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter snacks based on search query
  const filteredSnaks = snaks.filter(snak =>
    snak.englishName && snak.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic based on filtered snacks
  const totalPages = Math.ceil(filteredSnaks.length / itemsPerPage);
  const paginatedSnaks = filteredSnaks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Determine which items to display
  const itemsToDisplay = searchQuery ? filteredSnaks : paginatedSnaks;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  useEffect(() => {
    const fetchSnaks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await snackService.getAllSnacks({ SnakType: 'Snak', PageIndex: 0, PageSize: 1000 });
        if (res && res.data && Array.isArray(res.data)) {
          const englishSnaks = res.data.filter(item => item.englishName);
          setSnaks(englishSnaks);
        } else {
          setError("No snacks found.");
        }
      } catch (err) {
        setError("Failed to load snacks.");
      } finally {
        setLoading(false);
      }
    };
    fetchSnaks();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-height-screen containermx-auto px-2 my-6 animate-fadeIn">
          <div className="min-height-screen containermx-auto px-12 my-6">
            <div className="grid xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6 min-height-screen containermx-auto px-20 my-6" style={{minHeight: '400px'}}>
              <div className="col-span-full flex justify-center items-center min-h-[220px] mr-72">
                <svg className="animate-spin" width="60" height="60" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="35" cy="35" r="30" stroke="#D2CCB5" strokeWidth="8" />
                  <path d="M65 35a30 30 0 1 1-60 0" stroke="#080A1A" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12 text-red-500 font-bold">{error}</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="min-height-screen containermx-auto px-2 my-6 animate-fadeIn">
        <div className="min-height-screen containermx-auto px-12 my-6">
          {/* Search Bar */}
          <div className="my-8 px-20">
            <div className="flex items-center bg-dry p-2 rounded-lg border border-gray-600">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search for a snack..."
                className="w-full bg-transparent border-none focus:outline-none text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6 min-height-screen containermx-auto px-20 my-6">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((snak) => {
                let imgSrc = snak?.image?.url || '';
                if (!imgSrc || imgSrc === 'default-movie.jpg') {
                  imgSrc = '/images/placeholder.png';
                } else if (imgSrc.startsWith('Images/')) {
                  imgSrc = `http://cinemate-001-site1.jtempurl.com/${imgSrc}`;
                } else if (!imgSrc.startsWith('http')) {
                  imgSrc = `/images/snacks/${imgSrc}`;
                }
                return (
                  <div key={snak.id} className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={snak.englishName}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                    <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
                      <div>
                        <h3 className="font-semibold truncate">{snak.englishName}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {snak.variants && snak.variants.length > 0 && snak.variants.map(variant => (
                            <span key={variant.id} className="bg-beige3 text-main rounded px-2 py-0.5 text-xs font-bold">
                              {variant.size} - {variant.price.toLocaleString()} SYP
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 font-bold">
                {searchQuery ? "No snacks found matching your search." : "No snacks available."}
              </div>
            )}
          </div>
          
          {/* Pagination - Hide when searching */}
          {!searchQuery && totalPages > 1 && (
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
                  <FaChevronLeft size={14} />
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }).map((_, index) => (
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
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Snaks;
