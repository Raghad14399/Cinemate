import React, { useState, useEffect } from "react";
import { IoInformationCircle, IoClose } from "react-icons/io5";

function SessionExpiryModal({
  isVisible,
  onClose,
  onTimeout,
  initialSeconds = 5,
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (isVisible) {
      // إعادة تعيين العداد عند فتح النافذة
      setSeconds(initialSeconds);

      // بدء العد التنازلي
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval);
            // استدعاء دالة انتهاء المهلة عند وصول العداد إلى صفر
            onTimeout();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      // تنظيف الفاصل الزمني عند إغلاق المكون
      return () => clearInterval(interval);
    }
  }, [isVisible, initialSeconds, onTimeout]);

  if (!isVisible) return null;

  // دالة لإلغاء العد التنازلي وتسجيل الخروج فورًا
  const handleLogoutNow = () => {
    onTimeout();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="mt-4 p-4 rounded-lg border border-blue-500 bg-gray-900 bg-opacity-95 text-white shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <IoInformationCircle className="text-blue-500 text-xl mr-2" />
            <h3 className="font-bold">Session Expired</h3>
          </div>
          <button
            onClick={handleLogoutNow}
            className="text-gray-400 hover:text-white transition-colors"
            title="Logout now"
          >
            <IoClose size={20} />
          </button>
        </div>

        <p className="text-gray-300 text-sm mb-2">
          Your session has expired. Please login again.
        </p>

        <div className="flex items-center">
          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(seconds / initialSeconds) * 100}%` }}
            ></div>
          </div>
          <p className="text-white text-sm whitespace-nowrap">
            <span className="text-blue-400 font-bold">{seconds}s</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionExpiryModal;
