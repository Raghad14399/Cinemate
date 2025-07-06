import React, { useState, useEffect, useMemo } from "react";
import SideBar from "../SideBar";
import { HiPlusCircle } from "react-icons/hi";
import Table2 from "../../../Components/Table2";
import CreateSidebar from "../../../Components/Modals/CreateSidebar";
import EditSidebar from "../../../Components/Modals/EditSidebar";
import DeleteConfirmModal from "../../../Components/Modals/DeleteConfirmModal";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { movieTypeService } from "../../../api/services";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";
import TemporaryModal from "../../../Components/TemporaryModal";

function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]); // تخزين جميع الفئات من API
  const [categories, setCategories] = useState([]); // الفئات المعروضة بعد التصفية المحلية
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // تعديل حجم الصفحة ليكون 9 عناصر في كل صفحة
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // استخدام هوك معالجة أخطاء المصادقة
  const { error, setError, executeApiCall } = useAuthErrorHandler(
    "Failed to load Movie Types"
  );

  // حالة الشاشة المنبثقة المؤقتة
  const [tempModal, setTempModal] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // دالة لعرض رسالة مؤقتة
  const showTempModal = (message, type = "success") => {
    setTempModal({
      show: true,
      message,
      type,
    });

    // إخفاء الرسالة بعد ثانيتين
    setTimeout(() => {
      setTempModal((prev) => ({ ...prev, show: false }));
    }, 2000);
  };

  // جلب الفئات من API
  const fetchCategories = async () => {
    // تحديد ما إذا كان هذا بحثًا أم تحميلًا أوليًا
    const isSearchOperation = !!searchQuery;

    // إظهار مؤشر التحميل فقط إذا لم يكن بحثًا
    if (!isSearchOperation) {
      setIsLoading(true);
    }
    // لم نعد بحاجة لإظهار مؤشر التحميل عند البحث

    try {
      // استخدام معلمات البحث للAPI
      const apiParams = {
        // نطلب دائمًا جميع العناصر لمعرفة العدد الإجمالي
        PageIndex: 0,
        PageSize: 100, // طلب عدد كبير من العناصر للتأكد من الحصول على جميع العناصر
      };

      // إضافة معلمة البحث فقط إذا كانت غير فارغة
      // ملاحظة: API قد لا يدعم البحث الجزئي بشكل صحيح
      if (searchQuery) {
        apiParams.SearchQuery = searchQuery;
        // سنقوم بتصفية النتائج محليًا أيضًا للتأكد من دقة البحث
      }

      console.log("Fetching categories with params:", apiParams);

      const response = await executeApiCall(() =>
        movieTypeService.getAllMovieTypes(apiParams)
      );

      console.log("Full API response structure:", response);
      if (response && response.data) {
        console.log("API response data structure:", Object.keys(response.data));
        console.log("API response data:", response.data);

        // التحقق من وجود totalCount في استجابة API
        if (response.data.totalCount !== undefined) {
          console.log(`API returned totalCount: ${response.data.totalCount}`);
        } else {
          console.log("API did not return totalCount");
        }
        // تحويل البيانات إلى التنسيق المطلوب
        const formattedCategories = response.data.data.map((category) => ({
          id: category.id,
          title: category.englishName,
          arabicName: category.arabicName,
        }));

        // تخزين جميع الفئات من API
        setAllCategories(formattedCategories);

        // تصفية الفئات محليًا إذا كان هناك بحث
        if (searchQuery) {
          const filteredResults = formattedCategories.filter((category) =>
            category.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setCategories(filteredResults);
          console.log(
            `Local filtering: Found ${filteredResults.length} categories matching "${searchQuery}" out of ${formattedCategories.length} total`
          );
        } else {
          setCategories(formattedCategories);
        }

        // حساب إجمالي الصفحات
        if (response.data.totalCount) {
          const calculatedTotalPages = Math.ceil(
            response.data.totalCount / pageSize
          );
          console.log(
            `API totalCount: ${response.data.totalCount}, pageSize: ${pageSize}, calculatedTotalPages: ${calculatedTotalPages}`
          );
          setTotalPages(calculatedTotalPages);
        } else {
          // إذا لم يكن هناك totalCount، نحسب بناءً على عدد الفئات المستلمة
          const calculatedTotalPages = Math.ceil(
            formattedCategories.length / pageSize
          );
          console.log(
            `No totalCount from API, using formattedCategories.length: ${formattedCategories.length}, calculatedTotalPages: ${calculatedTotalPages}`
          );
          setTotalPages(calculatedTotalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load Movie Types");
    } finally {
      // إعادة تعيين حالة التحميل
      setIsLoading(false);
    }
  };

  // استدعاء دالة جلب الفئات عند تحميل الصفحة أو تغيير معايير البحث
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchQuery]);

  // دالة للبحث
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // العودة إلى الصفحة الأولى عند البحث

    // تنفيذ البحث بدون إظهار مؤشر التحميل
    if (searchQuery) {
      // البحث يتم تلقائيًا من خلال useMemo
      // لا نحتاج لأي إجراء إضافي هنا
    } else {
      // إذا كان البحث فارغًا، استعادة جميع الفئات
      fetchCategories();
    }
  };

  // إضافة useMemo لتصفية الفئات محليًا
  const allFilteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter((category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // حساب إجمالي عدد الصفحات بناءً على نتائج البحث
  useEffect(() => {
    // عند البحث، لا نحتاج لحساب عدد الصفحات لأننا نعرض جميع النتائج
    if (searchQuery) {
      console.log(
        `Search mode: not calculating pages, showing all ${allFilteredCategories.length} results`
      );
      setTotalPages(1); // تعيين صفحة واحدة فقط عند البحث
      return;
    }

    // عند عدم البحث، نحسب عدد الصفحات بناءً على إجمالي عدد الفئات
    const calculatedPages = Math.max(
      1,
      Math.ceil(categories.length / pageSize)
    );

    console.log(
      `Normal mode: calculating ${calculatedPages} pages for ${categories.length} items (pageSize=${pageSize})`
    );

    setTotalPages(calculatedPages);

    // إذا كان currentPage أكبر من totalPages، نعيد تعيينه إلى 1
    if (currentPage > calculatedPages) {
      console.log(
        `Resetting currentPage from ${currentPage} to 1 because totalPages=${calculatedPages}`
      );
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilteredCategories, categories, currentPage, pageSize, searchQuery]);

  // الحصول على الفئات للصفحة الحالية فقط
  const filteredCategories = useMemo(() => {
    // عند البحث، نعرض جميع النتائج بدون تقسيم للصفحات
    if (searchQuery) {
      console.log(
        `Search mode: showing all ${allFilteredCategories.length} filtered results`
      );
      return allFilteredCategories;
    }

    // عند عدم البحث، نقوم بتقسيم النتائج للصفحة الحالية
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const result = categories.slice(startIndex, endIndex);

    console.log(
      `Normal mode: showing page ${currentPage}/${totalPages}. startIndex=${startIndex}, endIndex=${endIndex}, showing ${result.length} items out of ${categories.length} total items`
    );

    // إضافة تعليمات برمجية للتصحيح لمعرفة ما إذا كان هناك المزيد من الصفحات
    if (categories.length > pageSize) {
      console.log(
        `SHOULD SHOW PAGINATION: ${Math.ceil(
          categories.length / pageSize
        )} pages for ${categories.length} items`
      );
    } else {
      console.log(
        `NOT ENOUGH ITEMS FOR PAGINATION: only ${categories.length} items, need more than ${pageSize}`
      );
    }

    return result;
  }, [
    allFilteredCategories,
    categories,
    currentPage,
    pageSize,
    searchQuery,
    totalPages,
  ]);

  // دالة لتغيير الصفحة
  const handlePageChange = (newPage) => {
    console.log(
      `handlePageChange called with newPage=${newPage}, currentPage=${currentPage}, totalPages=${totalPages}`
    );

    if (newPage >= 1 && newPage <= totalPages) {
      console.log(`Changing page from ${currentPage} to ${newPage}`);
      setCurrentPage(newPage);
    } else {
      console.log(
        `Invalid page number: ${newPage} (must be between 1 and ${totalPages})`
      );
    }
  };

  // ملاحظة: تم إزالة دالة addDummyCategory وزر "Add Dummy" بناءً على طلب المستخدم
  // إذا ظهر خطأ "addDummyCategory is not defined"، يرجى إعادة تشغيل الخادم المحلي

  // دالة لإضافة فئة جديدة
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await executeApiCall(() =>
        movieTypeService.createMovieType({
          englishName: categoryData.englishName,
          arabicName: categoryData.englishName, // استخدام نفس الاسم الإنجليزي للاسم العربي
        })
      );

      if (response) {
        showTempModal("Category added successfully", "success");
        fetchCategories(); // إعادة تحميل الفئات
        setIsCreateSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      showTempModal("Failed to add category", "error");
    }
  };

  // دالة لتعديل فئة
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditSidebarOpen(true);
  };

  const handleCategoryUpdate = async (categoryData) => {
    if (!selectedCategory) return;

    try {
      const response = await executeApiCall(() =>
        movieTypeService.updateMovieType(selectedCategory.id, {
          englishName: categoryData.englishName,
          arabicName: categoryData.englishName, // استخدام نفس الاسم الإنجليزي للاسم العربي
        })
      );

      if (response) {
        showTempModal("Category updated successfully", "success");
        fetchCategories(); // إعادة تحميل الفئات
        setIsEditSidebarOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      showTempModal("Failed to update category", "error");
    }
  };

  // دالة لحذف فئة
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await executeApiCall(() =>
        movieTypeService.deleteMovieType(categoryToDelete.id)
      );

      if (response) {
        showTempModal("Category deleted successfully", "success");
        fetchCategories(); // إعادة تحميل الفئات
      }
    } catch (error) {
      console.error("Error deleting Movie Types:", error);
      showTempModal("Failed to delete Delete Movie Type", "error");
    } finally {
      setCategoryToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <SideBar>
      {/* Create Sidebar */}
      <CreateSidebar
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Sidebar */}
      <EditSidebar
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        category={selectedCategory}
        onEdit={handleCategoryUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie Type"
        message={`Are you sure you want to delete "${categoryToDelete?.title}"?`}
      />

      {/* Temporary Modal */}
      <TemporaryModal
        isVisible={tempModal.show}
        message={tempModal.message}
        type={tempModal.type}
        onClose={() => setTempModal((prev) => ({ ...prev, show: false }))}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-start w-3/4">
          <form
            onSubmit={handleSearch}
            className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md"
          >
            <button
              type="submit"
              className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            >
              {/* دائمًا إظهار أيقونة البحث بدون مؤشر تحميل */}
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search Movie Type Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
            />
          </form>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-xl font-bold">Movie Types</h2>
          <button
            onClick={() => setIsCreateSidebarOpen(true)}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-xl hover:bg-main border border-beige3 transition"
          >
            <HiPlusCircle className="text-lg" /> Create
          </button>
        </div>

        {/* Loading State - عرض مؤشر التحميل فقط عند التحميل الأولي وليس عند البحث */}
        {isLoading && !searchQuery ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-beige3 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <>
            {allFilteredCategories.length === 0 && searchQuery ? (
              <div className="text-center py-10 text-gray-500">
                No Movie Types found matching "
                <span className="font-bold">{searchQuery}</span>".
                {categories.length > 0 && <div className="mt-2 text-sm"></div>}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchCategories();
                  }}
                  className="ml-2 text-beige3 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                {/* Table */}
                <Table2
                  data={filteredCategories}
                  users={false}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />

                {/* Pagination - عرض شريط التنقل بين الصفحات فقط إذا كان هناك أكثر من صفحة واحدة وليس هناك بحث نشط */}
                {console.log(
                  `Rendering pagination: totalPages=${totalPages}, currentPage=${currentPage}, categories.length=${categories.length}, allFilteredCategories.length=${allFilteredCategories.length}, searchQuery="${searchQuery}"`
                )}
                {/* نعرض شريط التصفح فقط عند عدم وجود بحث نشط وإذا كان هناك أكثر من صفحة واحدة */}
                {!searchQuery &&
                  totalPages > 1 &&
                  categories.length > pageSize && (
                    <div className="flex justify-center items-center mt-8">
                      <div className="flex items-center space-x-2">
                        {/* زر الصفحة السابقة */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentPage === 1
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-beige3 text-white hover:bg-dry"
                          } transition duration-300`}
                        >
                          <FaChevronLeft size={14} />
                        </button>

                        {/* أرقام الصفحات */}
                        <div className="flex space-x-2">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => handlePageChange(index + 1)}
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                currentPage === index + 1
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
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentPage === totalPages
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-beige3 text-white hover:bg-dry"
                          } transition duration-300`}
                        >
                          <FaChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
              </>
            )}
          </>
        )}
      </div>
    </SideBar>
  );
}

export default Categories;
