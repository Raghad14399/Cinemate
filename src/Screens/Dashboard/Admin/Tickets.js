import React, { useState } from 'react'
import SideBar from '../SideBar'
import Table5 from '../../../Components/Table5'
import { Ticket } from '../../../Data/HallData'
import { FaSearch } from 'react-icons/fa'

function Tickets() {
    const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SideBar>
      <div className='flex flex-col gap-6'>
               <div className="flex items-center justify-start w-3/4">
                  <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
                    <button
                      type="button"
                      onClick={() => console.log('Search button clicked')}
                      className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
                    >
                      <FaSearch />
                    </button>
                    <input
                      type="text"
                      placeholder="Search phone number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-black focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
                    />
                  </form>
                </div>
          <h2 className='text-xl font-bold'> Tickets </h2>

          <Table5 data={Ticket} tickets={true}/>
      </div>
    </SideBar>
  )
}

export default Tickets
