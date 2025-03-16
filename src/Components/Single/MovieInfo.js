import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaPlay, FaShareAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ShareSidebar from '../../Components/Modals/ShareSidebar'; 
import FlexMovieItems from '../FlexMovieItems';

function MovieInfo({ movie }) {
  const [isShareOpen, setIsShareOpen] = useState(false); 

  if (!movie) {
    return (
      <div className='w-full xl:h-screen flex justify-center items-center text-white'>
        <AiOutlineLoading3Quarters className='animate-spin text-6xl' />
      </div>
    );
  }

  return (
    <div className='w-full xl:h-screen relative text-white animate-fadeIn'>
      <img
        src={`/images/Movies/${movie?.image}`}
        alt={movie.name}
        className='w-full hidden xl:inline-block h-full object-cover rounded-2xl'
      />
      <div className='xl:bg-main bg-dry flex-colo xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0'>
        <div className='container px-3 mx-auto 2xl:px-32 xl:grid grid-cols-3 flex-colo py-10 lg:py-20 gap-8'>
          <div className='xl:col-span-1 w-full xl:order-none order-last h-header bg-dry border border-gray-800 rounded-2xl overflow-hidden shadow-lg'>
            <img
              src={`/images/Movies/${movie?.image}`}
              alt={movie?.name}
              className='w-full h-full object-cover'
            />
          </div>
          <div className='xl:col-span-2 md:grid grid-cols-5 gap-4 items-center'>
            <div className='col-span-3 flex flex-col gap-10'>
              {/* Title */}
              <h1 className='xl:text-4xl capitalize font-sans text-2xl font-bold'>
                {movie?.name}
              </h1>
              {/* Flex item */}
              <div className='flex items-center gap-4 font-medium text-dryGray'>
                <div className='flex-colo bg-beige3 text-xs px-2 py-1 rounded-2xl shadow'>
                  HD 4K
                </div>
                <FlexMovieItems movie={movie && movie}/>
              </div>

              {/* Descriptions */}
              <p className='text-text text-sm leading-7'>
                {movie?.desc}
              </p>
              <div className='grid sm:grid-cols-5 grid-cols-3 gap-4 p-6 bg-main border border-gray-800 rounded-2xl shadow-lg'>
                {/* Share */}
                <div className='col-span-1 flex-colo border-r border-border'>
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className='w-10 h-10 flex-colo rounded-2xl bg-white bg-opacity-20 hover:bg-opacity-40 transition-all duration-300'
                  >
                    <FaShareAlt />
                  </button>
                </div>
                {/* language */}
                <div className='col-span-2 flex-colo font-medium text-sm'>
                  <p>
                    Language: {' '}
                    <span className='ml-2 truncate'>
                      {movie?.language}
                    </span>
                  </p>
                </div>
                {/* watch button */}
                <div className='sm:col-span-2 col-span-3 flex justify-end font-medium text-sm'>
                  <Link to={`/watch/${movie?.name}`} className='bg-dry py-4 hover:bg-beige3 transition-all duration-300 border-2 border-beige3 rounded-full flex-rows gap-4 w-full sm:py-3 px-4'>
                    <FaPlay className='w-3 h-3' /> Watch
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-span-2 md:mt-0 mt-2 flex justify-end'>
              <button className='md:w-1/4 w-full relative flex-colo bg-beige3 hover:bg-transparent border-2 border-beige3 transition-all duration-300 md:h-64 h-24 rounded-2xl font-medium'>
                <div className='flex-rows gap-6 text-md uppercase tracking-widest absolute md:rotate-90 whitespace-nowrap'>
                  Open it on the app
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Sidebar */}
      <ShareSidebar isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
}

export default MovieInfo;
