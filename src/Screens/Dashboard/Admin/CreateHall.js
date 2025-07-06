import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import { hallService } from "../../../api/services";
import { toast } from "react-toastify";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";

function CreateCinemaHall() {
  const navigate = useNavigate();
  const [hallNumber, setHallNumber] = useState("");
  const [hallType, setHallType] = useState("Standard");
  const [rows, setRows] = useState(15);
  const [columns, setColumns] = useState(10);
  const [aisles, setAisles] = useState([]); // قائمة الممرات

  // حساب عدد المقاعد الفعلية (إجمالي المقاعد - الممرات)
  const totalSeats = rows * columns - aisles.length;

  const generateRowLabels = (count) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      let label = "";
      let num = i;
      while (num >= 0) {
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26) - 1;
      }
      labels.push(label);
    }
    return labels;
  };

  const configureHall = (type) => {
    switch (type) {
      case "VIP":
        return { rows: 8, columns: 10 };
      default:
        return { rows: 10, columns: 15 };
    }
  };

  const handleHallTypeChange = (type) => {
    setHallType(type);
    const config = configureHall(type);
    setRows(config.rows);
    setColumns(config.columns);
    setAisles([]);
  };

  const addAisle = (seat) => {
    if (aisles.includes(seat)) {
      setAisles(aisles.filter((s) => s !== seat)); // إزالة الكرسي من الممرات (تعيين isValid إلى true)
    } else {
      setAisles([...aisles, seat]); // إضافة الكرسي إلى الممرات (تعيين isValid إلى false)
    }
  };

  const renderSeats = () => {
    const rowLabels = generateRowLabels(rows);

    // إضافة الصفوف والكراسي
    return rowLabels.map((label, i) => {
      const row = [];
      for (let j = 1; j <= columns; j++) {
        const seat = `${label}${j}`;
        const isAisle = aisles.includes(seat); // هل الكرسي مدرج كممر؟

        // إذا كان الكرسي مدرجًا كممر، نعرض فراغًا
        if (isAisle) {
          row.push(
            <div
              key={seat}
              onClick={() => addAisle(seat)} // النقر بالزر الأيسر لاستعادة الكرسي
              className="inline-flex items-center justify-center"
              style={{
                width: "50px",
                height: "50px",
                margin: "0 4px",
                border: "1px dashed gray", // حدود خفيفة للممر
              }}
            ></div>
          );
          continue;
        }

        // إذا لم يكن الكرسي مدرجًا كممر، نعرضه بشكله الأصلي
        row.push(
          <div
            key={seat}
            onClick={() => addAisle(seat)} // النقر بالزر الأيسر لتحويل الكرسي إلى ممر
            className="inline-flex items-center justify-center cursor-pointer transition-all relative"
            style={{
              width: "50px",
              height: "50px",
              backgroundImage: `url(/images/cinema.png)`, // صورة الكرسي الأصلية
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "4px",
              margin: "0 4px",
            }}
            title={seat} // عرض اسم الكرسي عند التحويم
          >
            {/* الرقم الخاص بالكرسي مع الشفافية */}
            <span
              className="absolute text-gray-400 font-bold text-xs opacity-30"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {seat}
            </span>
          </div>
        );
      }

      return (
        <div key={label} className="flex items-center gap-4">
          {/* Row Label */}
          <div className="w-[50px] flex items-center justify-center font-bold text-gray-700">
            {label}
          </div>
          {/* Seats */}
          <div className="flex gap-2" style={{ minWidth: `${columns * 58}px` }}>
            {row}
          </div>
        </div>
      );
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // استخدام هوك معالجة أخطاء المصادقة
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to create hall. Please try again."
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!hallNumber.trim()) {
      setError("Hall number is required");
      toast.error("Hall number is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // تحويل بيانات القاعة إلى الصيغة المطلوبة للـ API
      const hallData = {
        hallNumber,
        hallType,
        rows,
        columns,
        aisles,
      };

      console.log("Creating hall with data:", hallData);

      // تحويل بيانات القاعة إلى الصيغة المطلوبة للـ API
      const apiData = {
        name: hallData.hallNumber,
        isVip: hallData.hallType === "VIP",
        rowCount: hallData.rows,
        columnCount: hallData.columns,
        hallChairs: [],
      };

      // إنشاء تسميات الصفوف
      const rowLabels = [];
      for (let i = 0; i < hallData.rows; i++) {
        let label = "";
        let num = i;
        while (num >= 0) {
          label = String.fromCharCode(65 + (num % 26)) + label;
          num = Math.floor(num / 26) - 1;
        }
        rowLabels.push(label);
      }

      // إنشاء المقاعد (جميع المقاعد المحتملة)
      for (let i = 0; i < hallData.rows; i++) {
        for (let j = 1; j <= hallData.columns; j++) {
          const seat = `${rowLabels[i]}${j}`;
          const isAisle = hallData.aisles.includes(seat);

          // إضافة جميع المقاعد مع تحديد isValid بناءً على ما إذا كان الكرسي ممرًا أم لا
          apiData.hallChairs.push({
            column: j.toString(),
            row: rowLabels[i],
            code: seat,
            isValid: !isAisle, // إذا كان الكرسي ممرًا (isAisle=true)، فإن isValid يكون false
            // وإذا كان الكرسي ظاهرًا (isAisle=false)، فإن isValid يكون true
          });
        }
      }

      console.log("Transformed data for API:", apiData);

      // إرسال البيانات إلى الخادم باستخدام executeApiCall
      const response = await executeApiCall(() =>
        hallService.createHall(apiData)
      );

      if (!response) {
        // إذا كان response null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
        return;
      }

      console.log("Hall created successfully:", response);

      // تحليل استجابة API
      console.log("API response structure:", Object.keys(response.data));
      if (response.data.success !== undefined) {
        console.log("API response success:", response.data.success);
        console.log("API response message:", response.data.message);
        if (response.data.data) {
          console.log("Created hall data:", response.data.data);
        }
      }

      // عرض رسالة نجاح
      toast.success("Hall created successfully!");

      // تأخير قصير قبل الانتقال للسماح بتحديث البيانات في الخادم
      await new Promise((resolve) => setTimeout(resolve, 500));

      // الانتقال إلى صفحة القاعات
      navigate("/halls");
    } catch (error) {
      console.error("Error creating hall:", error);

      // عرض رسالة خطأ عامة
      setError(error.message || "Failed to create hall");
      toast.error(error.message || "Failed to create hall");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SideBar>
      <div className="p-6 bg-lightGray rounded-lg shadow-md">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 font-bold py-1 px-3 rounded-full transition duration-300 ease-in-out"
          onClick={() => navigate("/halls")}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          Create a New Hall
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="hallNumber"
                className="text-sm font-medium text-border"
              >
                Hall Number
              </label>
              <input
                id="hallNumber"
                type="text"
                value={hallNumber}
                onChange={(e) => setHallNumber(e.target.value)}
                placeholder="Enter hall number"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="hallType"
                className="text-sm font-medium text-border"
              >
                Hall Type
              </label>
              <select
                id="hallType"
                value={hallType}
                onChange={(e) => handleHallTypeChange(e.target.value)}
                className="text-sm p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              >
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label htmlFor="rows" className="text-sm font-medium text-border">
                Rows
              </label>
              <input
                id="rows"
                type="text"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                placeholder="Number of rows"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label
                htmlFor="columns"
                className="text-sm font-medium text-border"
              >
                Columns
              </label>
              <input
                id="columns"
                type="text"
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                placeholder="Number of columns"
                className="text-sm placeholder-gray-700 p-3 rounded-2xl border border-border bg-main focus:outline-none focus:ring-1 focus:ring-beige"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="text-sm font-medium text-border">
              Total Seats: <span className="text-white">{totalSeats}</span>
            </div>
            <div className="text-sm font-medium text-border">
              Aisles: <span className="text-white">{aisles.length}</span>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-beige3 text-white text-sm font-medium rounded-2xl border border-beige3 transition duration-300 flex items-center justify-center ${isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-dry cursor-pointer"
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Creating...</span>
              </>
            ) : (
              "Create Hall"
            )}
          </button>
        </form>

        {/* Legend Section */}
        <div className="mt-6 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-cover bg-center"
              style={{
                backgroundImage: `url(/images/cinema.png)`,
              }}
            ></div>
            <span className="text-base text-gray-700">Seat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-transparent border border-gray-700 border-solid rounded-full"></div>
            <span className="text-base text-gray-700">Aisle (Hidden)</span>
          </div>
        </div>

        <div className="mt-10">
          {/* Shared Scroll Container */}
          <div
            className="flex flex-col gap-4"
            style={{
              maxHeight: "500px",
              overflowY: "auto", // تمكين التمرير الرأسي المشترك
              overflowX: "auto", // تمكين التمرير الأفقي للكراسي
            }}
          >
            {renderSeats()}
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default CreateCinemaHall;
