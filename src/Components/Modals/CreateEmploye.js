import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";
import { authService } from "../../api/services";

function CreatEmploye({ isOpen, onClose, employes = [], setEmployes }) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Scanner"); // القيمة الافتراضية Scanner
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+963"); // القيمة الافتراضية

  // استخدام هوك معالجة أخطاء المصادقة
  const { executeApiCall } = useAuthErrorHandler(
    "Failed to add employee. Please try again."
  );

  const countryCodes = [
    { code: "+963", label: "SY (+963)", digits: 10 }, // سوريا - 09xxxxxxxx
    { code: "+966", label: "SA (+966)", digits: 9 }, // السعودية - 5xxxxxxxx
    { code: "+20", label: "EG (+20)", digits: 10 }, // مصر
    { code: "+971", label: "UAE (+971)", digits: 9 }, // الإمارات
    { code: "+965", label: "KW (+965)", digits: 8 }, // الكويت
    { code: "+974", label: "QA (+974)", digits: 8 }, // قطر
    { code: "+968", label: "OM (+968)", digits: 8 }, // عمان
  ];

  // دالة لتنظيف وتنسيق الرقم السوري
  const formatSyrianPhoneNumber = (input) => {
    if (!input) return "";

    // إزالة جميع المسافات والرموز غير الرقمية عدا +
    let cleaned = input.replace(/[^\d+]/g, "");

    // معالجة الصيغ المختلفة للرقم السوري
    if (cleaned.startsWith("00963")) {
      // 009630911111111 → 0911111111
      cleaned = "0" + cleaned.substring(5);
    } else if (cleaned.startsWith("+963")) {
      // +963911111111 → 0911111111
      cleaned = "0" + cleaned.substring(4);
    } else if (cleaned.startsWith("963")) {
      // 963911111111 → 0911111111
      cleaned = "0" + cleaned.substring(3);
    } else if (cleaned.startsWith("9") && cleaned.length === 9) {
      // 911111111 → 0911111111
      cleaned = "0" + cleaned;
    } else if (cleaned.startsWith("09") && cleaned.length === 10) {
      // 0911111111 → بدون تغيير
      return cleaned;
    }

    // التأكد من أن الرقم يبدأ بـ 09 وطوله 10 أرقام
    if (cleaned.startsWith("09") && cleaned.length === 10) {
      return cleaned;
    }

    // إذا لم يكن بالصيغة الصحيحة، إرجاع الإدخال الأصلي للمستخدم ليصححه
    return input;
  };

  // دالة لتنظيف وتنسيق الرقم السعودي
  const formatSaudiPhoneNumber = (input) => {
    if (!input) return "";

    // إزالة جميع المسافات والرموز غير الرقمية عدا +
    let cleaned = input.replace(/[^\d+]/g, "");

    // معالجة الصيغ المختلفة للرقم السعودي
    if (cleaned.startsWith("00966")) {
      // 00966512345678 → 512345678
      cleaned = cleaned.substring(5);
    } else if (cleaned.startsWith("+966")) {
      // +966512345678 → 512345678
      cleaned = cleaned.substring(4);
    } else if (cleaned.startsWith("966")) {
      // 966512345678 → 512345678
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith("05")) {
      // 0512345678 → 512345678
      cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith("5") && cleaned.length === 9) {
      // 512345678 → بدون تغيير
      return cleaned;
    }

    // التأكد من أن الرقم يبدأ بـ 5 وطوله 9 أرقام
    if (cleaned.startsWith("5") && cleaned.length === 9) {
      return cleaned;
    }

    // إذا لم يكن بالصيغة الصحيحة، إرجاع الإدخال الأصلي للمستخدم ليصححه
    return input;
  };

  // دالة للتحقق من صحة الرقم حسب الدولة المختارة
  const validatePhoneNumber = (phoneNumber, countryCode) => {
    if (countryCode === "+963") {
      // التحقق من الرقم السوري
      const formatted = formatSyrianPhoneNumber(phoneNumber);
      return (
        formatted.startsWith("09") &&
        formatted.length === 10 &&
        /^\d+$/.test(formatted)
      );
    } else if (countryCode === "+966") {
      // التحقق من الرقم السعودي
      const formatted = formatSaudiPhoneNumber(phoneNumber);
      return (
        formatted.startsWith("5") &&
        formatted.length === 9 &&
        /^\d+$/.test(formatted)
      );
    } else {
      // للدول الأخرى، التحقق العادي
      const selectedCountry = countryCodes.find(
        (country) => country.code === countryCode
      );
      return (
        phoneNumber.length === selectedCountry.digits &&
        /^\d+$/.test(phoneNumber)
      );
    }
  };

  // دالة لتنسيق الرقم حسب الدولة المختارة
  const formatPhoneNumber = (input, countryCode) => {
    if (countryCode === "+963") {
      return formatSyrianPhoneNumber(input);
    } else if (countryCode === "+966") {
      return formatSaudiPhoneNumber(input);
    } else {
      // للدول الأخرى، إرجاع الرقم كما هو مع تنظيف الرموز
      return input.replace(/[^\d]/g, "");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddEmployee = async () => {
    // التحقق من إدخال جميع الحقول المطلوبة
    if (!userName || !phoneNumber || !email || !password || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    // التحقق من أن الاسم يحتوي على أكثر من حرفين
    if (userName.trim().length < 2) {
      setError("User name must be at least 2 characters long.");
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // التحقق من صحة الرقم حسب الدولة المختارة
    if (!validatePhoneNumber(phoneNumber, selectedCountryCode)) {
      const selectedCountry = countryCodes.find(
        (country) => country.code === selectedCountryCode
      );
      setError(
        `Please enter a valid phone number for ${selectedCountry.label}.`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // تنسيق الرقم حسب الدولة المختارة قبل الإرسال
      const formattedPhoneNumber = formatPhoneNumber(
        phoneNumber,
        selectedCountryCode
      );

      const formData = new FormData();
      formData.append("UserName", userName);
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("PhoneNumber", formattedPhoneNumber);
      formData.append("Role", role);
      if (image) {
        formData.append("Image", image);
      }

      // طباعة البيانات للتصحيح
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await executeApiCall(() =>
        authService.addUser(formData)
      );

      if (!response) {
        // إذا كان response null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
        return;
      }

      if (response.data.success) {
        const newEmployeeId = response.data.data;

        if (!newEmployeeId || typeof newEmployeeId !== "number") {
          setError("Invalid data received from the server.");
          toast.error("Invalid data received from the server.");
          return;
        }

        const newEmployee = {
          id: newEmployeeId,
          userName: userName.trim(),
          phoneNumber: formattedPhoneNumber,
          email: email.trim(),
          role: role.trim(),
        };

        setEmployes((prevEmployees) => [...prevEmployees, newEmployee]);

        setUserName("");
        setPhoneNumber("");
        setEmail("");
        setRole("Scanner"); // إعادة تعيين إلى القيمة الافتراضية
        setPassword("");
        setImage(null);

        toast.success(`Employee "${newEmployee.userName}" added successfully`);
        onClose();
      } else {
        setError(response.data.message || "Failed to add employee.");
        toast.error(response.data.message || "Failed to add employee.");
      }
    } catch (err) {
      console.error("Error adding employee:", err);

      // طباعة تفاصيل الخطأ للتصحيح
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", err.response.data);
        console.error("Error response headers:", err.response.headers);
      }

      let errorMessage = "An error occurred while adding the employee.";

      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // معالجة أخطاء التحقق
          const validationErrors = err.response.data.errors;
          const errorMessages = Object.keys(validationErrors).map(
            (key) => `${key}: ${validationErrors[key].join(", ")}`
          );
          errorMessage = errorMessages.join("\n");
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] md:w-[650px] lg:w-[750px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "translate-y-0" : "-translate-y-10"
        }`}
      >
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">
            Create Employee
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out ml-4"
          >
            X
          </button>
        </div>

        <div className="space-y-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* UserName Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                User Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Phone Number Input with Country Code */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-main">
                {/* Country Code Dropdown */}
                <select
                  value={selectedCountryCode}
                  onChange={(e) => {
                    setSelectedCountryCode(e.target.value);
                    setPhoneNumber(""); // إفراغ الحقل عند تغيير رمز الدولة
                  }}
                  className="p-3 bg-gray-800 text-sm border-r border-gray-700 rounded-l-xl appearance-none focus:outline-none"
                  style={{ width: "100px" }}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>

                {/* Phone Number Input */}
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const input = e.target.value;
                    // تطبيق التنسيق أثناء الكتابة حسب الدولة المختارة
                    const formatted = formatPhoneNumber(
                      input,
                      selectedCountryCode
                    );
                    setPhoneNumber(formatted);
                  }}
                  className="w-full p-3 bg-gray-800 rounded-r-xl focus:outline-none text-sm"
                  placeholder={
                    selectedCountryCode === "+963"
                      ? "09xxxxxxxx"
                      : "Enter phone number"
                  }
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter email"
                required
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                required
              >
                <option value="Scanner">Scanner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 p-2 text-border">
                Profile Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-beige3 file:text-white hover:file:bg-main"
                accept="image/*"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          <button
            onClick={handleAddEmployee}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <span>Adding...</span> : <>Add Employee</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatEmploye;
