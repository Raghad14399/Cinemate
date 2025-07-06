import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage }) {
  if (totalPages <= 1) return null;

  // توليد أرقام الصفحات (كل الصفحات)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
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
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentPage === page
                  ? "bg-beige3 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition duration-300`}
            >
              {page}
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
  );
}

export default Pagination;
