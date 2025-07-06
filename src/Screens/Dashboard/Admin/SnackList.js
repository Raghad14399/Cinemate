import React, { useState, useEffect } from 'react';
import Table3 from '../../../Components/Table3';
import SideBar from '../SideBar';
import { snackService } from '../../../api/services';
import { FaSearch } from 'react-icons/fa';
import EditSnackModal from '../../../Components/Modals/EditSnackModal';

function SnackList() {
  // الحالة للبيانات الحقيقية
  const [snacks, setSnacks] = useState([]);
  const [filteredSnacks, setFilteredSnacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // حالة النافذة المنبثقة
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const pageSize = 10;

  // جلب جميع السناكات دفعة واحدة
  const fetchSnacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await snackService.getSnacks({ PageIndex: 0, PageSize: 1000 });
      const items = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setSnacks(items);
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  // Refresh callback to pass to modal
  const refreshSnacks = () => {
    fetchSnacks();
  };


  // فلترة محلية للبحث
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSnacks(snacks);
    } else {
      const filtered = snacks.filter((snack) =>
        (snack.englishName || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSnacks(filtered);
    }
  }, [searchQuery, snacks]);

  // حساب عدد الصفحات
  useEffect(() => {
    if (searchQuery) {
      setTotalPages(1);
      setPage(1);
      return;
    }
    const calculatedPages = Math.max(1, Math.ceil(snacks.length / pageSize));
    setTotalPages(calculatedPages);
    setPage(1);
  }, [filteredSnacks.length, snacks.length, pageSize, searchQuery]);

  // الحصول على السناكات للصفحة الحالية فقط
  const snacksToDisplay = searchQuery
    ? filteredSnacks
    : filteredSnacks.slice((page - 1) * pageSize, page * pageSize);

  // دالة لفتح النافذة المنبثقة
  const openAlert = () => {
    setIsAlertOpen(true);
  };

  // دالة لإغلاق النافذة المنبثقة
  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  // دالة لتنفيذ الإجراء عند التأكيد
  const handleConfirm = () => {
    console.log('All snacks deleted!');
    closeAlert(); // إغلاق النافذة بعد التأكيد
  };

  const handleDeleteSnack = async (id) => {
    try {
      await snackService.deleteSnack(id);
      fetchSnacks(); // أو refreshSnacks إذا كانت معرفة
    } catch (err) {
      // Optionally show error toast
      console.error("Delete Snack Error:", err);
    }
  };

  const handleEditSnack = (snack) => {
    setSelectedSnack(snack);
    setIsEditModalOpen(true);
  };


  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
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
              placeholder="Search snack name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
            />
          </form>
        </div>

        {/* Header */}
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold">Snack List</h2>
        </div>

        {/* Table */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading snacks...</span>
          </div>
        )}
        {!loading && error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : !loading && snacksToDisplay.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchQuery ? "No matching results found." : "No snacks available."}
            </p>
          </div>
        ) : !loading && (
          <Table3
            data={snacksToDisplay}
            admin={true}
            refreshSnacks={refreshSnacks} // Pass the refresh function
            onDelete={handleDeleteSnack} // Pass the delete function
            onEdit={handleEditSnack} // Pass the edit function
          />
        )}

        {/* Pagination - عرض شريط التنقل بين الصفحات فقط إذا كان هناك أكثر من صفحة واحدة وليس هناك بحث نشط */}
        {!searchQuery && totalPages > 1 && filteredSnacks.length > pageSize && (
          <div className="flex justify-center items-center mt-8">
            <div className="flex items-center space-x-2">
              {/* زر الصفحة السابقة */}
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-beige3 text-white hover:bg-dry"
                } transition duration-300`}
              >
                <span>&lt;</span>
              </button>

              {/* أرقام الصفحات */}
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setPage(index + 1)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      page === index + 1
                        ? "bg-beige3 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition duration-300`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* زر الصفحة التالية */}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-beige3 text-white hover:bg-dry"
                } transition duration-300`}
              >
                <span>&gt;</span>
              </button>
            </div>
          </div>
        )}

        {/* Edit Snack Modal */}
        <EditSnackModal 
          modalOpen={isEditModalOpen} 
          setModalOpen={setIsEditModalOpen} 
          snack={selectedSnack} 
          refreshSnacks={refreshSnacks} 
        />

        {/* Pop-up Alert */}
        {isAlertOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={closeAlert} // إغلاق النافذة عند النقر خارجها
          >
            <div
              className="bg-dry p-8 rounded-2xl shadow-lg text-center w-[90%] md:w-[400px]"
              onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخلها
            >
              <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
              <p className="text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition duration-300"
                  onClick={handleConfirm} // تنفيذ الإجراء عند التأكيد
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-700 transition duration-300"
                  onClick={closeAlert} // إغلاق النافذة عند الإلغاء
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SideBar>
  );
}

export default SnackList;