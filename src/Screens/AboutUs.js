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
                    Lorem Ipsum is simply dummy text of the printing and typesetting 
                    industry. Lorem Ipsum has been the industry's standard dummy
                    text ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book. It has 
                    survived not only five centuries, but also the leap into 
                    electronic typesetting, remaining essentially unchanged. It was 
                    popularised in the 1960s with the release of Letraset sheets 
                    containing Lorem Ipsum passages, and more recently with desktop 
                    publishing software like Aldus PageMaker including versions.
                    </p>
                    <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting 
                    industry. Lorem Ipsum has been the industry's standard dummy
                    text ever since the 1500s, when an unknown printer took a galley
                    of type and scrambled it to make a type specimen book. It has 
                    survived not only five centuries, but also the leap into 
                    electronic typesetting, remaining essentially unchanged.
                    </p>
                </div>
                <div className='grid md:grid-cols-2 gap-6 mt-8'>
                  <div className='p-8 bg-dry rounded-2xl'>
                    <span className='text-3xl block font-extrabold'>
                         10K
                    </span>
                    <h4 className='text-lg font-semibold mb-1'>Listed Movies</h4>
                    <p className='mb-0 text-text leading-7 text-sm'>
                      Lorem Ipsum is simply dummy text of the printing and 
                    </p>
                  </div>

                  <div className='p-8 bg-dry rounded-2xl'>
                    <span className='text-3xl block font-extrabold'>
                         8K
                    </span>
                    <h4 className='text-lg font-semibold mb-1'>Lovely Users</h4>
                    <p className='mb-0 text-text leading-7 text-sm'>
                      Completely free, without registration!
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
