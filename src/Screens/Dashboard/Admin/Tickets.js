import React, { useState, useEffect } from 'react'
import SideBar from '../SideBar'
import Table5 from '../../../Components/Table5'
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { paymentService } from '../../../api/services'

function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const paymentsPerPage = 10; // عدد الدفعات في كل صفحة

  // تجهيز بيانات الدفعات للجدول: استخراج الحقول من المسارات الصحيحة
  const preparedPayments = (Array.isArray(payments) ? payments : []).map((p) => {
    const booking = p.booking || {};
    const movieTime = booking.movieTime || {};
    const hall = movieTime.hall || {};
    const user = booking.user || {};
    const chairs = booking.hallChairs || [];
    return {
      ...p,
      name: user.fullName || user.email || "-",
      email: user.email || "-",
      hallNumber: hall.name || "-",
      seat: chairs.map(c => c.code).join(", ") || "-",
      createAt: booking.bookingDate || "-",
      time: movieTime.time || "-",
    };
  });

  // فلترة بحث بالإيميل
  const filteredPayments = preparedPayments.filter(p =>
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // حساب عدد الصفحات
  useEffect(() => {
    if (filteredPayments.length > 0) {
      setTotalPages(Math.ceil(filteredPayments.length / paymentsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [filteredPayments]);

  // حساب الدفعات في الصفحة الحالية
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPayments();
      setPayments(res.data || res);
    } catch (err) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-start w-3/4 gap-4">
          <form className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 flex-1 shadow-md">
            <button
              type="button"
              onClick={fetchPayments}
              className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search Email Address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
            />
          </form>
        </div>
        <h2 className="text-xl font-bold">Payment Verification</h2>
        {loading ? (
          <div className="text-center py-8 text-white">Loading payments...</div>
        ) : (
          <>
            <Table5 data={currentPayments} tickets={true} />
            {/* Pagination - عرض شريط التنقل بين الصفحات فقط إذا كان هناك أكثر من صفحة واحدة وليس هناك بحث نشط */}
            {!searchQuery && totalPages > 1 && filteredPayments.length > paymentsPerPage && (
              <div className="flex justify-center items-center mt-8">
                <div className="flex items-center space-x-2">
                  {/* زر الصفحة السابقة */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                        onClick={() => setCurrentPage(index + 1)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          currentPage === index + 1
                            ? "bg-beige3 text-white"
                            : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                        } transition duration-300`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* زر الصفحة التالية */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
      </div>
    </SideBar>
  );
}

export default Tickets
