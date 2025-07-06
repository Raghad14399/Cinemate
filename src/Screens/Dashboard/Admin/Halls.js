import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import { HiPlusCircle } from "react-icons/hi";
import {
  FaSearch,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { hallService } from "../../../api/services";
import { toast } from "react-toastify";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";
import { debounce } from "lodash";
import HallImageWithLoader from "../../../Components/HallImageWithLoader";

function CinemaHalls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [halls, setHalls] = useState([]);
  const [hallToDelete, setHallToDelete] = useState(null);
  // متغيرات التصفح (pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hallsPerPage = 9; // عدد القاعات في كل صفحة
  const navigate = useNavigate();

  // استخدام هوك معالجة أخطاء المصادقة
  const { loading, error, executeApiCall } = useAuthErrorHandler(
    "Failed to load halls. Please try again."
  );

  // إنشاء دالة البحث المؤجلة بدون مؤشر تحميل
  const debouncedFetchHalls = debounce((searchTerm) => {
    // تنفيذ البحث بدون إظهار مؤشر التحميل
    fetchHalls(searchTerm);
  }, 300);

  // استدعاء API للحصول على قائمة القاعات عند تحميل الصفحة
  useEffect(() => {
    fetchHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تنفيذ البحث عند تغيير قيمة البحث
  useEffect(() => {
    if (searchQuery) {
      debouncedFetchHalls(searchQuery);
    } else {
      fetchHalls("");
    }

    return () => {
      debouncedFetchHalls.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchHalls = async (searchTerm = "") => {
    // تحديد ما إذا كان هذا بحثًا أم تحميلًا أوليًا
    const isSearchOperation = !!searchTerm;

    // لا نقوم بإعادة تعيين القاعات عند البحث لتجنب وميض الواجهة
    if (!isSearchOperation) {
      setHalls([]); // إعادة تعيين القاعات فقط عند التحميل الأولي
    }

    // إعداد معلمات البحث للإرسال إلى API
    const params = {};
    if (searchTerm) {
      params.name = searchTerm; // البحث حسب اسم القاعة
      // ملاحظة: API قد لا يدعم البحث الجزئي بشكل صحيح
      // لذلك نقوم بتصفية النتائج محليًا بعد استلامها من API
      // انظر متغير filteredHalls أدناه
    }

    console.log("Searching halls with params:", params);

    const response = await executeApiCall(
      async () => await hallService.getAllHalls(params),
      (response) => {
        // معالجة البيانات بعد نجاح الطلب
        console.log("Full API response:", response);

        // التحقق من تنسيق البيانات (قد تكون البيانات في response.data.data)
        let hallsData = [];
        if (response.data.success && Array.isArray(response.data.data)) {
          // تنسيق API الجديد: { success: true, message: null, data: [...] }
          hallsData = response.data.data;
          console.log(
            "Using new API format with data inside response.data.data"
          );
        } else if (Array.isArray(response.data)) {
          // تنسيق API القديم: [...]
          hallsData = response.data;
          console.log(
            "Using old API format with data directly in response.data"
          );
        } else {
          console.warn("Unexpected API response format:", response.data);
          // محاولة استخراج البيانات من أي مكان محتمل
          if (response.data && typeof response.data === "object") {
            const possibleDataFields = Object.keys(response.data).filter(
              (key) => Array.isArray(response.data[key])
            );

            if (possibleDataFields.length > 0) {
              hallsData = response.data[possibleDataFields[0]];
              console.log(`Found data in field: ${possibleDataFields[0]}`);
            }
          }
        }

        console.log("Extracted halls data:", hallsData);

        // تحويل بيانات API إلى الصيغة المطلوبة للواجهة
        const transformedHalls = hallsData
          .filter((hall) => hall !== null) // تجاهل القيم الفارغة
          .map((hall) => {
            const transformed = hallService.transformHallDataFromAPI(hall);
            return transformed;
          })
          .filter((hall) => hall !== null); // تجاهل أي قاعات لم يتم تحويلها بنجاح

        console.log("Final transformed halls:", transformedHalls);

        if (transformedHalls.length === 0 && hallsData.length > 0) {
          console.warn(
            "No halls were successfully transformed despite having data"
          );
        }

        setHalls(transformedHalls);
      }
    );

    // إذا كانت الاستجابة null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
    if (!response) {
      console.log("Error was handled by the auth error handler");
    }
  };

  const handleAddHall = () => {
    navigate("/create-hall");
  };

  const handleHallClick = (hall) => {
    navigate("/edite-hall", {
      state: {
        hallId: hall.id,
        hallNumber: hall.hallNumber,
        hallType: hall.hallType,
        totalSeats: hall.totalseats,
        rows: hall.rows,
        columns: hall.columns,
        aisles: hall.aisles,
      },
    });
  };

  const handleDeleteHall = (hall, event) => {
    // منع انتشار الحدث لتجنب تشغيل handleHallClick
    event.stopPropagation();
    // تعيين القاعة المراد حذفها لعرض نافذة التأكيد
    setHallToDelete(hall);
  };

  const confirmDelete = async () => {
    if (!hallToDelete) return;

    // استخدام دالة executeApiCall من هوك معالجة أخطاء المصادقة
    await executeApiCall(
      async () => await hallService.deleteHall(hallToDelete.id),
      () => {
        toast.success("Hall deleted successfully");
        // تحديث قائمة القاعات
        fetchHalls();
      }
    );

    // إغلاق نافذة التأكيد بغض النظر عن النتيجة
    setHallToDelete(null);
  };

  const cancelDelete = () => {
    setHallToDelete(null);
  };

  // تصفية القاعات محليًا إذا كان البحث لا يعمل بشكل صحيح من خلال API
  // هذا يضمن أن البحث يعمل حتى إذا كان API لا يدعم البحث الجزئي
  // يتم البحث في كل من hallNumber و name للعثور على تطابقات جزئية
  const allFilteredHalls = searchQuery
    ? halls.filter(
        (hall) =>
          (hall.hallNumber &&
            hall.hallNumber
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (hall.name &&
            hall.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : halls;

  // حساب إجمالي عدد الصفحات
  useEffect(() => {
    // عند البحث، لا نحتاج لحساب عدد الصفحات لأننا نعرض جميع النتائج
    if (searchQuery) {
      console.log(
        `Search mode: not calculating pages, showing all ${allFilteredHalls.length} results`
      );
      setTotalPages(1); // تعيين صفحة واحدة فقط عند البحث
      setCurrentPage(1);
      return;
    }

    // عند عدم البحث، نحسب عدد الصفحات بناءً على إجمالي عدد القاعات
    const calculatedPages = Math.max(1, Math.ceil(halls.length / hallsPerPage));
    console.log(
      `Normal mode: calculating ${calculatedPages} pages for ${halls.length} items (hallsPerPage=${hallsPerPage})`
    );
    setTotalPages(calculatedPages);
    // إعادة تعيين الصفحة الحالية إلى 1 عند تغيير نتائج البحث
    setCurrentPage(1);
  }, [allFilteredHalls.length, halls.length, hallsPerPage, searchQuery]);

  // الحصول على القاعات للصفحة الحالية فقط
  const filteredHalls = searchQuery
    ? allFilteredHalls // عند البحث، نعرض جميع النتائج بدون تقسيم للصفحات
    : allFilteredHalls.slice(
        (currentPage - 1) * hallsPerPage,
        currentPage * hallsPerPage
      );

  // دوال التنقل بين الصفحات
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center justify-start w-3/4">
            <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md">
              <button
                type="button"
                onClick={() => fetchHalls(searchQuery)}
                className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
              >
                {/* دائمًا إظهار أيقونة البحث بدون مؤشر تحميل */}
                <FaSearch />
              </button>

              <input
                type="text"
                placeholder="Search Hall Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
              />
            </form>
          </div>

          <button
            onClick={handleAddHall}
            className="bg-beige3 flex items-center gap-2 text-white font-medium py-2 px-4 rounded-lg hover:bg-dry border border-beige3 shadow-md transition"
          >
            <HiPlusCircle className="text-lg" /> Add Hall
          </button>
        </div>
        <h2 className="text-xl font-bold"> Halls </h2>

        {/* عرض مؤشر التحميل فقط عند التحميل الأولي وليس عند البحث */}
        {loading && !searchQuery && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-beige3 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
            <button
              onClick={fetchHalls}
              className="ml-2 text-beige3 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredHalls.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {searchQuery ? (
              <>
                No halls found matching "
                <span className="font-bold">{searchQuery}</span>".
                {halls.length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-yellow-500">Note:</span> The search is
                    now performed locally. The API returned {halls.length}{" "}
                    halls, but none match your search term.
                  </div>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    fetchHalls("");
                  }}
                  className="ml-2 text-beige3 hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>No halls found. Click "Add Hall" to create a new hall.</>
            )}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHalls.map((hall) => (
            <div
              key={hall.id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
              onClick={() => handleHallClick(hall)}
            >
              <div className="relative">
                <HallImageWithLoader
                  src={
                    hall.hallType === "VIP"
                      ? "/images/halls/hall2.jpg"
                      : "/images/halls/hall3.jpg"
                  }
                  alt={hall.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute top-0 right-0 bg-beige3 text-white px-2 py-1 text-xs font-bold">
                  {hall.hallType}
                </div>
              </div>
              <div className="p-4 bg-lightGray rounded-b-lg">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {hall.hallNumber || hall.name}
                </h3>
                <p className="text-gray-600">
                  {/* عرض عدد المقاعد الظاهرة فقط (التي لها isValid = true) */}
                  Seats: {hall.totalseats}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="text-gray-500 hover:text-green-500 transition duration-200"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHallClick(hall);
                    }}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 transition duration-200"
                    title="Delete"
                    onClick={(e) => handleDeleteHall(hall, e)}
                  >
                    <FaTrash size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - عرض شريط التنقل بين الصفحات فقط إذا كان هناك أكثر من صفحة واحدة وليس هناك بحث نشط */}
        {!searchQuery && totalPages > 1 && halls.length > hallsPerPage && (
          <div className="flex justify-center items-center mt-8">
            <div className="flex items-center space-x-2">
              {/* زر الصفحة السابقة */}
              <button
                onClick={goToPreviousPage}
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
                    onClick={() => goToPage(index + 1)}
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
                onClick={goToNextPage}
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
      </div>

      {/* Delete Confirmation Modal */}
      {hallToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-main border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6 text-center">
              Are you sure you want to delete hall "
              {hallToDelete.hallNumber || hallToDelete.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 min-w-[100px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 min-w-[100px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SideBar>
  );
}

export default CinemaHalls;
