import React from 'react'
import NavBar from './NavBar/NavBar'
import Footer from './Footer/Footer'
import MobileFooter from './Footer/MobileFooter'

function Layout({children}) {
  return (
   <>
    <div className='bg-main text-white'>
      <NavBar/>  
      {children}
      <Footer/>
      {/* Mobile footer */}
      <MobileFooter/>
    </div>
   </>
  )
}

export default Layout
