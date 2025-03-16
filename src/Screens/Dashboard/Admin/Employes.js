import React, { useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';
import SideBar from '../SideBar';
import CreateEmloye from '../../../Components/Modals/CreateEmploye';
import EditeEmploye from '../../../Components/Modals/EditeEmploye';
import Table6 from '../../../Components/Table6';
import { Employe } from '../../../Data/HallData';
import { FaSearch } from 'react-icons/fa';

function Employes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateEmloyeOpen, setIsCreateEmloyeOpen] = useState(false);
  const [isEditeEmployeOpen, setIsEditeEmployeOpen] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState('');

  const handleEditClick = (employeeData) => {
    setSelectedEmploye(employeeData);
    setIsEditeEmployeOpen(true);
  };

  const handleEmployeUpdate = (updatedEmployee) => {
    alert(`Employe "${updatedEmployee.name}" updated successfully`);
    setIsEditeEmployeOpen(false);
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateEmloye
        isOpen={isCreateEmloyeOpen}
        onClose={() => setIsCreateEmloyeOpen(false)}
        categories={Employe}
      />

      {/* Edit Sidebar */}
      <EditeEmploye
  isOpen={isEditeEmployeOpen}
  onClose={() => setIsEditeEmployeOpen(false)}
  employe={selectedEmploye} 
  onEdit={handleEmployeUpdate}
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
                                                  placeholder="Search Employe ID"
                                                  value={searchQuery}
                                                  onChange={(e) => setSearchQuery(e.target.value)}
                                                  className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
                                                />
                                              </form>
                                            </div>
        {/* Header */}
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Employes</h2>
          <button
            onClick={() => setIsCreateEmloyeOpen(true)}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-xl hover:bg-main border border-beige3 transition"
          >
            <HiPlusCircle className="text-lg" /> Create
          </button>
        </div>

        {/* Table */}
        <Table6
          data={Employe}
          employes={true}
          onEditClick={handleEditClick} 
        />
      </div>
    </SideBar>
  );
}

export default Employes;
