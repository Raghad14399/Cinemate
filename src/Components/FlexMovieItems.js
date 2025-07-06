import React from 'react'
import { BiTime } from 'react-icons/bi'
import { FaRegCalendarAlt } from 'react-icons/fa'

function FlexMovieItems({movie}) {
  return (
    <>
        <div className='flex items-center gap-2'>
         <span className='text-sm font-medium'>
            {movie.Category}
         </span>
        </div>
        <div className='flex items-center gap-2'>
         <FaRegCalendarAlt className='text-beige3 w-3 h-3'/>
         <span className='text-sm font-medium'>
            {movie.year}
         </span>
        </div>
        <div className='flex items-center gap-2'>
         <BiTime className='text-beige3 w-3 h-3'/>
         <span className='text-sm font-medium'>
            {movie.time}
         </span>
        </div>
    </>
  )
}

export default FlexMovieItems
