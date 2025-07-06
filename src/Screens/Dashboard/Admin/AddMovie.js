import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import { Input } from "../../../Components/UsedInputs";
import Uploader from "../../../Components/Uploader";
import MultiSelect from "../../../Components/MultiSelect";
import DatePicker from "../../../Components/DatePicker";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ImUpload } from "react-icons/im";

import EditCastModal from "../../../Components/Modals/EditCastModal";
import AddCastModal from "../../../Components/Modals/AddCastModal";
import DeleteConfirmModal from "../../../Components/Modals/DeleteConfirmModal";
import TemporaryModal from "../../../Components/TemporaryModal";
import {
  castService,
  imageService,
  languageService,
  movieClassificationService,
  movieTypeService,
  hallService,
  movieService,
} from "../../../api/services";
import useAuthErrorHandler from "../../../hooks/useAuthErrorHandler";

function AddMovie() {
  // معالج أخطاء المصادقة للقاعات
  const {
    loading: hallsLoading,
    error: hallsError,
    executeApiCall,
  } = useAuthErrorHandler("Failed to load halls. Please try again.");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null);
  const [castToDelete, setCastToDelete] = useState(null);

  // حالات اللغات واخرى
  const [selectedLanguages, setSelectedLanguages] = useState([]); // تغيير إلى مصفوفة للاختيار المتعدد
  const [selectedTranslations, setSelectedTranslations] = useState([]); // تغيير إلى مصفوفة للاختيار المتعدد
  const [releaseYear, setReleaseYear] = useState(""); // سنة الإصدار
  const [showYearPicker, setShowYearPicker] = useState(false); // حالة عرض منتقي السنة
  const [status, setStatus] = useState(""); // حالة الفيلم

  // حقول جديدة مطلوبة من API
  const [movieTitle, setMovieTitle] = useState("");
  const [durationInMinutes, setDurationInMinutes] = useState(0); // مدة الفيلم بالدقائق
  const [trailerUrl, setTrailerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0); // تقييم الفيلم من 1 إلى 5
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // حالات الصور
  const [imageWithoutTitle, setImageWithoutTitle] = useState(null);
  const [imageWithTitle, setImageWithTitle] = useState(null);
  const [imageWithoutTitlePreview, setImageWithoutTitlePreview] =
    useState(null);
  const [imageWithTitlePreview, setImageWithTitlePreview] = useState(null);
  const [imageWithoutTitleLoading, setImageWithoutTitleLoading] =
    useState(false);
  const [imageWithTitleLoading, setImageWithTitleLoading] = useState(false);

  // حالات الأخطاء للحقول
  const [errors, setErrors] = useState({});

  // حالات إدارة القاعات
  const [halls, setHalls] = useState([]);
  const [selectedHallType, setSelectedHallType] = useState(""); // VIP أو Standard
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [selectedHalls, setSelectedHalls] = useState([]); // القاعات المختارة مع تفاصيلها
  const [showHallsSection, setShowHallsSection] = useState(false);
  // إزالة الإعدادات الموحدة واستبدالها بإعدادات فردية لكل قاعة
  // تم إزالة الحقول غير المطلوبة: lastDateShowing, selectedDirector, imageID, secondaryImageID

  // حالة اللغات
  const [languages, setLanguages] = useState([]);

  // حالة تصنيفات الأفلام
  const [movieClassifications, setMovieClassifications] = useState([]);

  // حالة الفئات (Categories)
  const [categories, setCategories] = useState([]);

  // تم إزالة selectedClassification لأننا نستخدم selectedClassifications (مصفوفة)

  // حالة الفئة المحددة (تغيير إلى مصفوفة للاختيار المتعدد)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // حالة التصنيف المحدد (اختيار واحد فقط)
  const [selectedClassification, setSelectedClassification] = useState(0);

  // دوال للتعامل مع الاختيار المتعدد
  const handleLanguageChange = (languageId) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleTranslationChange = (languageId) => {
    setSelectedTranslations((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // تم حذف handleClassificationChange لأننا نستخدم اختيار واحد فقط

  // دالة جلب اللغات من API
  const fetchLanguages = async () => {
    try {
      const response = await languageService.getAllLanguages({
        PageIndex: 0,
        PageSize: 100,
      });

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        // تحويل البيانات إلى التنسيق المطلوب
        const languagesList = response.data.data.map((lang) => ({
          id: lang.id,
          code: lang.code,
          name: lang.englishName,
          arabicName: lang.arabicName,
        }));

        console.log("Languages loaded:", languagesList);
        setLanguages(languagesList);
      } else {
        console.warn("Unexpected language data format:", response.data);
        // استخدام قائمة اللغات الافتراضية في حالة عدم وجود بيانات
        setLanguages([
          { code: "fr", name: "French" },
          { code: "es", name: "Spanish" },
          { code: "de", name: "German" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      // استخدام قائمة اللغات الافتراضية في حالة حدوث خطأ
      setLanguages([
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
        { code: "de", name: "German" },
      ]);
    }
  };

  // دالة جلب تصنيفات الأفلام من API
  const fetchMovieClassifications = async () => {
    try {
      const response =
        await movieClassificationService.getAllMovieClassifications({
          PageIndex: 0,
          PageSize: 100,
        });

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        // تحويل البيانات إلى التنسيق المطلوب
        const classificationsList = response.data.data.map(
          (classification) => ({
            id: classification.id,
            code: classification.code,
            name: classification.englishName,
            arabicName: classification.arabicName,
          })
        );

        console.log("Movie classifications loaded:", classificationsList);
        setMovieClassifications(classificationsList);
      } else {
        console.warn(
          "Unexpected movie classification data format:",
          response.data
        );
        // استخدام قائمة تصنيفات افتراضية في حالة عدم وجود بيانات
        setMovieClassifications([
          { id: 1, code: "G", name: "General", arabicName: "عام" },
          {
            id: 2,
            code: "PG",
            name: "Parental Guidance",
            arabicName: "إشراف الوالدين",
          },
          {
            id: 3,
            code: "PG-13",
            name: "Parents Strongly Cautioned",
            arabicName: "تحذير شديد للوالدين",
          },
          { id: 4, code: "R", name: "Restricted", arabicName: "مقيد" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching movie classifications:", error);
      // استخدام قائمة تصنيفات افتراضية في حالة حدوث خطأ
      setMovieClassifications([
        { id: 1, code: "G", name: "General", arabicName: "عام" },
        {
          id: 2,
          code: "PG",
          name: "Parental Guidance",
          arabicName: "إشراف الوالدين",
        },
        {
          id: 3,
          code: "PG-13",
          name: "Parents Strongly Cautioned",
          arabicName: "تحذير شديد للوالدين",
        },
        { id: 4, code: "R", name: "Restricted", arabicName: "مقيد" },
      ]);
    }
  };

  // دالة جلب فئات الأفلام (Categories) من API
  const fetchMovieTypes = async () => {
    try {
      const response = await movieTypeService.getAllMovieTypes({
        PageIndex: 0,
        PageSize: 100,
      });

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        // تحويل البيانات إلى التنسيق المطلوب
        const typesList = response.data.data.map((type) => ({
          id: type.id,
          title: type.englishName, // استخدام title بدلاً من name ليتوافق مع التنسيق الحالي
          arabicName: type.arabicName,
        }));

        console.log("Categories loaded from API:", typesList);
        setCategories(typesList);
      } else {
        console.warn("Unexpected movie type data format:", response.data);
        // استخدام قائمة فئات افتراضية في حالة عدم وجود بيانات
        setCategories([
          { id: 1, title: "Action", arabicName: "أكشن" },
          { id: 2, title: "Comedy", arabicName: "كوميديا" },
          { id: 3, title: "Drama", arabicName: "دراما" },
          { id: 4, title: "Horror", arabicName: "رعب" },
          { id: 5, title: "Sci-Fi", arabicName: "خيال علمي" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // استخدام قائمة فئات افتراضية في حالة حدوث خطأ
      setCategories([
        { id: 1, title: "Action", arabicName: "أكشن" },
        { id: 2, title: "Comedy", arabicName: "كوميديا" },
        { id: 3, title: "Drama", arabicName: "دراما" },
        { id: 4, title: "Horror", arabicName: "رعب" },
        { id: 5, title: "Sci-Fi", arabicName: "خيال علمي" },
      ]);
    }
  };

  // حالة الشاشة المنبثقة المؤقتة
  const [tempModal, setTempModal] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // حالة طاقم التمثيل - فقط المضافين لهذا الفيلم
  const [movieCastMembers, setMovieCastMembers] = useState([]); // الممثلين المضافين لهذا الفيلم

  // استخدام هوك معالجة أخطاء المصادقة للطاقم
  const {
    loading: isLoading,
    setLoading: setIsLoading,
    error,
    setError,
  } = useAuthErrorHandler("Failed to load cast members. Please try again.");

  // استدعاء دوال جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchLanguages();
    fetchMovieClassifications();
    fetchMovieTypes(); // هذه الدالة الآن تقوم بجلب الفئات (Categories)
  }, []);

  // لا نحتاج لجلب كل الممثلين - فقط نعرض المضافين لهذا الفيلم

  // جلب القاعات عند تحميل الصفحة
  useEffect(() => {
    fetchHalls();
  }, []);

  // تحديث القاعات المفلترة عند تغيير القاعات أو نوع القاعة
  useEffect(() => {
    if (selectedHallType === "") {
      setFilteredHalls(halls);
    } else {
      setFilteredHalls(halls.filter((hall) => hall.type === selectedHallType));
    }
  }, [halls, selectedHallType]);

  // تحديث القاعات المختارة عند تغيير اللغات الأساسية
  useEffect(() => {
    if (selectedHalls.length > 0) {
      setSelectedHalls((prevHalls) =>
        prevHalls.map((hall) => {
          // إذا كانت اللغة المختارة للقاعة لم تعد موجودة في القائمة الأساسية، قم بإعادة تعيينها
          const isLanguageStillSelected = selectedLanguages.includes(
            hall.selectedLanguage
          );
          const isSubtitleLanguageStillSelected = selectedTranslations.includes(
            hall.selectedSubtitleLanguage
          );

          return {
            ...hall,
            selectedLanguage: isLanguageStillSelected
              ? hall.selectedLanguage
              : selectedLanguages.length > 0
              ? selectedLanguages[0]
              : null,
            selectedSubtitleLanguage: isSubtitleLanguageStillSelected
              ? hall.selectedSubtitleLanguage
              : selectedTranslations.length > 0
              ? selectedTranslations[0]
              : null,
          };
        })
      );
    }
  }, [selectedLanguages, selectedTranslations, selectedHalls.length]);

  // لا نحتاج لجلب كل الممثلين من API - فقط نعرض المضافين لهذا الفيلم

  // تم نقل دالة handleCategoryChange إلى الأعلى للتعامل مع الاختيار المتعدد

  const openAddModal = () => {
    // الانتقال إلى منتصف الصفحة لرؤية المودال بوضوح
    window.scrollTo({
      top: window.innerHeight / 1.2,
      behavior: "smooth",
    });

    // فتح المودال بعد delay قصير للسماح للـ scroll بالانتهاء
    setTimeout(() => {
      setIsAddModalOpen(true);
    }, 300);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (cast) => {
    // الانتقال إلى منتصف الصفحة لرؤية المودال بوضوح
    window.scrollTo({
      top: window.innerHeight / 1.2,
      behavior: "smooth",
    });

    // فتح المودال بعد delay قصير للسماح للـ scroll بالانتهاء
    setTimeout(() => {
      setSelectedCast(cast);
      setIsEditModalOpen(true);
    }, 300);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCast(null);
  };

  // دوال التعامل مع مودال التأكيد على الحذف
  const openDeleteModal = (cast) => {
    setCastToDelete(cast);
    setIsDeleteModalOpen(true);
  };

  // دوال التعامل مع رفع الصور
  const handleImageWithoutTitleUpload = (file) => {
    if (file) {
      setImageWithoutTitleLoading(true);
      setImageWithoutTitle(file);
      // إزالة رسالة الخطأ عند رفع صورة جديدة
      if (errors.imageWithoutTitle) {
        setErrors((prev) => ({ ...prev, imageWithoutTitle: "" }));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageWithoutTitlePreview(e.target.result);
        setImageWithoutTitleLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageWithTitleUpload = (file) => {
    if (file) {
      setImageWithTitleLoading(true);
      setImageWithTitle(file);
      // إزالة رسالة الخطأ عند رفع صورة جديدة
      if (errors.imageWithTitle) {
        setErrors((prev) => ({ ...prev, imageWithTitle: "" }));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageWithTitlePreview(e.target.result);
        setImageWithTitleLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // دالة رفع الصورة إلى الخادم
  const uploadImageToServer = async (imageFile, title = "") => {
    if (!imageFile) {
      console.warn("⚠️ No image file provided to uploadImageToServer");
      return null;
    }

    try {
      console.log("📤 Preparing image upload:", {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
        title: title,
      });

      const imageFormData = new FormData();
      imageFormData.append("Image", imageFile);
      imageFormData.append("Title", title);
      imageFormData.append("Url", "");

      console.log("🚀 Uploading image to server...");
      const response = await executeApiCall(
        async () => await imageService.uploadImage(imageFormData)
      );

      console.log("📥 Image upload response:", response);

      if (response?.data?.success && response.data?.data?.id) {
        console.log(
          "✅ Image uploaded successfully, ID:",
          response.data.data.id
        );
        return response.data.data.id;
      } else {
        console.error("❌ Invalid image upload response:", response);
        console.error("Response structure:", {
          hasData: !!response?.data,
          hasSuccess: !!response?.data?.success,
          hasDataData: !!response?.data?.data,
          hasId: !!response?.data?.data?.id,
        });
        return null;
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  // دوال إدارة القاعات
  const fetchHalls = async () => {
    console.log("Fetching halls for movie selection...");

    const response = await executeApiCall(
      async () => await hallService.getAllHalls(),
      (response) => {
        console.log("Halls API response:", response);

        // معالجة البيانات بعد نجاح الطلب
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
            // تحويل إلى الصيغة المطلوبة لقسم إدارة القاعات
            return {
              id: transformed.id,
              name: transformed.name || transformed.hallNumber,
              type: transformed.hallType, // VIP أو Standard
              capacity: transformed.totalseats,
            };
          })
          .filter((hall) => hall !== null); // تجاهل أي قاعات لم يتم تحويلها بنجاح

        console.log(
          "Final transformed halls for movie selection:",
          transformedHalls
        );
        setHalls(transformedHalls);
      }
    );

    // إذا كانت الاستجابة null، فهذا يعني أن هناك خطأ تم معالجته بالفعل
    if (!response) {
      console.log(
        "Error was handled by the auth error handler, using fallback data"
      );
      // في حالة الخطأ، استخدام بيانات وهمية كبديل
      const fallbackHalls = [
        { id: 1, name: "Hall A1", type: "Standard", capacity: 100 },
        { id: 2, name: "Hall A2", type: "Standard", capacity: 120 },
        { id: 3, name: "Hall B1", type: "VIP", capacity: 50 },
        { id: 4, name: "Hall B2", type: "VIP", capacity: 60 },
        { id: 5, name: "Hall C1", type: "Standard", capacity: 150 },
        { id: 6, name: "Hall C2", type: "VIP", capacity: 80 },
      ];
      setHalls(fallbackHalls);
    }
  };

  const handleHallTypeChange = (type) => {
    setSelectedHallType(type);
    if (type === "") {
      setFilteredHalls(halls);
    } else {
      setFilteredHalls(halls.filter((hall) => hall.type === type));
    }
  };

  const handleHallSelection = (hall) => {
    const existingHall = selectedHalls.find((h) => h.id === hall.id);
    if (existingHall) {
      // إزالة القاعة إذا كانت محددة مسبقاً
      setSelectedHalls(selectedHalls.filter((h) => h.id !== hall.id));
    } else {
      // إضافة القاعة مع الإعدادات الافتراضية
      setSelectedHalls([
        ...selectedHalls,
        {
          ...hall,
          is3D: false, // افتراضي 2D
          showTime: "19:00", // وقت افتراضي
          dateRange: `${fromDate} - ${toDate}`,
          selectedLanguage:
            selectedLanguages.length > 0 ? selectedLanguages[0] : null, // أول لغة مختارة كافتراضي
          selectedSubtitleLanguage:
            selectedTranslations.length > 0 ? selectedTranslations[0] : null, // أول لغة ترجمة مختارة كافتراضي
        },
      ]);
      // إزالة رسالة الخطأ عند اختيار قاعة
      if (errors.selectedHalls) {
        setErrors((prev) => ({ ...prev, selectedHalls: "" }));
      }
    }
  };

  // تحديث إعدادات قاعة محددة
  const updateHallSettings = (hallId, settings) => {
    setSelectedHalls((prev) =>
      prev.map((hall) => (hall.id === hallId ? { ...hall, ...settings } : hall))
    );
  };

  const confirmHallsSelection = () => {
    if (selectedHalls.length === 0) {
      alert("Please select at least one hall");
      return;
    }
    if (!fromDate || !toDate) {
      alert("Please select date range first");
      return;
    }
    setShowHallsSection(true);
  };

  // دالة التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الحقول المطلوبة
    if (!movieTitle.trim()) {
      newErrors.movieTitle = "Movie Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Movie Description is required";
    } else if (description.length < 3 || description.length > 2000) {
      newErrors.description =
        "Description must be between 3 and 2000 characters";
    }
    if (!trailerUrl.trim()) {
      newErrors.trailerUrl = "Trailer URL is required";
    } else {
      // تحقق من جميع صيغ روابط اليوتيوب
      const youtubeRegex = /^(https?:\/\/(www\.|m\.|music\.|)youtube\.com\/(watch\?v=|embed\/|shorts\/|v\/)[\w-]{11}(&.*)?$|^https?:\/\/(www\.|)youtu\.be\/[\w-]{11}(&.*)?$)/i;
      if (!youtubeRegex.test(trailerUrl.trim())) {
        newErrors.trailerUrl = "Trailer URL must be a valid YouTube link";
      }
    }
    if (!durationInMinutes || durationInMinutes === 0) {
      newErrors.durationInMinutes = "Duration is required";
    } else if (durationInMinutes < 45 || durationInMinutes > 240) {
      newErrors.durationInMinutes =
        "Duration must be between 45 and 240 minutes";
    }
    if (!rate || rate === 0) {
      newErrors.rate = "Movie rating is required";
    } else if (rate < 0 || rate > 5) {
      newErrors.rate = "Rating must be between 0 and 5";
    }
    if (!releaseYear) {
      newErrors.releaseYear = "Year of Release is required";
    } else if (releaseYear < 1900 || releaseYear > 2100) {
      newErrors.releaseYear = "Year must be between 1900 and 2100";
    }
    if (!status) {
      newErrors.status = "Status is required";
    }
    if (!fromDate) {
      newErrors.fromDate = "From Date is required";
    }
    if (!toDate) {
      newErrors.toDate = "To Date is required";
    }
    if (selectedLanguages.length === 0) {
      newErrors.selectedLanguages = "At least one language must be selected";
    }
    if (selectedTranslations.length === 0) {
      newErrors.selectedTranslations =
        "At least one Subtitle language must be selected";
    }
    if (selectedCategories.length === 0) {
      newErrors.selectedCategories = "At least one category must be selected";
    }
    if (!selectedClassification || selectedClassification === 0) {
      newErrors.selectedClassification =
        "Movie classification must be selected";
    }
    if (!imageWithoutTitle) {
      newErrors.imageWithoutTitle = "Primary image is required";
    }
    if (!imageWithTitle) {
      newErrors.imageWithTitle = "Secondary image is required";
    }
    if (selectedHalls.length === 0) {
      newErrors.selectedHalls = "At least one cinema hall must be selected";
    } else {
      // التحقق من أن كل قاعة لديها لغة ولغة ترجمة مختارة
      const hallsWithMissingLanguages = selectedHalls.filter(
        (hall) => !hall.selectedLanguage || !hall.selectedSubtitleLanguage
      );
      if (hallsWithMissingLanguages.length > 0) {
        newErrors.selectedHalls = `Please select language and subtitle language for all halls`;
      }
    }

    // التحقق من وجود مخرج
    const hasDirector = movieCastMembers.some(
      (cast) => cast.castType === "Director"
    );
    if (!hasDirector) {
      newErrors.director =
        "A director is required. Please add at least one director to the cast.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دالة للانتقال إلى الحقل الذي يحتوي على خطأ
  const scrollToError = (fieldName) => {
    const element =
      document.querySelector(`[name="${fieldName}"]`) ||
      document.querySelector(`#${fieldName}`) ||
      document.querySelector(`.${fieldName}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCastToDelete(null);
  };

  // دالة عرض الشاشة المنبثقة المؤقتة
  const showTempModal = (message, type = "success") => {
    setTempModal({
      show: true,
      message,
      type,
    });

    // إخفاء الشاشة المنبثقة بعد ثانيتين
    setTimeout(() => {
      setTempModal((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2000);
  };

  // دالة إضافة ممثل جديد للفيلم
  const handleAddCast = (newCast) => {
    setMovieCastMembers((prev) => [newCast, ...prev]);

    // إزالة رسالة خطأ المخرج إذا تم إضافة مخرج
    if (newCast.castType === "Director" && errors.director) {
      setErrors((prev) => ({ ...prev, director: "" }));
    }

    // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight / 1.2,
        behavior: "smooth",
      });
    }, 100);

    // عرض رسالة نجاح
    showTempModal("Cast added successfully!", "success");
  };

  // دالة تحديث ممثل في الفيلم
  const handleUpdateCast = (updatedCast) => {
    console.log("Updating cast in UI:", updatedCast);

    // تحديث قائمة الممثلين مع الحفاظ على معلومات الصورة
    setMovieCastMembers((prev) =>
      prev.map((cast) => {
        if (cast.id === updatedCast.id) {
          // الاحتفاظ بمعلومات الصورة الأصلية إذا لم يتم تحديثها
          const imageUrl = updatedCast.imageUrl || cast.imageUrl;

          console.log(
            `Updated cast ${updatedCast.id} (${updatedCast.name}): imageUrl=${imageUrl}`
          );

          return {
            ...cast,
            ...updatedCast,
            imageUrl: imageUrl,
          };
        }
        return cast;
      })
    );

    // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight / 1.2,
        behavior: "smooth",
      });
    }, 100);

    // عرض رسالة نجاح
    showTempModal("Cast updated successfully", "success");
  };

  // دالة حذف ممثل
  const handleDeleteCast = async (castId) => {
    try {
      setIsLoading(true);

      // حذف الممثل من الخادم باستخدام خدمة castService
      const deleteResponse = await castService.deleteCast(castId);

      console.log("Delete cast response:", deleteResponse.data);

      // محاولة حذف الصورة المرتبطة (إذا وجدت) باستخدام خدمة imageService
      try {
        await imageService.deleteImage(castId);
        console.log("Image deleted successfully");
      } catch (imageError) {
        console.log(
          "Note: Could not delete image or no image exists:",
          imageError
        );
        // لا نريد إيقاف العملية بسبب فشل حذف الصورة
      }

      // تحديث واجهة المستخدم
      setMovieCastMembers((prev) => prev.filter((cast) => cast.id !== castId));

      // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight / 1.2,
          behavior: "smooth",
        });
      }, 100);

      // عرض رسالة نجاح
      showTempModal("Cast deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting cast:", err);

      // عرض رسالة خطأ أكثر تفصيلاً
      let errorMessage = "Failed to delete cast. Please try again.";

      if (err.response) {
        errorMessage = `Server error (${err.response.status}): ${
          err.response.data?.message || err.response.statusText
        }`;
      } else if (err.request) {
        errorMessage = "Network error: Could not connect to the server.";
      }

      console.error("Final error message:", errorMessage);

      // الانتقال إلى منتصف الصفحة لرؤية رسالة الخطأ
      window.scrollTo({
        top: window.innerHeight / 1.2,
        behavior: "smooth",
      });

      setError(errorMessage);
      showTempModal(errorMessage, "error");

      // إظهار alert إضافي للتأكد من رؤية الخطأ
      alert(`Movie Creation Failed:\n${errorMessage}`);
    } finally {
      setIsLoading(false);
      closeDeleteModal();
    }
  };

  // دالة فتح مودال التأكيد على الحذف
  const confirmDeleteCast = (cast) => {
    // الانتقال إلى منتصف الصفحة لرؤية المودال بوضوح
    window.scrollTo({
      top: window.innerHeight / 1.2,
      behavior: "smooth",
    });

    // فتح المودال بعد delay قصير للسماح للـ scroll بالانتهاء
    setTimeout(() => {
      setCastToDelete(cast);
      setIsDeleteModalOpen(true);
    }, 300);
  };

  // لا نحتاج لدوال التصفح والبحث - فقط نعرض الممثلين المضافين للفيلم

  // دالة نشر الفيلم
  const handlePublishMovie = async () => {
    // التحقق من صحة البيانات
    if (!validateForm()) {
      // العثور على أول خطأ والانتقال إليه
      const errorKeys = Object.keys(errors);
      const firstErrorField = errorKeys.length > 0 ? errorKeys[0] : null;
      if (firstErrorField) {
        scrollToError(firstErrorField);
      } else {
        // إذا لم توجد أخطاء مخزنة، أعد التحقق وأظهر أول حقل خطأ
        setTimeout(() => {
          const newErrorKeys = Object.keys(errors);
          if (newErrorKeys.length > 0) {
            scrollToError(newErrorKeys[0]);
          }
        }, 100);
      }
      return;
    }

    try {
      setIsLoading(true);

      // رفع الصور أولاً
      let imageID = 0;
      let secondaryImageID = 0;

      console.log("🖼️ Uploading images...");
      console.log("📊 Image states:", {
        hasImageWithoutTitle: !!imageWithoutTitle,
        hasImageWithTitle: !!imageWithTitle,
        imageWithoutTitleName: imageWithoutTitle?.name,
        imageWithTitleName: imageWithTitle?.name,
      });

      // رفع الصورة الأساسية (بدون عنوان)
      if (imageWithoutTitle) {
        console.log("📤 Uploading primary image...");
        try {
          imageID = await uploadImageToServer(
            imageWithoutTitle,
            `${movieTitle} - Primary`
          );
          if (!imageID) {
            throw new Error("Failed to upload primary image - no ID returned");
          }
          console.log("✅ Primary image uploaded with ID:", imageID);
        } catch (imageError) {
          console.error("❌ Primary image upload failed:", imageError);
          throw new Error(`Primary image upload failed: ${imageError.message}`);
        }
      } else {
        console.warn("⚠️ No primary image selected");
      }

      // رفع الصورة الثانوية (مع عنوان)
      if (imageWithTitle) {
        console.log("📤 Uploading secondary image...");
        console.log("📋 Secondary image details:", {
          name: imageWithTitle.name,
          size: imageWithTitle.size,
          type: imageWithTitle.type,
        });
        try {
          secondaryImageID = await uploadImageToServer(
            imageWithTitle,
            `${movieTitle} - Secondary`
          );
          if (!secondaryImageID) {
            throw new Error(
              "Failed to upload secondary image - no ID returned"
            );
          }
          console.log("✅ Secondary image uploaded with ID:", secondaryImageID);
        } catch (imageError) {
          console.error("❌ Secondary image upload failed:", imageError);
          throw new Error(
            `Secondary image upload failed: ${imageError.message}`
          );
        }
      } else {
        console.warn("⚠️ No secondary image selected");
      }

      // البحث عن مخرج في قائمة الممثلين المضافين
      const director = movieCastMembers.find(
        (cast) => cast.castType === "Director"
      );
      const directorId = director ? director.id : 0;

      // إعداد بيانات الفيلم للإرسال إلى API
      const movieData = {
        name: movieTitle,
        year: parseInt(releaseYear),
        imageID: imageID, // معرف الصورة الأساسية المرفوعة
        secondaryImageID: secondaryImageID, // معرف الصورة الثانوية المرفوعة
        trailerUrl: trailerUrl,
        directorId: directorId,
        description: description,
        movieClassificationId: selectedClassification || 0,
        status: status, // استخدام القيمة المحددة من المستخدم
        fromDate: fromDate || "2025-01-01", // تنسيق التاريخ البسيط
        toDate: toDate || "2025-12-31", // تنسيق التاريخ البسيط
        rate: parseFloat(rate),
        durationInMinutes: parseInt(durationInMinutes) || 120, // قيمة افتراضية 120 دقيقة
        movieSubtitleIds: selectedTranslations,
        movieLanguageIds: selectedLanguages,
        movieTypeIds: selectedCategories,
        movieCastIds: movieCastMembers.map((cast) => cast.id),
        movieTimes: selectedHalls.map((hall) => ({
          time: hall.showTime || "19:00", // تنسيق الوقت كـ string
          hallId: hall.id,
          is3d: hall.is3D || false,
          languageId: hall.selectedLanguage || null, // اللغة المختارة للقاعة
          subtitleId: hall.selectedSubtitleLanguage || null, // لغة الترجمة المختارة للقاعة (subtitleId وليس subtitleLanguageId)
        })),
      };

      console.log("📤 Publishing movie with data:", movieData);
      console.log("📤 Movie data JSON:", JSON.stringify(movieData, null, 2));
      console.log("🖼️ Image IDs being sent:", {
        imageID: imageID,
        secondaryImageID: secondaryImageID,
        imageIDType: typeof imageID,
        secondaryImageIDType: typeof secondaryImageID,
      });

      // إرسال بيانات الفيلم إلى API
      console.log("🚀 Calling movieService.createMovie...");
      const response = await movieService.createMovie(movieData);
      console.log("📥 Received response from API:", response);
      console.log("🎬 Created movie details:", response.data?.data);
      console.log("🖼️ Image details in response:", {
        primaryImage: response.data?.data?.image,
        secondaryImage: response.data?.data?.secondaryImage,
        director: response.data?.data?.director,
        directorImage: response.data?.data?.director?.image,
      });

      console.log("Movie creation response:", response);
      console.log("Full API response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      // طباعة تفاصيل أخطاء التحقق إذا كانت موجودة
      if (response.data && response.data.errors) {
        console.log("=== VALIDATION ERRORS ===");
        console.log("Validation errors:", response.data.errors);
        Object.keys(response.data.errors).forEach((field) => {
          console.log(`❌ ${field}:`, response.data.errors[field]);
        });
        console.log("=== END VALIDATION ERRORS ===");
      }

      // التحقق من نجاح العملية
      if (response.status === 200 || response.status === 201) {
        console.log("✅ Movie created successfully!");

        // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
        window.scrollTo({
          top: window.innerHeight / 1.5,
          behavior: "smooth",
        });

        // عرض رسالة نجاح
        showTempModal("Movie created successfully!", "success");

        // إعادة تعيين النموذج بعد النجاح
        setTimeout(() => {
          // يمكن إعادة توجيه المستخدم أو إعادة تعيين النموذج
          window.location.reload();
        }, 2000);
      } else {
        console.error("❌ Movie creation failed with status:", response.status);
        console.error("Response data:", response.data);

        // معالجة أخطاء التحقق من صحة البيانات
        if (response.data && response.data.errors) {
          const validationErrors = response.data.errors;
          let errorMessage = "Validation errors:\n";
          Object.keys(validationErrors).forEach((field) => {
            errorMessage += `• ${field}: ${validationErrors[field].join(
              ", "
            )}\n`;
          });
          throw new Error(errorMessage);
        }

        throw new Error(
          response.data?.message ||
            `Failed to create movie (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("❌ ERROR CREATING MOVIE:", error);

      // عرض رسالة خطأ مفصلة
      let errorMessage = "Failed to create movie. Please try again.";

      if (error.response) {
        console.error("Server response error:", error.response);
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);

        // معالجة أخطاء التحقق من صحة البيانات
        if (error.response.data && error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          errorMessage = "Validation errors:\n";
          Object.keys(validationErrors).forEach((field) => {
            errorMessage += `• ${field}: ${validationErrors[field].join(
              ", "
            )}\n`;
          });
        } else {
          errorMessage = `Server error (${error.response.status}): ${
            error.response.data?.message || error.response.statusText
          }`;
        }
      } else if (error.request) {
        console.error("Network error - no response received:", error.request);
        errorMessage =
          "Network error: Could not connect to the server. Please check your internet connection.";
      } else if (error.message) {
        console.error("Error message:", error.message);
        errorMessage = error.message;
      } else {
        console.error("Unknown error:", error);
        errorMessage = "An unknown error occurred. Please try again.";
      }

      console.error("Final error message:", errorMessage);

      // الانتقال إلى منتصف الصفحة لرؤية رسالة الخطأ
      window.scrollTo({
        top: window.innerHeight / 1.5,
        behavior: "smooth",
      });

      setError(errorMessage);
      showTempModal(errorMessage, "error");

      // إظهار alert إضافي للتأكد من رؤية الخطأ
      alert(`Movie Creation Failed:\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Create Movie</h2>
        {/* الحقول الأربعة الأولى في صفين متساويين */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="movieTitle"
              className="text-border font-medium text-sm"
            >
              Movie Title
            </label>
            <input
              id="movieTitle"
              name="movieTitle"
              type="text"
              value={movieTitle}
              onChange={(e) => {
                setMovieTitle(e.target.value);
                if (errors.movieTitle) {
                  setErrors((prev) => ({ ...prev, movieTitle: "" }));
                }
              }}
              placeholder="Game of Thrones"
              className={`w-full bg-main border text-white rounded-2xl p-4 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                errors.movieTitle ? "border-red-500" : "border-border"
              }`}
            />
            {errors.movieTitle && (
              <p className="text-red-500 text-xs mt-1">{errors.movieTitle}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="duration"
              className="text-border font-medium text-sm"
            >
              Duration (Minutes)
            </label>
            <input
              id="duration"
              name="durationInMinutes"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={durationInMinutes === 0 ? "" : durationInMinutes}
              onChange={(e) => {
                // السماح فقط بالأرقام الإنجليزية
                const value = e.target.value.replace(/[^\d]/g, "");
                const numValue = value === "" ? 0 : Number(value);
                // تطبيق الحد الأقصى فقط أثناء الكتابة (الحد الأدنى يتم التحقق منه عند الإرسال)
                if (numValue <= 240) {
                  setDurationInMinutes(numValue);
                }
                if (errors.durationInMinutes) {
                  setErrors((prev) => ({ ...prev, durationInMinutes: "" }));
                }
              }}
              onWheel={(e) => e.target.blur()} // منع تغيير القيمة بالسكرول
              placeholder="(45-240 Minutes)"
              className={`w-full bg-main border text-white rounded-2xl p-4 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                errors.durationInMinutes ? "border-red-500" : "border-border"
              }`}
              style={{
                direction: "ltr",
                fontFamily: "Arial, sans-serif", // استخدام خط إنجليزي
                fontFeatureSettings: "'lnum' 1", // استخدام الأرقام الإنجليزية
              }}
            />
            {errors.durationInMinutes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.durationInMinutes}
              </p>
            )}
          </div>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="rating" className="text-border font-medium text-sm">
              Movie Rating
            </label>
            <input
              id="rating"
              name="rate"
              type="text"
              value={rate === 0 ? "" : rate}
              onChange={(e) => {
                const value = e.target.value;
                // السماح بالأرقام والنقطة العشرية فقط
                if (
                  value === "" ||
                  /^[0-5](\.[0-9]*)?$/.test(value) ||
                  /^\.[0-9]*$/.test(value)
                ) {
                  // التحقق من أن القيمة لا تتجاوز 5
                  const numValue = parseFloat(value);
                  if (
                    value === "" ||
                    isNaN(numValue) ||
                    (numValue >= 0 && numValue <= 5)
                  ) {
                    setRate(value === "" ? 0 : value);
                    if (errors.rate) {
                      setErrors((prev) => ({ ...prev, rate: "" }));
                    }
                  }
                }
              }}
              maxLength="4"
              placeholder="1-5"
              className={`w-full bg-main border text-white rounded-2xl p-4 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                errors.rate ? "border-red-500" : "border-border"
              }`}
              style={{ direction: "ltr", textAlign: "center" }}
            />
            {errors.rate && (
              <p className="text-red-500 text-xs mt-1">{errors.rate}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="trailerUrl"
              className="text-border font-medium text-sm"
            >
              Trailer URL
              <span className="text-xs text-gray-400 ml-2">(YouTube only)</span>
            </label>
            <input
              id="trailerUrl"
              name="trailerUrl"
              type="url"
              value={trailerUrl}
              onChange={(e) => {
                setTrailerUrl(e.target.value);
                if (errors.trailerUrl) {
                  setErrors((prev) => ({ ...prev, trailerUrl: "" }));
                }
              }}
              placeholder="https://youtube.com/watch?v=..."
              className={`w-full bg-main border text-white rounded-2xl p-4 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                errors.trailerUrl ? "border-red-500" : "border-border"
              }`}
            />
            {errors.trailerUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.trailerUrl}</p>
            )}
          </div>
        </div>
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <MultiSelect
              label="Languages Used"
              options={languages}
              selectedValues={selectedLanguages}
              onChange={(values) => {
                setSelectedLanguages(values);
                if (errors.selectedLanguages) {
                  setErrors((prev) => ({ ...prev, selectedLanguages: "" }));
                }
              }}
              placeholder="Select languages used in the movie"
            />
            {errors.selectedLanguages && (
              <p className="text-red-500 text-xs mt-1">
                {errors.selectedLanguages}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <MultiSelect
              label="Subtitle Languages"
              options={languages}
              selectedValues={selectedTranslations}
              onChange={(values) => {
                setSelectedTranslations(values);
                if (errors.selectedTranslations) {
                  setErrors((prev) => ({ ...prev, selectedTranslations: "" }));
                }
              }}
              placeholder="Select Subtitle Languages"
            />
            {errors.selectedTranslations && (
              <p className="text-red-500 text-xs mt-1">
                {errors.selectedTranslations}
              </p>
            )}
          </div>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <MultiSelect
              label="Movie Types"
              options={categories}
              selectedValues={selectedCategories}
              onChange={(values) => {
                setSelectedCategories(values);
                if (errors.selectedCategories) {
                  setErrors((prev) => ({ ...prev, selectedCategories: "" }));
                }
              }}
              placeholder="Select Movie Types"
            />
            {errors.selectedCategories && (
              <p className="text-red-500 text-xs mt-1">
                {errors.selectedCategories}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-border font-medium text-sm">
              Movie Classification
            </label>
            <select
              value={selectedClassification}
              onChange={(e) => {
                setSelectedClassification(parseInt(e.target.value));
                if (errors.selectedClassification) {
                  setErrors((prev) => ({
                    ...prev,
                    selectedClassification: "",
                  }));
                }
              }}
              className={`w-full bg-main border text-gray-400 rounded-2xl p-4 font-semibold text-sm transition-colors duration-300 hover:bg-dry hover:text-white focus:bg-dry focus:text-white focus:outline-none ${
                errors.selectedClassification
                  ? "border-red-500"
                  : "border-border"
              }`}
            >
              <option value={0}>Select movie classification</option>
              {movieClassifications.map((classification) => (
                <option key={classification.id} value={classification.id}>
                  {classification.name} ({classification.code})
                </option>
              ))}
            </select>
            {errors.selectedClassification && (
              <p className="text-red-500 text-xs mt-1">
                {errors.selectedClassification}
              </p>
            )}
          </div>
        </div>

        {/* حقول التواريخ */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(value) => {
                setFromDate(value);
                // إذا كان تاريخ النهاية أقل من تاريخ البداية الجديد، قم بمسحه
                if (toDate && value) {
                  const fromDateObj = new Date(
                    value.split("/").reverse().join("-")
                  );
                  const toDateObj = new Date(
                    toDate.split("/").reverse().join("-")
                  );
                  if (toDateObj < fromDateObj) {
                    setToDate("");
                  }
                }
                if (errors.fromDate) {
                  setErrors((prev) => ({ ...prev, fromDate: "" }));
                }
              }}
              placeholder="DD/MM/YYYY"
            />
            {errors.fromDate && (
              <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(value) => {
                setToDate(value);
                if (errors.toDate) {
                  setErrors((prev) => ({ ...prev, toDate: "" }));
                }
              }}
              placeholder="DD/MM/YYYY"
              minDate={fromDate} // تاريخ البداية كحد أدنى
            />
            {errors.toDate && (
              <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>
            )}
          </div>
        </div>

        {/* قسم إدارة القاعات */}
        <div className="w-full bg-main border border-border rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-beige3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Cinema Halls Management
          </h3>

          {/* اختيار نوع القاعة */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* نوع القاعة */}
            <div className="flex flex-col gap-2">
              <label className="text-border font-medium text-sm">
                Hall Type Filter
              </label>
              <select
                value={selectedHallType}
                onChange={(e) => handleHallTypeChange(e.target.value)}
                className="w-full bg-dry border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-main focus:bg-main focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            {/* زر التأكيد */}
            <div className="flex flex-col gap-2">
              <label className="text-border font-medium text-sm">Action</label>
              <button
                type="button"
                onClick={confirmHallsSelection}
                className="w-full bg-beige3 text-white rounded-xl p-3 font-medium text-sm transition-all duration-300 hover:bg-opacity-80 hover:scale-95"
              >
                Confirm Selection
              </button>
            </div>
          </div>

          {/* عرض القاعات المتاحة */}
          {filteredHalls.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Available Halls</h4>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredHalls.map((hall) => {
                  const isSelected = selectedHalls.some(
                    (h) => h.id === hall.id
                  );
                  return (
                    <button
                      key={hall.id}
                      type="button"
                      onClick={() => handleHallSelection(hall)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-beige3 bg-beige3 bg-opacity-20 text-white"
                          : "border-border bg-dry text-gray-400 hover:border-beige3 hover:text-white"
                      }`}
                    >
                      <div className="text-center">
                        <h5 className="font-bold text-sm">{hall.name}</h5>
                        <p className="text-xs opacity-75">{hall.type}</p>
                        <p className="text-xs opacity-75">
                          {hall.capacity} seats
                        </p>
                        {isSelected && (
                          <div className="mt-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-beige3 text-white">
                              Selected
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* عرض القاعات المختارة */}
          {showHallsSection && selectedHalls.length > 0 && (
            <div className="border-t border-border pt-6">
              <div className="mb-4 p-4 bg-dry rounded-xl">
                <h4 className="text-white font-semibold mb-2">
                  Selected Date Range
                </h4>
                <p className="text-beige3 font-medium">
                  {fromDate} - {toDate}
                </p>
              </div>

              <h4 className="text-white font-semibold mb-3">Selected Halls</h4>
              <div className="space-y-4">
                {selectedHalls.map((hall) => (
                  <div
                    key={hall.id}
                    className="p-6 bg-dry border border-beige3 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-white font-bold text-lg">
                          {hall.name}
                        </h5>
                        <div className="flex gap-4 text-sm text-gray-300 mt-1">
                          <span>
                            Type:{" "}
                            <span className="text-beige3">{hall.type}</span>
                          </span>
                          <span>
                            Capacity:{" "}
                            <span className="text-beige3">
                              {hall.capacity} seats
                            </span>
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedHalls(
                            selectedHalls.filter((h) => h.id !== hall.id)
                          )
                        }
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* إعدادات القاعة */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* نوع الشاشة 3D/2D */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">
                          Screen Type
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-main border border-border rounded-xl">
                          <span
                            className={`text-sm font-medium ${
                              !hall.is3D ? "text-white" : "text-gray-400"
                            }`}
                          >
                            2D
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateHallSettings(hall.id, { is3D: !hall.is3D })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              hall.is3D ? "bg-beige3" : "bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                hall.is3D ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-sm font-medium ${
                              hall.is3D ? "text-white" : "text-gray-400"
                            }`}
                          >
                            3D
                          </span>
                        </div>
                      </div>

                      {/* وقت بداية العرض */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">
                          Show Time
                        </label>
                        <input
                          type="time"
                          value={hall.showTime}
                          onChange={(e) =>
                            updateHallSettings(hall.id, {
                              showTime: e.target.value,
                            })
                          }
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                          style={{ direction: "ltr" }}
                        />
                      </div>

                      {/* لغة الفيلم المختارة للقاعة */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">
                          Language Used
                        </label>
                        <select
                          value={hall.selectedLanguage || ""}
                          onChange={(e) =>
                            updateHallSettings(hall.id, {
                              selectedLanguage:
                                parseInt(e.target.value) || null,
                            })
                          }
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
                        >
                          <option value="">Select Language</option>
                          {languages
                            .filter((lang) =>
                              selectedLanguages.includes(lang.id)
                            )
                            .map((language) => (
                              <option key={language.id} value={language.id}>
                                {language.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* لغة الترجمة المختارة للقاعة */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">
                          Subtitle Language
                        </label>
                        <select
                          value={hall.selectedSubtitleLanguage || ""}
                          onChange={(e) =>
                            updateHallSettings(hall.id, {
                              selectedSubtitleLanguage:
                                parseInt(e.target.value) || null,
                            })
                          }
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
                        >
                          <option value="">Select Subtitle Language</option>
                          {languages
                            .filter((lang) =>
                              selectedTranslations.includes(lang.id)
                            )
                            .map((language) => (
                              <option key={language.id} value={language.id}>
                                {language.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors.selectedHalls && (
            <p className="text-red-500 text-xs mt-1">{errors.selectedHalls}</p>
          )}
        </div>

        {/* حقل سنة الإصدار وحالة الفيلم */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-border font-medium text-sm">
              Year of Release
            </label>
            <div className="relative">
              <input
                id="year"
                type="text"
                value={releaseYear || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // السماح فقط بالأرقام وطول 4 خانات كحد أقصى
                  if (value === "") {
                    setReleaseYear("");
                  } else if (/^\d{1,4}$/.test(value)) {
                    const numValue = Number(value);
                    if (numValue >= 1920 && numValue <= 2200) {
                      setReleaseYear(numValue);
                      if (errors.releaseYear) {
                        setErrors((prev) => ({ ...prev, releaseYear: "" }));
                      }
                    }
                  }
                }}
                maxLength="4"
                placeholder={new Date().getFullYear().toString()}
                className={`w-full bg-main border text-white rounded-2xl p-4 pr-12 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                  errors.releaseYear ? "border-red-500" : "border-border"
                }`}
                style={{ direction: "ltr" }}
              />
              <button
                type="button"
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Year Picker Dropdown */}
              {showYearPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-main border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 281 }, (_, i) => 1920 + i).map(
                        (year) => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => {
                              setReleaseYear(year);
                              setShowYearPicker(false);
                              if (errors.releaseYear) {
                                setErrors((prev) => ({
                                  ...prev,
                                  releaseYear: "",
                                }));
                              }
                            }}
                            className={`p-2 text-sm rounded-lg transition-colors duration-200 ${
                              releaseYear === year
                                ? "bg-beige3 text-white"
                                : "text-gray-400 hover:bg-dry hover:text-white"
                            }`}
                          >
                            {year}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.releaseYear && (
              <p className="text-red-500 text-xs mt-1">{errors.releaseYear}</p>
            )}
          </div>

          {/* حقل حالة الفيلم */}
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-border font-medium text-sm">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (errors.status) {
                  setErrors((prev) => ({ ...prev, status: "" }));
                }
              }}
              className={`w-full bg-main border text-white rounded-2xl p-4 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none ${
                errors.status ? "border-red-500" : "border-border"
              }`}
            >
              <option value="">Select Status</option>
              <option value="Archived">Archived</option>
              <option value="Now Showing">Now Showing</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
        </div>

        {/* Overlay to close year picker when clicking outside */}
        {showYearPicker && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowYearPicker(false)}
          />
        )}

        {/* Images */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">
              Image Without Title
            </p>
            <Uploader onFileSelect={handleImageWithoutTitleUpload} />
            {errors.imageWithoutTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.imageWithoutTitle}
              </p>
            )}
            {(imageWithoutTitleLoading || imageWithoutTitlePreview) && (
              <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {imageWithoutTitleLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
                  </div>
                ) : (
                  <img
                    src={imageWithoutTitlePreview}
                    alt="Movie poster without title"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 group">
            <p className="text-border font-semibold text-sm">
              Image With Title
            </p>
            <Uploader onFileSelect={handleImageWithTitleUpload} />
            {errors.imageWithTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.imageWithTitle}
              </p>
            )}
            {(imageWithTitleLoading || imageWithTitlePreview) && (
              <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {imageWithTitleLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
                  </div>
                ) : (
                  <img
                    src={imageWithTitlePreview}
                    alt="Movie poster with title"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-sm w-full">
          <label className="text-border font-semibold">Movie Description</label>
          <textarea
            name="description"
            className={`w-full h-40 mt-2 p-6 bg-main border rounded-2xl text-white ${
              errors.description ? "border-red-500" : "border-border"
            }`}
            placeholder="Make it short and sweet"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Casts - فقط الممثلين المضافين لهذا الفيلم */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-bold text-lg">Cast & Crew</h3>
            <span className="text-gray-400 text-sm">
              ({movieCastMembers.length} members)
            </span>
          </div>

          <div className="w-full grid lg:grid-cols-2 gap-6 items-start">
            <button
              onClick={openAddModal}
              className="w-full py-4 bg-main border border-beige3 border-dashed text-white rounded-2xl hover:bg-beige3 transition-colors duration-300"
            >
              Add Cast
            </button>

            {/* Cast Members Grid */}
            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-4 grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <p className="text-white">Loading cast ...</p>
                </div>
              ) : error ? (
                <div className="col-span-full text-red-500 py-4">{error}</div>
              ) : movieCastMembers.length === 0 ? (
                <div className="col-span-full text-gray-400 py-4">
                  No cast found. Add some!
                </div>
              ) : (
                movieCastMembers.map((cast) => (
                  <div
                    key={cast.id}
                    className={`p-2 italic text-xs text-text rounded-2xl flex-colo ${
                      cast.castType === "Director"
                        ? "bg-dry border-2 border-beige3"
                        : "bg-main border border-border"
                    } transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="relative w-full h-24 mb-2 group">
                      <img
                        src={cast.imageUrl ? cast.imageUrl : `/images/user.png`}
                        alt={cast.name}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                          // تقليل عدد رسائل الخطأ في وحدة التحكم
                          if (!window.reportedImageErrors) {
                            window.reportedImageErrors = {};
                          }

                          // طباعة رسالة الخطأ مرة واحدة فقط لكل صورة
                          if (!window.reportedImageErrors[cast.id]) {
                            console.log(
                              `Failed to load image for ${cast.name}, using fallback`
                            );
                            window.reportedImageErrors[cast.id] = true;
                          }

                          e.target.onerror = null;

                          // استخدام صورة المستخدم الافتراضية المحلية مباشرة
                          e.target.src = "/images/user.png";
                        }}
                      />
                      {/* نوع الممثل يظهر عند تمرير المؤشر على الصورة */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-60 rounded-2xl`}
                      >
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            cast.castType === "Director"
                              ? "bg-beige3 text-white"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          {cast.castType}
                        </span>
                      </div>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold">{cast.name}</p>
                    <div className="flex flex-rows mt-2 w-full gap-2 justify-center">
                      <button
                        onClick={() => confirmDeleteCast(cast)}
                        className="w-6 h-6 flex justify-center items-center bg-dry border border-border text-beige3 rounded-2xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300"
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => openEditModal(cast)}
                        className="w-6 h-6 flex justify-center items-center bg-dry border border-border text-gray-500 rounded-2xl hover:bg-green-500 hover:text-white transition-colors duration-300"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* لا نحتاج للتصفح - نعرض كل الممثلين المضافين للفيلم */}

          {/* عرض رسالة خطأ المخرج */}
          {errors.director && (
            <p className="text-red-500 text-sm mt-2 bg-red-100 bg-opacity-10 p-3 rounded-xl border border-red-500 border-opacity-30">
              {errors.director}
            </p>
          )}
        </div>

        <button
          onClick={handlePublishMovie}
          disabled={isLoading}
          className={`w-full flex-rows gap-6 font-medium transitions border border-beige3 flex-rows text-white py-4 rounded-2xl transition-transform duration-300 ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-beige3 hover:bg-dry hover:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Movie...
            </>
          ) : (
            <>
              <ImUpload /> Publish Movie
            </>
          )}
        </button>
      </div>

      {/* Add Cast Modal */}
      <AddCastModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddCast={handleAddCast}
      />

      {/* Edit Cast Modal */}
      <EditCastModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        cast={selectedCast}
        onUpdateCast={handleUpdateCast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => castToDelete && handleDeleteCast(castToDelete.id)}
        title="Delete Cast "
        message={`Are you sure you want to delete ${castToDelete?.name}?`}
      />

      {/* Temporary Modal */}
      <TemporaryModal
        isVisible={tempModal.show}
        message={tempModal.message}
        type={tempModal.type}
        onClose={() => setTempModal((prev) => ({ ...prev, show: false }))}
      />
    </SideBar>
  );
}

export default AddMovie;
