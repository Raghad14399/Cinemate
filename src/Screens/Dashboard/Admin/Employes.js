import React, { useState, useEffect } from "react";
import { HiPlusCircle } from "react-icons/hi";
import SideBar from "../SideBar";
import CreateEmloye from "../../../Components/Modals/CreateEmploye";
import EditeEmploye from "../../../Components/Modals/EditeEmploye";
import Table6 from "../../../Components/Table6";
import { authService } from '../../../api/services';
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

function Employes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateEmloyeOpen, setIsCreateEmloyeOpen] = useState(false);
  const [isEditeEmployeOpen, setIsEditeEmployeOpen] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // تحميل الموظفين من الـ API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (query = "") => {
    setLoading(true);
    try {
      const params = { PageIndex: 0, PageSize: 50 };
      if (query) params.SearchQuery = query;
      const res = await authService.getAllEmployees(params);
      setEmployees(res.data || []);
    } catch (err) {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (employeeData) => {
    setSelectedEmploye(employeeData);
    setIsEditeEmployeOpen(true);
  };

  const handleEmployeUpdate = (updatedEmployee) => {
    // تحديث الموظف في القائمة (يفضل إعادة التحميل من السيرفر هنا)
    fetchEmployees();
    toast.success(`Employee "${updatedEmployee.fullName}" updated successfully`);
    setIsEditeEmployeOpen(false);
  };

  // دالة لإضافة موظف جديد
  const handleAddEmployee = (newEmployee) => {
    // بعد إضافة موظف جديد (يفضل إعادة التحميل من السيرفر)
    fetchEmployees();
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateEmloye
        isOpen={isCreateEmloyeOpen}
        onClose={() => setIsCreateEmloyeOpen(false)}
        employes={employees}
        setEmployes={handleAddEmployee}
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
          <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md"
              onSubmit={e => { e.preventDefault(); fetchEmployees(searchQuery); }}>
            <button
              type="submit"
              className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search Employee Name or Email"
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
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading employees...</span>
          </div>
        )}
        {!loading && (
          employees.length > 0 ? (
            <Table6
              data={employees}
              employes={true}
              onEditClick={handleEditClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchQuery ? "No employees found matching your search." : "No employees available."}
              </p>
            </div>
          )
        )}
      </div>
    </SideBar>
  );
}

export default Employes;
