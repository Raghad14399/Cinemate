import React from 'react'
import { BsCollectionFill } from 'react-icons/bs'
import Titles from '../Titles'
import Movie from '../Movie'
import { Movies } from '../../Data/MovieData'

function PopularMovie() {
  return (
    <div className='my-16'>
      <Titles title='Popular Movies' Icon={BsCollectionFill}/>
    <div className='grid sm:mt-12 mt-6 xl:grid-cols-4 sm:grid-cols-2 grid-gols-1 gap-10 animate-fadeIn'>
      {Movies.slice(0, 8).map((movie, index) => (
            <Movie key={index} movie={movie}/>
          ))}
    </div>
    </div>
  )
}

export default PopularMovie
