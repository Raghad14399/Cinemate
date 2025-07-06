import React, { useState } from "react";
import { IoChevronBack, IoChevronForward, IoCalendar } from "react-icons/io5";

function DatePicker({
  label,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className = "",
  minDate = null, // تاريخ أدنى مسموح به
  maxDate = null, // تاريخ أقصى مسموح به
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // أسماء الأشهر
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // أسماء أيام الأسبوع
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // الحصول على أول يوم في الشهر
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // الحصول على عدد أيام الشهر
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // تحويل التاريخ من DD/MM/YYYY إلى Date object
  const parseDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // تحويل Date object إلى DD/MM/YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // التعامل مع تغيير الشهر
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // التعامل مع تغيير السنة
  const changeYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  // التحقق من صحة التاريخ بناءً على القيود
  const isDateValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // التحقق من التاريخ الأدنى (اليوم)
    if (date < today) {
      return false;
    }

    // التحقق من التاريخ الأدنى المخصص
    if (minDate) {
      const minDateObj = parseDate(minDate);
      if (minDateObj && date < minDateObj) {
        return false;
      }
    }

    // التحقق من التاريخ الأقصى المخصص
    if (maxDate) {
      const maxDateObj = parseDate(maxDate);
      if (maxDateObj && date > maxDateObj) {
        return false;
      }
    }

    return true;
  };

  // التعامل مع اختيار يوم
  const selectDay = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // التحقق من صحة التاريخ قبل الاختيار
    if (!isDateValid(selectedDate)) {
      return;
    }

    const formattedDate = formatDate(selectedDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  // التعامل مع الكتابة اليدوية
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // السماح فقط بالأرقام والشرطة المائلة
    if (
      inputValue === "" ||
      /^(\d{0,2}\/?\d{0,2}\/?\d{0,4})$/.test(inputValue)
    ) {
      // التحقق من صحة التاريخ إذا كان مكتملاً
      if (inputValue.length === 10) {
        const [day, month, year] = inputValue.split("/");
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (
          dayNum >= 1 &&
          dayNum <= 31 &&
          monthNum >= 1 &&
          monthNum <= 12 &&
          yearNum >= 1920 &&
          yearNum <= 2200
        ) {
          onChange(inputValue);
          // تحديث التقويم ليعرض الشهر المحدد
          setCurrentDate(new Date(yearNum, monthNum - 1, dayNum));
        }
      } else {
        onChange(inputValue);
      }
    }
  };

  // رسم أيام الشهر
  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const selectedDate = parseDate(value);

    const days = [];

    // إضافة أيام فارغة في بداية الشهر
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // إضافة أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday = new Date().toDateString() === dayDate.toDateString();

      const isDisabled = !isDateValid(dayDate);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => selectDay(day)}
          disabled={isDisabled}
          className={`w-8 h-8 text-sm rounded-lg transition-colors duration-200 ${
            isDisabled
              ? "text-gray-600 cursor-not-allowed opacity-50"
              : isSelected
              ? "bg-beige3 text-white"
              : isToday
              ? "bg-blue-500 text-white"
              : "text-gray-300 hover:bg-beige3 hover:text-white"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-border font-medium text-sm">{label}</label>
      )}

      <div className="relative">
        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          maxLength="10"
          placeholder={placeholder}
          className="w-full bg-main border border-border text-white rounded-2xl p-4 pr-12 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
          style={{ direction: "ltr" }}
        />

        {/* Calendar Icon */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <IoCalendar className="h-5 w-5" />
        </button>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-main border border-border rounded-2xl shadow-lg z-50 p-4">
            {/* Header with Month/Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => changeYear(-1)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <IoChevronBack className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <IoChevronBack className="h-3 w-3" />
                </button>

                <span className="text-white font-medium text-sm min-w-[120px] text-center">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>

                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <IoChevronForward className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => changeYear(1)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <IoChevronForward className="h-4 w-4" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-400 font-medium p-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
          </div>
        )}
      </div>

      {/* Overlay to close calendar when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default DatePicker;
