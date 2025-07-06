import React from 'react'
import { FiUser } from 'react-icons/fi'

function Promos() {
   return (

      <div className='my-20 py-10 md:px-20 px=8 bg-dry rounded-2xl animate-fadeIn'>
         <div className='lg:grid lg:grid-cols-2 lg:gap-10 items-center'>
            <div className='flex lg:gap-10 gap-6 flex-col'>
               <h1 className='xl:text-2xl text-xl capitlize font-sans font-medium leading-relaxed '>
                  Download your Movie trailer watch online <br /> Enjoy on your Mobile
               </h1>
               <p className='text-text text-sm xl:text-base leading-6 xl:leading-8'>
                  Download the Cinemate app, which provides a unique experience without queues or waiting times! Booking seats and snacks has never been easier thanks to its simple and user-friendly interface that offers everything you need with just one tap. Download the app now and enjoy fast, convenient service.
               </p>
               <div className='flex gap-4 md:text-lg text-sm'>
                  <div className='flex-colo bg-black text-beige px-6 py-3 rounded-2xl font-bold'>
                     HD 4K
                  </div>
                  <div className='flex-rows  gap-4 bg-black text-beige px-6 py-3 rounded-2xl font-bold'>
                     <FiUser /> 2K
                  </div>

               </div>
            </div>
            <div>
               <img src='/images/mobile.png' alt='Mobile app' className='w-full object-contain' />
            </div>


         </div>
      </div>
   )
}

export default Promos
