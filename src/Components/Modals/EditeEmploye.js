import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";
import { authService } from "../../api/services";

function EditeEmploye({ isOpen, onClose, employe, onEdit }) {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Scanner");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+963");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { executeApiCall } = useAuthErrorHandler(
    "Failed to update employee. Please try again."
  );

  const countryCodes = [
    { code: "+963", label: "SY (+963)", digits: 9 }, // سوريا
    { code: "+966", label: "SA (+966)", digits: 9 }, // السعودية
    { code: "+20", label: "EG (+20)", digits: 10 }, // مصر
    { code: "+971", label: "UAE (+971)", digits: 9 }, // الإمارات
    { code: "+965", label: "KW (+965)", digits: 8 }, // الكويت
    { code: "+974", label: "QA (+974)", digits: 8 }, // قطر
    { code: "+968", label: "OM (+968)", digits: 8 }, // عمان
  ];

  useEffect(() => {
    if (isOpen && employe) {
      setUserName(employe.fullName || "");
      setEmail(employe.email || "");
      setRole(employe.role || "Scanner");
      setImagePreview(employe.image?.url || null);

      const fullPhoneNumber = employe.phoneNumber || "";
      const country = countryCodes.find(c => fullPhoneNumber.startsWith(c.code));
      
      if (country) {
        setSelectedCountryCode(country.code);
        setPhoneNumber(fullPhoneNumber.substring(country.code.length));
      } else {
        setSelectedCountryCode("+963");
        setPhoneNumber(fullPhoneNumber);
      }
      
      // Reset local state for new edits
      setImage(null);
      setError("");

    }
  }, [isOpen, employe]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return true; // Allow empty phone number
    
    // Accept either 10 digits starting with 0 or 9 digits without leading zero
    const phoneRegex = /^(0\d{9}|\d{9})$/;
    if (!phoneRegex.test(phone)) {
      toast.error('رقم الهاتف غير صالح. يجب أن يبدأ بـ 0 ويحتوي على 10 أرقام');
      return false;
    }
    return true;
  };

  const handleUpdateEmployee = async () => {
    if (!userName) {
      setError("User name is required.");
      return;
    }
    if (userName.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate phone number only if it is not empty
    if (phoneNumber) {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError("Phone number must contain only digits.");
        return;
      }
      const selectedCountry = countryCodes.find(
        (country) => country.code === selectedCountryCode
      );
      if (phoneNumber.length !== selectedCountry.digits) {
        setError(
          `Phone number must be ${selectedCountry.digits} digits for ${selectedCountry.label}.`
        );
        return;
      }
    }

    setLoading(true);
    setError("");

    // Validate phone number before proceeding
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    const formData = new FormData();

    // Aligning payload with the working CreateEmploye component.
    // Synthesizing user feedback and API docs: send a complete model to prevent silent failures.
    formData.append("UserName", userName);
    formData.append("Email", email);
    formData.append("Role", role.toUpperCase());

    // Per the successful cURL command, all fields must be sent, even if empty.
    // Send only the phone number without country code
    formData.append("PhoneNubmer", phoneNumber || ""); // Note the typo from the API docs.

    const imageId = employe.image?.id || "";
    formData.append("ImageId", imageId);

    const response = await executeApiCall(() =>
      authService.updateUser(employe.id, formData)
    );

    setLoading(false);

    if (response?.success) {
    
      onEdit(response.data);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-500 ease-in-out opacity-100 visible">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />
      <div className="relative bg-gray-900 text-white border border-border w-[90%] md:w-[650px] lg:w-[750px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 translate-y-0">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Employee</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500 ml-4 transition duration-300 ease-in-out">
            <IoClose />
          </button>
        </div>
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Name <span className="text-red-500">*</span></label>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm" placeholder="Enter name" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Phone Number <span className="text-red-500">*</span></label>
              <div className="flex items-center bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-main">
                <select value={selectedCountryCode} onChange={(e) => { setSelectedCountryCode(e.target.value); setPhoneNumber(""); }} className="p-3 bg-gray-800 text-sm border-r border-gray-700 border-solid rounded-l-xl appearance-none focus:outline-none" style={{ width: "100px" }}>
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>{country.label}</option>
                  ))}
                </select>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 bg-gray-800 rounded-r-xl focus:outline-none text-sm" placeholder="Enter phone number" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Email</label>
              <input type="email" value={email} className="w-full p-3 bg-gray-700 rounded-xl focus:outline-none text-sm text-gray-400 cursor-not-allowed" placeholder="Enter email" readOnly />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Role <span className="text-red-500">*</span></label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm" required>
                <option value="Scanner">Scanner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Profile Image</label>
              <div className="flex items-center gap-4">
                <input type="file" onChange={handleImageChange} className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-beige3 file:text-white hover:file:bg-main" accept="image/*" />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-main" />
                )}
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <button onClick={handleUpdateEmployee} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditeEmploye;