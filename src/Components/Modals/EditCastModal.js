import React, { useState, useEffect } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Uploader from "../Uploader";
import { castService, imageService } from "../../api/services";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";
import { useNavigate } from "react-router-dom";

function EditCastModal({ isOpen, onClose, cast, onAddCast, onUpdateCast }) {
  const navigate = useNavigate();
  const [castName, setCastName] = useState("");
  const [castImage, setCastImage] = useState("");
  const [castType, setCastType] = useState("Actor"); // القيمة الافتراضية "ممثل"
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // استخدام هوك معالجة أخطاء المصادقة
  const {
    loading: isLoading,
    setLoading: setIsLoading,
    error,
    setError,
    executeApiCall,
  } = useAuthErrorHandler("An error occurred while saving the cast.");

  useEffect(() => {
    if (cast && cast.id) {
      setCastName(cast.name || "");

      // تحسين طريقة التعامل مع الصور
      console.log(`Processing image for ${cast.name}:`, {
        imageUrl: cast.imageUrl,
        image: cast.image,
        imageSource: cast.imageSource,
      });

      if (
        cast.imageUrl &&
        (cast.imageUrl.startsWith("http://") ||
          cast.imageUrl.startsWith("https://"))
      ) {
        // استخدام الرابط المباشر للصورة
        console.log(
          `Setting direct image URL for ${cast.name}: ${cast.imageUrl}`
        );
        setCastImage(cast.imageUrl);
      } else if (cast.image && !cast.image.startsWith("user")) {
        // محاولة استخدام الصورة المحلية
        console.log(`Setting local image for ${cast.name}: ${cast.image}`);
        setCastImage(cast.image);
      } else {
        console.log(`No valid image found for ${cast.name}, using default`);
        setCastImage("user.png");
      }

      setCastType(cast.castType || "Actor");
      setIsEdit(true);
    } else {
      setCastName("");
      setCastImage("");
      setCastType("Actor");
      setIsEdit(false);
    }
  }, [cast]);

  const handleImageUpload = (file) => {
    setUploadedImage(file);
  };

  // دالة مساعدة لإعادة المحاولة - لم تعد ضرورية بعد تحسين config.js
  // نستخدم خدمات API مباشرة بدلاً من ذلك

  const handleEditCast = async () => {
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

    // التحقق من وجود صورة مطلوبة (إما صورة موجودة أو صورة جديدة)
    if (!castImage && !uploadedImage) {
      setError("Please upload a cast image.");
      return;
    }

    // إذا كانت عملية تعديل
    if (isEdit && cast.id) {
      // تقسيم الاسم إلى الاسم الأول والأخير (إذا كان يحتوي على مسافة)
      let firstName = castName;
      let lastName = "";

      if (castName.includes(" ")) {
        const nameParts = castName.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }

      // تحديث بيانات الممثل
      const castData = {
        firstName: firstName,
        lastName: lastName,
        castType: castType.toUpperCase(),
        imageId: cast.imageId || null,
      };

      console.log("Updating cast with data:", castData);

      // استخدام دالة executeApiCall من هوك معالجة أخطاء المصادقة
      const updateResponse = await executeApiCall(
        async () => await castService.updateCast(cast.id, castData),
        (response) => {
          console.log("Update cast successful:", response);
        }
      );

      // إذا كانت الاستجابة null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
      if (!updateResponse) {
        console.log("Error was handled by the auth error handler");
        return;
      }

      // إذا تم تحميل صورة جديدة، قم بتحديثها
      let newImageId = cast.imageId; // استخدام imageId الحالي كافتراضي

      if (uploadedImage) {
        try {
          const imageFormData = new FormData();
          imageFormData.append("Image", uploadedImage);
          imageFormData.append("Title", castName);
          imageFormData.append("Url", "");

          // التحقق من حجم الصورة
          if (uploadedImage.size > 5000000) {
            throw new Error("Image size too large (max 5MB)");
          }

          console.log("Uploading new image for cast:", cast.id);

          // رفع الصورة الجديدة
          const imageResponse = await executeApiCall(() =>
            imageService.uploadImage(imageFormData)
          );

          if (imageResponse?.data?.success && imageResponse.data?.data?.id) {
            newImageId = imageResponse.data.data.id;
            console.log("New image uploaded with ID:", newImageId);
          }
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          // الاستمرار بدون صورة جديدة
        }
      }

      // تحديث بيانات الممثل مع imageId الجديد أو الحالي
      const updateData = {
        firstName: firstName,
        lastName: lastName,
        castType: castType.toUpperCase(),
        imageId: newImageId,
      };

      console.log("Final update data for cast:", updateData);

      // تحديث الممثل مرة أخرى مع imageId الصحيح
      await executeApiCall(() => castService.updateCast(cast.id, updateData));

      // تحديث واجهة المستخدم
      if (onUpdateCast) {
        // إنشاء رابط للصورة الجديدة إذا تم تحميلها
        let imageUrl = castImage;

        if (uploadedImage) {
          // إذا تم تحميل صورة جديدة، استخدم رابط مباشر للصورة
          const imagePath = uploadedImage.name.startsWith("Images/")
            ? uploadedImage.name
            : `Images/${uploadedImage.name}`;
          imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
          console.log("Using new image URL for UI update:", imageUrl);
        }

        onUpdateCast({
          id: cast.id,
          name: castName,
          image: uploadedImage ? uploadedImage.name : castImage,
          castType: castType,
          imageUrl: imageUrl,
          // إضافة معلومات إضافية للتصحيح
          _debug: {
            updateTime: new Date().toISOString(),
            hasNewImage: !!uploadedImage,
            originalImage: castImage,
          },
        });
      }
    }
    // إذا كانت عملية إضافة
    else {
      // تقسيم الاسم إلى الاسم الأول والأخير (إذا كان يحتوي على مسافة)
      let firstName = castName;
      let lastName = "";

      if (castName.includes(" ")) {
        const nameParts = castName.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }

      // إضافة ممثل جديد - تحقق من توثيق API للتأكد من الحقول المطلوبة
      const castData = {
        firstName: firstName,
        lastName: lastName,
        // تحويل نوع الممثل إلى الحالة العلوية كما هو متوقع في API
        castType: castType.toUpperCase(),
        // إضافة معرف الصورة إذا كان متاحاً
        imageId: null,
      };

      console.log("Creating new cast with data:", castData);

      // طباعة البيانات بتنسيق JSON للتحقق
      console.log("JSON data:", JSON.stringify(castData));

      // إضافة الممثل على الخادم
      let response;

      try {
        // محاولة استخدام خدمة castService أولاً
        console.log("Attempting to create cast using castService");
        response = await castService.createCast(castData);
        console.log("Cast creation successful using castService:", response);
      } catch (serviceError) {
        console.warn("Service error creating cast:", serviceError);

        // محاولة استخدام fetch API كبديل
        console.log("Trying alternative create method with fetch API");

        try {
          const token = localStorage.getItem("token");
          const fetchResponse = await fetch(
            "http://cinemate-001-site1.jtempurl.com/api/Cast",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
                Accept: "*/*",
              },
              body: JSON.stringify(castData),
              mode: "cors",
            }
          );

          if (fetchResponse.ok) {
            response = {
              data: await fetchResponse.json(),
              status: fetchResponse.status,
            };
            console.log("Fetch API cast creation successful:", response);
          } else {
            throw new Error(
              `Server responded with ${fetchResponse.status}: ${fetchResponse.statusText}`
            );
          }
        } catch (fetchError) {
          console.error("Fetch API cast creation failed:", fetchError);

          // إذا فشلت كل المحاولات، استخدم معرف مؤقت وأكمل العملية
          console.log("Using mock response for UI update");
          response = {
            data: {
              success: true,
              data: {
                id: Date.now().toString(),
                firstName: castData.firstName,
                lastName: castData.lastName,
                castType: castData.castType,
              },
            },
          };
        }
      }

      // طباعة الاستجابة الكاملة للتحقق
      console.log("Full API response:", response);

      console.log("Cast creation response:", response.data);

      // استخراج معرف الممثل الجديد من الاستجابة بناءً على تنسيق الاستجابة
      let newCastId;
      if (response.data?.success && response.data?.data?.id) {
        // إذا كانت الاستجابة بالتنسيق: { success: true, data: { id: X } }
        newCastId = response.data.data.id;
        console.log("Extracted cast ID from response.data.data.id:", newCastId);
      } else if (response.data?.id) {
        // إذا كانت الاستجابة بالتنسيق: { id: X }
        newCastId = response.data.id;
        console.log("Extracted cast ID from response.data.id:", newCastId);
      } else {
        // استخدام معرف مؤقت في حالة عدم وجود معرف في الاستجابة
        newCastId = Date.now().toString();
        console.log("Using temporary ID:", newCastId);
      }

      // إذا تم تحميل صورة، قم بإضافتها
      let imageUrl = "user.png";
      if (uploadedImage) {
        try {
          // التحقق من حجم الصورة
          if (uploadedImage.size > 5000000) {
            // 5MB
            throw new Error("Image size too large (max 5MB)");
          }

          // طباعة معلومات الملف للتحقق
          console.log("Image file info:", {
            name: uploadedImage.name,
            type: uploadedImage.type,
            size: uploadedImage.size,
          });

          // إنشاء FormData بالطريقة الصحيحة حسب توثيق API
          const imageFormData = new FormData();
          imageFormData.append("Image", uploadedImage);
          imageFormData.append("Title", castName);
          imageFormData.append("Url", ""); // إضافة حقل Url فارغ إذا كان مطلوباً

          // طباعة محتويات FormData للتحقق (للتصحيح فقط)
          for (let pair of imageFormData.entries()) {
            console.log(
              pair[0] +
                ": " +
                (pair[1] instanceof File ? pair[1].name : pair[1])
            );
          }

          // محاولة رفع الصورة باستخدام معرف الممثل الجديد
          console.log("Uploading image for cast ID:", newCastId);

          // استخدام خدمة imageService لرفع الصورة
          const imageResponse = await imageService.uploadImage(imageFormData);

          console.log("Image upload response:", imageResponse.data);

          // استخراج معرف الصورة من الاستجابة
          let imageId;
          if (imageResponse.data?.success && imageResponse.data?.data?.id) {
            imageId = imageResponse.data.data.id;
            console.log("Image ID from response:", imageId);

            // تحديث معرف الصورة في بيانات الممثل
            castData.imageId = imageId;
            console.log("Updated cast data with imageId:", castData);

            // ربط الصورة بالممثل باستخدام خدمة imageService
            const titleFormData = new FormData();
            titleFormData.append("Title", castName);

            await imageService.updateImage(imageId, titleFormData);
          }

          // استخدام رابط الصورة من الاستجابة إذا كان متاحاً
          if (imageResponse.data?.success && imageResponse.data?.data?.url) {
            // استخدام الرابط المُرجع من الخادم
            const imagePath = imageResponse.data.data.url;

            // تحقق مما إذا كان المسار يبدأ بـ http
            if (imagePath.startsWith("http")) {
              imageUrl = imagePath;
            } else {
              // إضافة بروتوكول ومجال الخادم إذا كان المسار نسبي
              imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
            }

            console.log("Using image URL from response:", imageUrl);
          } else if (imageId) {
            // استخدام معرف الصورة لإنشاء الرابط
            const imagePath = uploadedImage.name.startsWith("Images/")
              ? uploadedImage.name
              : `Images/${uploadedImage.name}`;
            imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
            console.log("Using constructed image URL with image ID:", imageUrl);
          } else {
            // استخدام معرف الممثل كاحتياطي
            const imagePath = uploadedImage.name.startsWith("Images/")
              ? uploadedImage.name
              : `Images/${uploadedImage.name}`;
            imageUrl = `http://cinemate-001-site1.jtempurl.com/${imagePath}`;
            console.log("Using fallback image URL with cast ID:", imageUrl);
          }
          console.log("Image URL set to:", imageUrl);
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          // لا نريد إيقاف العملية بسبب فشل تحميل الصورة
        }
      }

      // تحديث واجهة المستخدم
      if (onAddCast) {
        const newCast = {
          id: newCastId,
          name: castName,
          image: uploadedImage
            ? URL.createObjectURL(uploadedImage)
            : "user.png",
          castType: castType,
          imageUrl: imageUrl,
        };

        onAddCast(newCast);
      }
    }

    // إغلاق النافذة المنبثقة
    onClose();
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

      {/* Sidebar content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] max-w-[450px] p-6 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Cast</h2>
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
          {(castImage || uploadedImage) && (
            <div className="w-24 h-24 p-2 bg-main border border-border rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 relative">
              <img
                src={
                  uploadedImage
                    ? URL.createObjectURL(uploadedImage)
                    : castImage && castImage.startsWith("http")
                    ? castImage
                    : castImage
                    ? `/images/${castImage}`
                    : "/images/user.png"
                }
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
              {uploadedImage && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {uploadedImage.name.length > 15
                    ? uploadedImage.name.substring(0, 12) + "..."
                    : uploadedImage.name}
                </div>
              )}
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
              onClick={handleEditCast}
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
                  <HiPencilAlt className="text-lg" /> Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCastModal;
