import React, { useState, useEffect } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Uploader from "../Uploader";
import { castService, imageService } from "../../api/services";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";

function AddCastModal({ isOpen, onClose, onAddCast }) {
  const navigate = useNavigate();
  const [castName, setCastName] = useState("");
  const [castType, setCastType] = useState("Actor");
  const [uploadedImage, setUploadedImage] = useState(null);

  // استخدام هوك معالجة أخطاء المصادقة
  const {
    loading: isLoading,
    setLoading: setIsLoading,
    error,
    setError,
    executeApiCall,
  } = useAuthErrorHandler("An error occurred while adding the cast.");

  const handleAddCast = async () => {
    if (!castName) {
      setError("Please enter a cast name.");
      return;
    }

    // التحقق من وجود اسم أول واسم أخير
    if (!castName.includes(" ")) {
      setError(
        "Please enter both first name and last name separated by a space."
      );
      return;
    }

    // التحقق من أن الاسم الأخير ليس فارغاً
    const nameParts = castName.split(" ");
    if (nameParts.length > 1 && !nameParts[1].trim()) {
      setError("Last name cannot be empty. Please enter a valid last name.");
      return;
    }

    // التحقق من وجود صورة مطلوبة
    if (!uploadedImage) {
      setError("Please upload a cast image.");
      return;
    }

    // تقسيم الاسم إلى الاسم الأول والأخير
    let firstName = castName;
    let lastName = "";

    if (castName.includes(" ")) {
      const nameParts = castName.split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    // إعداد بيانات الممثل
    const castData = {
      firstName: firstName,
      lastName: lastName,
      castType: castType.toUpperCase(),
      imageId: null,
    };

    console.log("Initial cast data:", castData);

    // تحميل الصورة أولاً إذا كانت متوفرة
    let imageUrl = "user.png";
    let imageId = null;

    if (uploadedImage) {
      try {
        // التحقق من حجم الصورة
        if (uploadedImage.size > 5000000) {
          // 5MB
          throw new Error("Image size too large (max 5MB)");
        }

        // إنشاء FormData للصورة
        const imageFormData = new FormData();
        imageFormData.append("Image", uploadedImage);
        imageFormData.append("Title", castName);
        imageFormData.append("Url", "");

        // تحميل الصورة باستخدام هوك معالجة أخطاء المصادقة
        const imageResponse = await executeApiCall(
          async () => await imageService.uploadImage(imageFormData)
        );

        if (imageResponse?.data?.success && imageResponse.data?.data?.id) {
          imageId = imageResponse.data.data.id;
          console.log("Image ID from response:", imageId);

          // تحديث معرف الصورة في بيانات الممثل
          castData.imageId = imageId;

          // استخدام رابط الصورة من الاستجابة إذا كان متاحاً
          if (imageResponse.data?.data?.url) {
            const imagePath = imageResponse.data.data.url;

            // تحقق مما إذا كان المسار يبدأ بـ http
            if (imagePath.startsWith("http")) {
              imageUrl = imagePath;
            } else {
              // إضافة بروتوكول ومجال الخادم إذا كان المسار نسبي
              imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
            }
          } else {
            // إنشاء رابط من اسم الصورة
            const imagePath = uploadedImage.name.startsWith("Images/")
              ? uploadedImage.name
              : `Images/${uploadedImage.name}`;
            imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
          }

          console.log("Final image URL:", imageUrl);
          console.log("Final castData after image upload:", castData);
        }

        // إذا كانت الاستجابة null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
        if (!imageResponse) {
          console.log(
            "Image upload error was handled by the auth error handler"
          );
          return;
        }
      } catch (imageError) {
        console.error("Error uploading image:", imageError);
        // الاستمرار في إنشاء الممثل حتى لو فشل تحميل الصورة
      }
    }

    // طباعة البيانات النهائية قبل الإرسال
    console.log("Final castData before sending to API:", castData);
    console.log("Final imageId:", imageId);
    console.log("castData JSON:", JSON.stringify(castData, null, 2));

    // إنشاء الممثل باستخدام هوك معالجة أخطاء المصادقة
    const response = await executeApiCall(
      async () => await castService.createCast(castData),
      (response) => {
        console.log("Cast creation successful:", response);
        console.log("Cast creation response data:", response?.data);
        console.log(
          "Created cast details:",
          JSON.stringify(response?.data?.data, null, 2)
        );

        // استخراج معرف الممثل الجديد من الاستجابة
        let newCastId;
        if (response.data?.success && response.data?.data?.id) {
          newCastId = response.data.data.id;
        } else if (response.data?.id) {
          newCastId = response.data.id;
        } else {
          newCastId = Date.now().toString();
        }

        // تحديث واجهة المستخدم
        if (onAddCast) {
          const newCast = {
            id: newCastId,
            name: castName,
            image: uploadedImage ? uploadedImage.name : "user.png",
            castType: castType,
            imageUrl: imageUrl,
            imageId: imageId || castData.imageId || null,
          };

          onAddCast(newCast);
        }

        // إغلاق النافذة المنبثقة
        onClose();

        // إعادة تعيين النموذج
        setCastName("");
        setCastType("Actor");
        setUploadedImage(null);
      }
    );

    // إذا كانت الاستجابة null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
    if (!response) {
      console.log("Cast creation error was handled by the auth error handler");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}

      {/* Modal content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] max-w-[450px] p-6 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Add Cast</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-400 ml-4"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Cast Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">
              Cast Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={castName}
              onChange={(e) => setCastName(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Enter Cast Name"
              required
            />
          </div>

          {/* Cast Type Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-border">
              Cast Role <span className="text-red-500">*</span>
            </label>
            <select
              value={castType}
              onChange={(e) => setCastType(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-white"
              required
            >
              <option value="Actor">Actor</option>
              <option value="Director">Director</option>
            </select>
          </div>

          {/* Cast Image */}
          <div className="w-full">
            <div className="flex flex-col gap-2 group">
              <p className="text-border font-semibold text-sm">
                Cast Image <span className="text-red-500">*</span>
              </p>
              <Uploader
                className="w-full"
                onFileSelect={(file) => setUploadedImage(file)}
              />
            </div>
          </div>

          {/* Display Image Preview */}
          {uploadedImage && (
            <div className="w-24 h-24 p-2 bg-main border border-border rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 relative">
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt={castName}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  console.log(
                    `Error loading image in modal for ${castName}, trying fallback`
                  );
                  e.target.onerror = null;
                  e.target.src = "/images/user.png";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                {uploadedImage.name.length > 15
                  ? uploadedImage.name.substring(0, 12) + "..."
                  : uploadedImage.name}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-100 bg-opacity-10 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="w-full">
            <button
              onClick={handleAddCast}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 bg-beige3 border border-beige3 text-white font-medium py-3 rounded-xl transition ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-main cursor-pointer"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <HiPlusCircle className="text-lg" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCastModal;
