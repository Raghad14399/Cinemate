import React from 'react';
import Layout from './../Layout/Layout';
import Head from '../Components/Head';

function AboutUs() {
  return (
    <Layout>
      <div className='min-height-screen containermx-auto px-2 my-6 animate-fadeIn' >
        <Head title="About Us" />
        <div className='xl:py-20 py-10 px-4 w-10/12 mx-auto'>
          <div className='grid grid-flow-row xl:grid-cols-2 gap-4 xl:gap-16 items-center'>
            <div>
              <h3 className='text-xl lg:text-3xl mb-4 font-semibold'>
                Welcome to Our Cinemate
              </h3>
              <div className='mt-3 text-sm leading-8 text-text'>
                <p>
                  Cinemate is your all-in-one platform for managing and experiencing the world of cinema. Whether you're a moviegoer, a cinema manager, or part of a film production team, Cinemate offers smart tools to streamline operations and enhance your cinematic journey.


                </p>
                <p>

                  Our system provides seamless movie scheduling, real-time ticket booking, and detailed analytics to optimize every screening. With user-friendly interfaces and powerful features, Cinemate is built to bring efficiency and enjoyment to both cinema staff and visitors.

                  Join us as we transform how cinemas operate and how audiences experience films—intuitively, efficiently, and memorably.
                </p>
              </div>
              <div className='grid md:grid-cols-2 gap-6 mt-8'>
                <div className='p-8 bg-dry rounded-2xl'>
                  <span className='text-3xl block font-extrabold'>
                    10K
                  </span>
                  <h4 className='text-lg font-semibold mb-1'>Listed Movies</h4>
                  <p className='mb-0 text-text leading-7 text-sm'>
                    A growing library of movies scheduled and managed with Cinemate.

                  </p>
                </div>

                <div className='p-8 bg-dry rounded-2xl'>
                  <span className='text-3xl block font-extrabold'>
                    8K
                  </span>
                  <h4 className='text-lg font-semibold mb-1'>Lovely Users</h4>
                  <p className='mb-0 text-text leading-7 text-sm'>
                    Thousands of users enjoy seamless ticket booking and movie discovery every day.

                  </p>
                </div>
              </div>
            </div>
            <div className='mt-10 lg:mt-0'>
              <img
                src="/images/aboutus.jpg"
                alt="aboutus"
                className='w-full h-auto max-h-112 rounded-2xl object-cover' /> {/* زيادة الارتفاع */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutUs;
