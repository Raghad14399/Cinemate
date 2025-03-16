import React from 'react';
import { Link } from 'react-router-dom';
import { BiHomeAlt } from 'react-icons/bi';

function NotFound() {
  return (
    <div className="flex-colo gap-8 w-full min-h-screen text-white bg-main lg:py-20 py-10 px-6 ">
      <img
        className="w-full h-96 object-contain animate-pulse "
        src="/images/404.svg"
        alt="NotFound"
      />
      <h1 className="lg:text-5xl text-3xl font-extrabold tracking-wide text-center animate-pulse">
        Page Not Found!
      </h1>
      <p className="font-medium text-border italic leading-6 text-center animate-pulse">
        The page you are looking for does not exist. You may have mistyped the URL.
      </p>
      <Link
        to="/"
        className="bg-beige3 transition-all duration-300 text-white flex-rows gap-4 font-medium py-3 px-6 rounded-2xl border border-beige3 hover:bg-main hover:text-white hover:scale-105 shadow-lg animate-pulse"
      >
        <BiHomeAlt className="text-2xl" /> Home
      </Link>
    </div>
  );
}

export default NotFound;
