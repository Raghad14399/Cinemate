import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { CgUser } from 'react-icons/cg';
import { MdConfirmationNumber } from 'react-icons/md'; // استيراد أيقونة التذاكر

function NavBar() {
  const hover = "hover:text-beige3 transition text-white";
  const Hover = ({ isActive }) => (isActive ? 'text-beige' : hover);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      console.log("Search query: ", searchQuery);
    }
  };

  return (
    <>
      <div className='bg-main shadow-md sticky top-0 z-20 rounded-2xl'>
        <div className='container mx-auto py-6 px-2 lg:grid gap-10 grid-cols-7 justify-between items-center'>
          {/* Logo */}
          <div className='col-span-1 lg:block hidden'>
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="logo"
                className='top-0 bottom-0 right-0 left-0 h-20 object-contain'
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className='col-span-3 flex items-center justify-start'>
            <form onSubmit={handleSearch} className='text-sm bg-beige border border-beige3 rounded-xl flex items-center gap-4'>
              <button
                type="submit"
                className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search Movie Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-beige font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-black focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
              />
            </form>
          </div>

          {/* Menus */}
          <div className='col-span-3 font-medium text-sm hidden xl:gap-16 justify-between lg:flex xl:justify-end items-center'>
            <NavLink to="/Snacks" className={Hover}>
              Snacks
            </NavLink>
            <NavLink to="/about-us" className={Hover}>
              AboutUs
            </NavLink>
            <NavLink to="/contact-us" className={Hover}>
              ContactUs
            </NavLink>
            <NavLink to="/login" className={Hover}>
              <CgUser className='w-8 h-8' />
            </NavLink>
            {/* أيقونة التذاكر */}
            <NavLink to="/tickets" className={`${Hover} relative`}>
              <MdConfirmationNumber className="w-6 h-6" />
              <div
                className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs bg-beige3 text-white transform translate-x-1/2 -translate-y-1/2"
              >
                3 
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;