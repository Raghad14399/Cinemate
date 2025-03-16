import React, { useState } from 'react';
import SideBar from '../SideBar';
import { HiPlusCircle } from 'react-icons/hi';
import Table2 from '../../../Components/Table2';
import { CategoriesData } from '../../../Data/CategoriesData';
import { Movies } from '../../../Data/MovieData';
import CreateSidebar from '../../../Components/Modals/CreateSidebar';
import EditSidebar from '../../../Components/Modals/EditSidebar';
import { FaSearch } from 'react-icons/fa';

function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleEditClick = (categoryName) => {
    console.log('Editing category:', categoryName); 
    setSelectedCategory(categoryName);
    setIsEditSidebarOpen(true);
  };

  const handleCategoryUpdate = (newName) => {
    alert(`Category "${selectedCategory}" updated to "${newName}"`);
    setSelectedCategory('');
    setIsEditSidebarOpen(false);
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateSidebar
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
        categories={Movies}
      />

      {/* Edit Sidebar */}
      <EditSidebar
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        category={selectedCategory}
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
                                      placeholder="Search Categories Name"
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
                                    />
                                  </form>
                                </div>
        {/* Header */}
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Categories</h2>
          <button
            onClick={() => setIsCreateSidebarOpen(true)}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-xl hover:bg-main border border-beige3 transition"
          >
            <HiPlusCircle className="text-lg" /> Create
          </button>
        </div>

        {/* Table */}
        <Table2
          data={CategoriesData}
          users={false}
          onEditClick={handleEditClick} 
        />
      </div>
    </SideBar>
  );
}

export default Categories;
