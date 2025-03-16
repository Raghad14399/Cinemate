import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { Link, useParams } from 'react-router-dom';
import { Movies } from '../Data/MovieData';
import { BiArrowBack } from 'react-icons/bi';
import { FaHeart, FaPlay, FaTicketAlt } from 'react-icons/fa';

function WatchPage() {
  let { id } = useParams();
  const movie = Movies.find((movie) => movie.name === id);
  const [play, setPlay] = useState(false);

  return (
    <Layout>
      <div className='container mx-auto bg-dry p-6 mb-12 rounded-2xl animate-fadeIn'>
        <div className='flex-btn flex-wrap mb-6 gap-2 bg-main rounded-2xl border border-gray-800 p-6'>
          <Link
            to={`/movie/${movie?.name}`}
            className='md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray'
          >
            <BiArrowBack /> {movie?.name}
          </Link>
          <div className='flex-btn sm:w-auto w-full gap-5 '>
            <button className='bg-white hover:text-beige3 transitions bg-opacity-30 text-white rounded-2xl px-4 py-3 text-sm'>
              <FaHeart />
            </button>
            <button className='bg-beige3 flex-rows gap-2 hover:text-white transitions text-main rounded-2xl px-8 font-medium py-3 text-sm'>
  <Link to="/booking/:name" className="flex items-center gap-2 text-inherit">
    <FaTicketAlt /> Book
  </Link>
</button>

          </div>
        </div>
      </div>
      {/* watch video */}
      {play ? (
        <div className='container mx-auto mb-12'>
          <div
            className='relative'
            style={{ paddingBottom: '50%', height: 0, marginTop: '20px', marginBottom: '20px' }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/tI1JGPhYBS8"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className='absolute top-0 left-0 w-full h-full rounded-2xl'
            />
          </div>
        </div>
      ) : (
        <div className='container mx-auto mb-12 animate-fadeIn'>
          <div
            className='relative'
            style={{ paddingBottom: '50%', height: 0, marginTop: '20px', marginBottom: '20px' }}
          >
          
            <img
              src={`/images/Movies/${movie?.image}`}
              alt={movie?.name}
              className='absolute top-0 left-0 w-full h-full object-cover rounded-2xl'
            />
          
            <div className='absolute top-0 left-0 bottom-0 right-0 bg-main bg-opacity-30 flex-colo rounded-2xl'>
              <button
                onClick={() => setPlay(true)}
                className='bg-main text-beige flex-colo border border-beige3 rounded-full w-20 h-20 font-medium text-xl'
              >
                <FaPlay />
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default WatchPage;
