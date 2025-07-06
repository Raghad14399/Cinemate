import React from "react";
import { Link } from "react-router-dom";

function Movie({ movie }) {
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

  return (
    <div className="border border-border p-1 hover:scale-95 transition relative rounded-2xl overflow-hidden">
      <Link to={`/movie/${movie?.id || movie?.name}`} className="w-full">
        <img
          src={getImageSrc(movie?.image)}
          alt={movie?.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/movies/default-movie.jpg";
          }}
        />
      </Link>
      <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <h3 className="font-semibold truncate"> {movie?.name} </h3>
      </div>
    </div>
  );
}

export default Movie;
