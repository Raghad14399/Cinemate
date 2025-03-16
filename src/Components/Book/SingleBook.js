import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Input } from '../UsedInputs';

function SingleBook({ movie }) {
  if (!movie) {
    return (
      <div className='w-full xl:h-screen flex justify-center items-center text-white'>
        <AiOutlineLoading3Quarters className='animate-spin text-6xl' />
      </div>
    );
  }

  return (
    <div className=' w-full h-screen  text-white animate-fadeIn rounded-2xl'>
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-50 rounded-2xl z-[0]"
      ></div>

      <img
        src={`/images/Movies/${movie?.image}`}
        alt={movie.name}
        className='w-full h-full absolute top-0 left-0 object-cover  rounded-2xl z-[-0]'
      />

      <div className='relative z-10 xl:bg-main bg-dry flex-colo xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0 rounded-2xl'>
        <div className='container px-3 mx-auto 2xl:px-32 xl:grid grid-cols-3 flex-colo py-5 lg:py-20 gap-8'>
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold transition-transform duration-300 hover:scale-105 hover:text-beige3">
              Enter Your Details
            </h2>
            <div className="w-full grid md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="Raghad Saud" type="text" bg={true} />
              <Input label="Phone Number" placeholder="+966537865768" type="text" bg={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleBook;
