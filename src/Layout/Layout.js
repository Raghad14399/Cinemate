import React from 'react'
import NavBar from './NavBar/NavBar'
import Footer from './Footer/Footer'
import MobileFooter from './Footer/MobileFooter'

function Layout({children}) {
  return (
   <div className="bg-main text-white min-h-screen flex flex-col overflow-x-hidden">
  <NavBar />
  <main className="flex-grow flex flex-col">
    {children}
  </main>
  <Footer />
  {/* Mobile footer */}
  <MobileFooter />
</div>
  )
}

export default Layout
