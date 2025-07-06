import React, { useState } from 'react';
import SideBar from '../SideBar';
import { Varieties } from '../../../Data/MovieData';
import Table4 from '../../../Components/Table4';
import { FaSearch } from 'react-icons/fa';

function Varieties1() {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // في حال البيانات ثابتة، فقط لعرض اللودينغ عند أول تحميل
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);
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
</div>

        {/* Table */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading varieties...</span>
          </div>
        )}
        {!loading && (
          Varieties.length > 0 ? (
            <Table4
              data={Varieties}
              users={false}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchQuery ? "No varieties found matching your search." : "No varieties available."}
              </p>
            </div>
          )
        )}

      </div>
    </SideBar>
  );
}

export default Varieties1
