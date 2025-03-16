import React, { useState } from 'react';
import SideBar from '../SideBar';
import { HiPlusCircle } from 'react-icons/hi';
import { Varieties } from '../../../Data/MovieData';
import CreateVarieties from '../../../Components/Modals/CreateVarieties';
import EditVarieties from '../../../Components/Modals/EditVarieties';
import Table4 from '../../../Components/Table4';
import { FaSearch } from 'react-icons/fa';

function Varieties1() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState('');

  const handleEditClick = (categoryName) => {
    console.log('Editing category:', categoryName); 
    setSelectedVariety(categoryName);
    setIsEditSidebarOpen(true);
  };

  const handleCategoryUpdate = (newName) => {
    alert(`Category "${selectedVariety}" updated to "${newName}"`);
    setSelectedVariety('');
    setIsEditSidebarOpen(false);
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateVarieties
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
        name={Varieties}
      />

      {/* Edit Sidebar */}
      <EditVarieties
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        varieties={selectedVariety}
        onEdit={handleCategoryUpdate}
      />

      <div className="flex flex-col gap-6">
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
                                      placeholder="Search Varities Name"
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
                                    />
                                  </form>
                                </div>
        {/* Header */}
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Varieties</h2>
          <button
            onClick={() => setIsCreateSidebarOpen(true)}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-xl hover:bg-main border border-beige3 transition"
          >
            <HiPlusCircle className="text-lg" /> Create
          </button>
        </div>

        {/* Table */}
        <Table4
          data={Varieties}
          users={false}
          onEditClick={handleEditClick}
          />

      </div>
    </SideBar>
  );
}

export default Varieties1
