import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlay, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ShareSidebar from "../../Components/Modals/ShareSidebar";
import FlexMovieItems from "../FlexMovieItems";

function MovieInfo({ movie }) {
  const [play, setPlay] = useState(false);

  // دالة لتحويل رابط يوتيوب إلى صيغة embed
  function getEmbedUrl(url) {
    if (!url) return null;
    if (url.includes("/embed/")) return url;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }
  const [isShareOpen, setIsShareOpen] = useState(false);

  // دالة لتحديد مصدر الصورة الصحيح
  const getImageSrc = (imageUrl) => {
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
  };

  if (!movie) {
    return (
      <div className="w-full xl:h-screen flex justify-center items-center text-white">
        <AiOutlineLoading3Quarters className="animate-spin text-6xl" />
      </div>
    );
  }

   return (
    <div className="w-full xl:h-screen relative text-white animate-fadeIn">
     
      <img
        src={getImageSrc(movie?.titleImage || movie?.image)}
        alt={movie.name}
        className="w-full hidden xl:inline-block h-full object-cover rounded-2xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/movies/default-movie.jpg";
        }}
      />
      <div className="xl:bg-main bg-dry flex-colo xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0">
        <div className="container px-3 mx-auto 2xl:px-32 xl:grid grid-cols-3 flex-colo py-10 lg:py-20 gap-8">
          <div className="xl:col-span-1 w-full xl:order-none order-last h-header bg-dry border border-gray-800 border-solid rounded-2xl overflow-hidden shadow-lg">
            <img
              src={getImageSrc(movie?.image)}
              alt={movie?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/movies/default-movie.jpg";
              }}
            />
          </div>
          <div className="xl:col-span-2 md:grid grid-cols-5 gap-4 items-center">
            <div className="col-span-3 flex flex-col gap-10">
              {/* Title */}
              <h1 className="xl:text-4xl capitalize font-sans text-2xl font-bold">
                {movie?.name}
              </h1>
              {/* Flex item */}
              <div className="flex items-center gap-4 font-medium text-dryGray">
                <div className="flex-colo bg-beige3 text-xs px-2 py-1 rounded-2xl shadow">
                  HD 4K
                </div>
                <FlexMovieItems movie={movie && movie} />
              </div>

              {/* Descriptions */}
              <p className="text-text text-sm leading-7">{movie?.desc}</p>
              <div className="grid sm:grid-cols-5 grid-cols-3 gap-4 p-6 bg-main border border-gray-800 border-solid rounded-2xl shadow-lg">
                {/* Share */}
                <div className="col-span-1 flex-colo border-r border-border">
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="w-10 h-10 flex-colo rounded-2xl bg-white bg-opacity-20 hover:bg-opacity-40 transition-all duration-300"
                  >
                    <FaShareAlt />
                  </button>
                </div>
                {/* language */}
                <div className="col-span-2 font-medium text-sm">
                  <p className="text-text mb-2">Language:</p>
                  <div className="flex flex-wrap -m-1">
                    {movie?.language && movie.language !== 'N/A' ? (
                      movie.language.split(',').map((lang, index) => (
                        <div key={index} className="p-1 w-1/2">
                          <div className="bg-dry p-2 rounded-lg text-center w-full">
                            <span className="truncate">{lang.trim()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-1 w-full">
                        <span className="ml-2 truncate">N/A</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* watch button */}
                <div className="sm:col-span-2 col-span-3 flex justify-end font-medium text-sm">
                  <Link
                    to={`/watch/${movie?.id}`}
                    className="bg-dry py-4 hover:bg-beige3 transition-all duration-300 border-2 border-beige3 rounded-full flex-rows gap-4 w-full sm:py-3 px-4"
                  >
                    <FaPlay className="w-3 h-3" /> Watch
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-2 md:mt-0 mt-2 flex justify-end">
              <div className="md:w-1/4 w-full relative">
                <div className="flex-colo bg-beige3 hover:bg-transparent border-2 border-beige3 transition-all duration-300 md:h-64 h-24 rounded-2xl font-medium">
                  <div className="flex flex-col gap-2 justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:rotate-90 whitespace-nowrap">
                    <button 
                      onClick={() => window.open('https://drive.google.com/drive/folders/1O0O0XzTT8FB1zkWl2f43-UFcrQ2rimuu?usp=drive_link', '_blank')}
                      className="w-full h-full text-xl font-bold uppercase tracking-wider"
                    >
                      Download App
                    </button>
                    <div className="text-xs tracking-tight">For movie booking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Sidebar */}
      <ShareSidebar
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}

export default MovieInfo;
