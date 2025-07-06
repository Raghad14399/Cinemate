import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { useParams } from 'react-router-dom';
import { movieService } from '../api/services';
import { FaPlay } from 'react-icons/fa';

function WatchPage() {
  let { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await movieService.getMovieById(id);
        if (response?.data?.success && response.data.data) {
          setMovie(response.data.data);
          console.log('movie data:', response.data.data);
        } else if (response?.data) {
          setMovie(response.data);
          console.log('movie data:', response.data);
        }
      } catch (error) {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="text-white">Loading...</span>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="text-red-500">Movie not found</span>
        </div>
      </Layout>
    );
  }

  // تحديد مصدر صورة الغلاف
  const getImageSrc = (imageUrl) => {
    if (!imageUrl) {
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

  // دالة لتحويل رابط يوتيوب إلى صيغة embed
  function getEmbedUrl(url) {
    if (!url) return null;
    if (url.includes("/embed/")) return url;
    // التقاط ID الفيديو من صيغ مختلفة
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }

  return (
    <Layout>
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
              src={movie.trailerUrl && movie.trailerUrl !== 'string' ? getEmbedUrl(movie.trailerUrl) : "https://www.youtube.com/embed/tI1JGPhYBS8"}
              title="Movie Trailer"
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
              src={movie.image?.url ? getImageSrc(movie.image.url) : `/api/Images/${movie.imageID}`}
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
