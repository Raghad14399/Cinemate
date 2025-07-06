import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Input } from "../UsedInputs";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaPlus } from "react-icons/fa";
import Uploader from "../Uploader";
import MultiSelect from "../MultiSelect";
import DatePicker from "../DatePicker";
import {
  movieService,
  languageService,
  movieClassificationService,
  movieTypeService,
  hallService,
  imageService,
  castService,
} from "../../api/services";
import useAuthErrorHandler from "../../hooks/useAuthErrorHandler";
import TemporaryModal from "../TemporaryModal";
import AddCastModal from "./AddCastModal";
import EditCastModal from "./EditCastModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

// --- Date Format Utilities ---
// Convert 'YYYY-MM-DD' or 'YYYY/MM/DD' to 'DD/MM/YYYY' for display
function toDisplayDate(dateStr) {
  if (!dateStr) return '';
  // Accepts 'YYYY-MM-DD' or 'YYYY/MM/DD' or even 'YYYY.MM.DD'
  const match = dateStr.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})$/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  // Already in DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  return '';
}
// Convert 'DD/MM/YYYY' to 'YYYY-MM-DD' for API
function toApiDate(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  // Already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  return '';
}

function EditMovieModal({ isOpen, onClose, movie }) {
  // Auth error handler
  const { executeApiCall } = useAuthErrorHandler(); // Fix executeApiCall definition

  const [errors, setErrors] = useState({});

  // Refs for scrolling to errors
  const titleRef = useRef(null);
  const durationRef = useRef(null);
  const descRef = useRef(null);
  const yearRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const languagesRef = useRef(null);
  const translationsRef = useRef(null);
  const categoriesRef = useRef(null);
  const classificationRef = useRef(null);
  const imageWithoutTitleRef = useRef(null);
  const imageWithTitleRef = useRef(null);
  const schedulesRef = useRef(null);

  // Basic movie information
  const [movieTitle, setMovieTitle] = useState("");
  const [durationInMinutes, setDurationInMinutes] = useState(0);
  const [rate, setRate] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  // Multi-select fields
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTranslations, setSelectedTranslations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState(0);

  // Date fields
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Images
  const [imageWithoutTitle, setImageWithoutTitle] = useState(null);
  const [imageWithTitle, setImageWithTitle] = useState(null);
  const [imageWithoutTitlePreview, setImageWithoutTitlePreview] = useState("");
  const [imageWithTitlePreview, setImageWithTitlePreview] = useState("");

  // Cinema halls management
  const [hallSchedules, setHallSchedules] = useState([]);

  // Hall Schedule Handlers
  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...hallSchedules];
    if (field === 'hallId' || field === 'languageId' || field === 'subtitleId') {
      value = value ? Number(value) : '';
    }
    if (field === 'is3d') {
        value = Boolean(value);
    }
    newSchedules[index][field] = value;
    setHallSchedules(newSchedules);
  };

  const addSchedule = () => {
    setHallSchedules([
      ...hallSchedules,
      {
        id: null, // New schedules don't have an ID yet
        hallId: "",
        time: "",
        is3d: false,
        languageId: "",
        subtitleId: "",
      },
    ]);
  };

  const removeSchedule = (index) => {
    const newSchedules = hallSchedules.filter((_, i) => i !== index);
    setHallSchedules(newSchedules);
  };

  // Cast members
  const [movieCastMembers, setMovieCastMembers] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Options for dropdowns
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movieClassifications, setMovieClassifications] = useState([]);
  const [halls, setHalls] = useState([]);

  // Loading states for API calls
  const [loadingData, setLoadingData] = useState(false);

  // Temporary modal state
  const [tempModal, setTempModal] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Cast management modals state
  const [isAddCastModalOpen, setIsAddCastModalOpen] = useState(false);
  const [isEditCastModalOpen, setIsEditCastModalOpen] = useState(false);
  const [isDeleteCastModalOpen, setIsDeleteCastModalOpen] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null);
  const [castToDelete, setCastToDelete] = useState(null);

  // Load cast members for the movie
  const loadMovieCast = useCallback(
    async (movieId) => {
      try {
        // Get movie details to get cast data
        const movieResponse = await executeApiCall(() =>
          movieService.getMovieById(movieId)
        );

        if (movieResponse?.data?.success && movieResponse.data.data) {
          const movieData = movieResponse.data.data;
          const castMembers = [];

          // Handle movieCasts array if it exists
          if (movieData.movieCasts && Array.isArray(movieData.movieCasts)) {
            movieData.movieCasts.forEach((castMember) => {
              // يدعم السيناريو الذي يكون فيه العنصر مباشرة ممثل أو مخرج (كما في مثال الـ API)
              const castObj = castMember.cast || castMember;
              if (castObj) {
                console.log("Cast member raw data:", castObj);
                const imageId = castObj.imageId || castObj.imageID;
                let imageUrl = null;
                if (imageId) {
                  imageUrl = `http://cinemate-001-site1.jtempurl.com/Images/${imageId}.png`;
                } else if (castObj.image) {
                  if (typeof castObj.image === "string") {
                    imageUrl = castObj.image.startsWith("Images/")
                      ? `http://cinemate-001-site1.jtempurl.com/${castObj.image}`
                      : castObj.image;
                  } else if (castObj.image.url) {
                    imageUrl = castObj.image.url.startsWith("Images/")
                      ? `http://cinemate-001-site1.jtempurl.com/${castObj.image.url}`
                      : castObj.image.url;
                  }
                }
                castMembers.push({
                  id: castObj.id,
                  name: `${castObj.firstName} ${castObj.lastName}`.trim(),
                  castType:
                    castObj.castType === "ACTOR" ? "Actor" : "Director",
                  imageUrl: imageUrl,
                });
              }
            });
          }

          // Handle director separately if it exists
          if (movieData.director) {
            console.log("Director raw data:", movieData.director);

            // إضافة المخرج إذا لم يكن موجود مسبقًا في القائمة
            const directorExists = castMembers.some(
              (cast) => cast.id === movieData.director.id
            );
            if (!directorExists) {
              const imageId = movieData.director.imageId || movieData.director.imageID;
              let imageUrl = null;
              if (imageId) {
                imageUrl = `http://cinemate-001-site1.jtempurl.com/Images/${imageId}.png`;
              } else if (movieData.director.image) {
                if (typeof movieData.director.image === "string") {
                  imageUrl = movieData.director.image.startsWith("Images/")
                    ? `http://cinemate-001-site1.jtempurl.com/${movieData.director.image}`
                    : movieData.director.image;
                } else if (movieData.director.image.url) {
                  imageUrl = movieData.director.image.url.startsWith("Images/")
                    ? `http://cinemate-001-site1.jtempurl.com/${movieData.director.image.url}`
                    : movieData.director.image.url;
                }
              }
              castMembers.push({
                id: movieData.director.id,
                name: `${movieData.director.firstName} ${movieData.director.lastName}`.trim(),
                castType: "Director",
                imageUrl: imageUrl,
              });
            }
          }

          console.log("Edit Modal - Final cast members:", castMembers);
          setMovieCastMembers(castMembers);
        }
      } catch (error) {
        console.error("Error loading movie cast:", error);
        setMovieCastMembers([]);
      }
    },
    [executeApiCall]
  );

  // Load dropdown data from API
  const loadDropdownData = useCallback(async () => {
    setLoadingData(true);
    try {
      // Load all dropdown data in parallel
      const [
        languagesResponse,
        categoriesResponse,
        classificationsResponse,
        hallsResponse,
      ] = await Promise.all([
        executeApiCall(() =>
          languageService.getAllLanguages({
            PageIndex: 0,
            PageSize: 100,
          })
        ),
        executeApiCall(() =>
          movieTypeService.getAllMovieTypes({
            PageIndex: 0,
            PageSize: 100,
          })
        ),
        executeApiCall(() =>
          movieClassificationService.getAllMovieClassifications({
            PageIndex: 0,
            PageSize: 100,
          })
        ),
        executeApiCall(() => hallService.getAllHalls()),
      ]);

      // Set languages data - same format as AddMovie
      if (languagesResponse?.data?.success && languagesResponse.data.data) {
        const languagesList = languagesResponse.data.data.map((lang) => ({
          id: lang.id,
          code: lang.code,
          name: lang.englishName,
          arabicName: lang.arabicName,
        }));
        console.log(
          "Edit Modal - Languages loaded:",
          languagesList.length,
          "languages"
        );
        setLanguages(languagesList);
      }

      // Set categories data - same format as AddMovie
      if (categoriesResponse?.data?.success && categoriesResponse.data.data) {
        const typesList = categoriesResponse.data.data.map((type) => ({
          id: type.id,
          title: type.englishName, // استخدام title بدلاً من name ليتوافق مع MultiSelect
          arabicName: type.arabicName,
        }));
        setCategories(typesList);
      }

      // Set classifications data - same format as AddMovie
      if (
        classificationsResponse?.data?.success &&
        classificationsResponse.data.data
      ) {
        const classificationsList = classificationsResponse.data.data.map(
          (classification) => ({
            id: classification.id,
            code: classification.code,
            name: classification.englishName,
            arabicName: classification.arabicName,
          })
        );
        setMovieClassifications(classificationsList);
      }

      // Set halls data
      if (hallsResponse?.data?.success && hallsResponse.data.data) {
        const hallsData = hallsResponse.data.data;
        // Transform the raw hall data using the service function, same as in AddMovie
        const transformedHalls = hallsData
          .map((hall) => hallService.transformHallDataFromAPI(hall))
          .filter((hall) => hall !== null); // Filter out any null results from transformation
        setHalls(transformedHalls);
      }

      return Promise.resolve(); // Return resolved promise
    } catch (error) {
      console.error("Error loading dropdown data:", error);
      return Promise.reject(error);
    } finally {
      setLoadingData(false);
    }
  }, [executeApiCall]);

  // Load dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen, loadDropdownData]);

  // Set movie data when movie prop changes and after dropdown data is loaded
  useEffect(() => {
    if (movie && languages.length > 0) {
      console.log("Edit Modal - Setting movie data:", movie);
      setMovieTitle(movie.name || "");
      // Handle duration - if 0, leave empty for user to fill
      setDurationInMinutes(
        movie.durationInMinutes && movie.durationInMinutes > 0
          ? movie.durationInMinutes
          : 0
      );
      setRate(movie.rate || 0);
      setTrailerUrl(movie.trailerUrl || "");
      setReleaseYear(movie.year || "");
      console.log("Edit Modal - Setting status:", movie.status);
      setStatus(movie.status || "");
      setDescription(movie.description || "");
      setFromDate(toDisplayDate(movie.fromDate));
      setToDate(toDisplayDate(movie.toDate));

      // Set multi-select values - handle both array and object formats
      if (movie.movieLanguages && Array.isArray(movie.movieLanguages)) {
        const langIds = movie.movieLanguages.map((lang) => lang.id || lang);
        console.log("Edit Modal - Setting selected languages:", langIds);
        setSelectedLanguages(langIds);
      } else if (
        movie.movieLanguageIds &&
        Array.isArray(movie.movieLanguageIds)
      ) {
        console.log(
          "Edit Modal - Setting selected language IDs:",
          movie.movieLanguageIds
        );
        setSelectedLanguages(movie.movieLanguageIds);
      } else {
        setSelectedLanguages([]);
      }

      if (movie.movieSubtitles && Array.isArray(movie.movieSubtitles)) {
        const subIds = movie.movieSubtitles.map((sub) => sub.id || sub);
        console.log("Edit Modal - Setting selected subtitles:", subIds);
        setSelectedTranslations(subIds);
      } else if (
        movie.movieSubtitleIds &&
        Array.isArray(movie.movieSubtitleIds)
      ) {
        console.log(
          "Edit Modal - Setting selected subtitle IDs:",
          movie.movieSubtitleIds
        );
        setSelectedTranslations(movie.movieSubtitleIds);
      } else {
        setSelectedTranslations([]);
      }

      if (movie.movieTypes && Array.isArray(movie.movieTypes)) {
        const typeIds = movie.movieTypes.map((type) => type.id || type);
        console.log("Edit Modal - Setting selected categories:", typeIds);
        setSelectedCategories(typeIds);
      } else if (movie.movieTypeIds && Array.isArray(movie.movieTypeIds)) {
        console.log(
          "Edit Modal - Setting selected category IDs:",
          movie.movieTypeIds
        );
        setSelectedCategories(movie.movieTypeIds);
      } else {
        setSelectedCategories([]);
      }

      if (movie.movieClassification) {
        setSelectedClassification(
          movie.movieClassification.id || movie.movieClassificationId || 0
        );
      } else {
        setSelectedClassification(movie.movieClassificationId || 0);
      }

      // Set hall schedules from movie.movieTimes
      if (movie.movieTimes && Array.isArray(movie.movieTimes)) {
        const schedules = movie.movieTimes.map((mt) => ({
          id: mt.id || null,
          hallId: mt.hall.id,
          time: mt.time.substring(0, 5), // "HH:mm:ss" -> "HH:mm"
          is3d: mt.is3d,
          languageId: mt.language.id,
          subtitleId: mt.subtitle.id,
        }));
        setHallSchedules(schedules);
      } else {
        setHallSchedules([]);
      }

      // Set images - handle both direct URLs and image objects
      console.log(
        "Edit Modal - Movie image data:",
        movie.image,
        "imageID:",
        movie.imageID
      );

      // Handle different image data formats
      if (movie.image) {
        let imageUrl = null;

        if (typeof movie.image === "string") {
          // If image is a string path like "Images/filename.jpg"
          imageUrl = movie.image.startsWith("Images/")
            ? `http://cinemate-001-site1.jtempurl.com/${movie.image}`
            : movie.image;
        } else if (movie.image.url) {
          // If image is an object with url property
          imageUrl = movie.image.url.startsWith("Images/")
            ? `http://cinemate-001-site1.jtempurl.com/${movie.image.url}`
            : movie.image.url;
        }

        if (imageUrl) {
          console.log("Setting image without title preview:", imageUrl);
          setImageWithoutTitlePreview(imageUrl);
        }
      } else if (movie.imageID) {
        // Fallback to imageID if no image object/string
        const imageUrl = `http://cinemate-001-site1.jtempurl.com/Images/${movie.imageID}.png`;
        console.log(
          "Setting image without title preview from ID (fallback):",
          imageUrl
        );
        setImageWithoutTitlePreview(imageUrl);
      }

      console.log(
        "Edit Modal - Movie secondary image data:",
        movie.secondaryImage,
        "secondaryImageID:",
        movie.secondaryImageID
      );

      // Handle different secondary image data formats
      if (movie.secondaryImage) {
        let imageUrl = null;

        if (typeof movie.secondaryImage === "string") {
          // If secondaryImage is a string path like "Images/filename.jpg"
          imageUrl = movie.secondaryImage.startsWith("Images/")
            ? `http://cinemate-001-site1.jtempurl.com/${movie.secondaryImage}`
            : movie.secondaryImage;
        } else if (movie.secondaryImage.url) {
          // If secondaryImage is an object with url property
          imageUrl = movie.secondaryImage.url.startsWith("Images/")
            ? `http://cinemate-001-site1.jtempurl.com/${movie.secondaryImage.url}`
            : movie.secondaryImage.url;
        }

        if (imageUrl) {
          console.log(
            "Setting secondary image from secondaryImage object:",
            imageUrl
          );
          setImageWithTitlePreview(imageUrl);
        }
      } else {
        // If no secondaryImage, try to use the same image as primary image
        // This is a common case where movies might use the same image for both
        if (movie.image) {
          let imageUrl = null;

          if (typeof movie.image === "string") {
            imageUrl = movie.image.startsWith("Images/")
              ? `http://cinemate-001-site1.jtempurl.com/${movie.image}`
              : movie.image;
          } else if (movie.image.url) {
            imageUrl = movie.image.url.startsWith("Images/")
              ? `http://cinemate-001-site1.jtempurl.com/${movie.image.url}`
              : movie.image.url;
          }

          if (imageUrl) {
            console.log(
              "Using primary image for secondary image preview:",
              imageUrl
            );
            setImageWithTitlePreview(imageUrl);
          }
        } else {
          console.log("No secondary image available, leaving empty");
          setImageWithTitlePreview("");
        }
      }

      // Load cast members for this movie
      loadMovieCast(movie.id);
    }
  }, [movie, languages, categories, movieClassifications, loadMovieCast]);

  // Debug status changes and force re-render
  useEffect(() => {
    console.log("Status state changed to:", status);
    console.log("Current movie status:", movie?.status);

    // Force re-render of status dropdown
    if (status) {
      const statusSelect = document.querySelector(
        'select[data-status-select="true"]'
      );
      console.log("Found status select element:", statusSelect);
      console.log("Current DOM value:", statusSelect?.value);
      console.log("Expected value:", status);

      if (statusSelect && statusSelect.value !== status) {
        console.log(
          "Updating DOM select value from",
          statusSelect.value,
          "to",
          status
        );
        statusSelect.value = status;
      }
    }
  }, [status, movie]);

  // Separate effect to set status after movie data is loaded
  useEffect(() => {
    if (movie && movie.status && languages.length > 0) {
      console.log("Setting status from movie data:", movie.status);
      // Force immediate update
      setStatus(movie.status);

      // Also force DOM update as backup
      setTimeout(() => {
        const statusSelect = document.querySelector(
          'select[data-status-select="true"]'
        );
        if (statusSelect && statusSelect.value !== movie.status) {
          console.log("Force updating DOM select value to:", movie.status);
          statusSelect.value = movie.status;
          // Trigger change event to sync with React
          const event = new Event("change", { bubbles: true });
          statusSelect.dispatchEvent(event);
        }
      }, 200);
    }
  }, [movie, languages]);

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

  // Cast management functions
  const openAddCastModal = () => {
    // الانتقال إلى منتصف الصفحة لرؤية المودال بوضوح
    window.scrollTo({
      top: window.innerHeight / 3,
      behavior: "smooth",
    });

    // فتح المودال بعد delay قصير للسماح للـ scroll بالانتهاء
    setTimeout(() => {
      setIsAddCastModalOpen(true);
    }, 300);
  };

  const closeAddCastModal = () => {
    setIsAddCastModalOpen(false);
  };

  const openEditCastModal = (cast) => {
    // الانتقال إلى منتصف الصفحة لرؤية المودال بوضوح
    window.scrollTo({
      top: window.innerHeight / 3,
      behavior: "smooth",
    });

    // فتح المودال بعد delay قصير للسماح للـ scroll بالانتهاء
    setTimeout(() => {
      setSelectedCast(cast);
      setIsEditCastModalOpen(true);
    }, 300);
  };

  const closeEditCastModal = () => {
    setIsEditCastModalOpen(false);
    setSelectedCast(null);
  };

  const openDeleteCastModal = (cast) => {
    setCastToDelete(cast);
    setIsDeleteCastModalOpen(true);
  };

  const closeDeleteCastModal = () => {
    setIsDeleteCastModalOpen(false);
    setCastToDelete(null);
  };

  // دالة إضافة ممثل جديد للفيلم
  const handleAddCast = async (newCast) => {
    try {
      // إضافة الممثل للواجهة أولاً
      setMovieCastMembers((prev) => [newCast, ...prev]);

      // ربط الممثل بالفيلم في قاعدة البيانات
      if (movie?.id && newCast?.id) {
        console.log(`Linking cast ${newCast.id} to movie ${movie.id}`);
        await executeApiCall(() =>
          movieService.addCastToMovie(movie.id, newCast.id)
        );
        console.log("Cast successfully linked to movie");
      }

      // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight / 3,
          behavior: "smooth",
        });
      }, 100);

      // عرض رسالة نجاح
      showTempModal("Cast added and linked to movie successfully!", "success");
    } catch (error) {
      console.error("Error linking cast to movie:", error);

      // عرض رسالة خطأ
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to link cast to movie";
      showTempModal(errorMessage, "error");
    }
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
        top: window.innerHeight / 3,
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

      // إزالة الربط بين الممثل والفيلم أولاً
      if (movie?.id) {
        console.log(`Removing cast ${castId} from movie ${movie.id}`);
        await executeApiCall(() =>
          movieService.removeCastFromMovie(movie.id, castId)
        );
        console.log("Cast successfully removed from movie");
      }

      // حذف الممثل من الخادم باستخدام خدمة castService
      const deleteResponse = await executeApiCall(() =>
        castService.deleteCast(castId)
      );

      console.log("Delete cast response:", deleteResponse?.data);

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

      // إزالة الممثل من قائمة الممثلين في الواجهة
      setMovieCastMembers((prev) => prev.filter((cast) => cast.id !== castId));

      // الانتقال إلى منتصف الصفحة لرؤية رسالة النجاح
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight / 3,
          behavior: "smooth",
        });
      }, 100);

      // عرض رسالة نجاح
      showTempModal(
        "Cast removed from movie and deleted successfully!",
        "success"
      );

      // إغلاق مودال التأكيد
      closeDeleteCastModal();
    } catch (error) {
      console.error("Error deleting cast:", error);

      // الانتقال إلى منتصف الصفحة لرؤية رسالة الخطأ
      window.scrollTo({
        top: window.innerHeight / 3,
        behavior: "smooth",
      });

      // عرض رسالة خطأ
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete cast";
      showTempModal(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const handleImageWithoutTitleUpload = (file) => {
    setImageWithoutTitle(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageWithoutTitlePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageWithTitleUpload = (file) => {
    setImageWithTitle(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageWithTitlePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Scroll to the first error field
  const scrollToError = (fieldName) => {
    const refs = {
      movieTitle: titleRef,
      durationInMinutes: durationRef,
      description: descRef,
      releaseYear: yearRef,
      fromDate: fromDateRef,
      toDate: toDateRef,
      languages: languagesRef,
      translations: translationsRef,
      categories: categoriesRef,
      classificationId: classificationRef,
      imageWithoutTitle: imageWithoutTitleRef,
      imageWithTitle: imageWithTitleRef,
      hallSchedules: schedulesRef,
    };

    const ref = refs[fieldName];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    if (!movieTitle) newErrors.movieTitle = "Movie title is required.";
    if (!durationInMinutes || durationInMinutes <= 0) newErrors.durationInMinutes = "Duration must be a positive number.";
    if (!description) newErrors.description = "Description is required.";
    if (!releaseYear) newErrors.releaseYear = "Release year is required.";
    if (!fromDate) newErrors.fromDate = "Start date is required.";
    if (!toDate) newErrors.toDate = "End date is required.";
    if (selectedLanguages.length === 0) newErrors.languages = "At least one language is required.";
    if (selectedTranslations.length === 0) newErrors.translations = "At least one subtitle language is required.";
    if (selectedCategories.length === 0) newErrors.categories = "At least one category is required.";
    if (!selectedClassification) newErrors.classificationId = "Movie classification is required.";
    if (!imageWithoutTitle && !imageWithoutTitlePreview) newErrors.imageWithoutTitle = "Main image is required.";
    if (!imageWithTitle && !imageWithTitlePreview) newErrors.imageWithTitle = "Cover image is required.";

    // Validate schedules
    if (hallSchedules.length === 0) {
        newErrors.hallSchedules = "At least one hall schedule is required.";
    } else {
        for (let i = 0; i < hallSchedules.length; i++) {
            const schedule = hallSchedules[i];
            if (!schedule.hallId || !schedule.time || !schedule.languageId || !schedule.subtitleId) {
                newErrors.hallSchedules = `All fields in schedule #${i + 1} are required.`;
                break; // Stop at the first invalid schedule
            }
        }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      scrollToError(firstErrorField);
      return false;
    }
    return true;
  };

  const handleEditMovie = async () => {
    if (!validateForm()) {
      return;
    }
    // Validation
    const newErrors = {};

    if (!movieTitle) newErrors.movieTitle = "Movie title is required";
    if (!durationInMinutes || durationInMinutes < 45 || durationInMinutes > 240)
      newErrors.durationInMinutes =
        "Duration must be between 45 and 240 minutes";
    if (!rate || rate < 0 || rate > 5)
      newErrors.rate = "Rating must be between 0 and 5";
    if (!trailerUrl) newErrors.trailerUrl = "Trailer URL is required";
    if (!releaseYear) newErrors.releaseYear = "Release year is required";
    if (!status) newErrors.status = "Status is required";
    if (!description) newErrors.description = "Description is required";
    if (!selectedClassification)
      newErrors.selectedClassification = "Classification is required";
    if (!fromDate) newErrors.fromDate = "From date is required";
    if (!toDate) newErrors.toDate = "To date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // الانتقال إلى أعلى قليلاً لرؤية رسائل الخطأ بوضوح
      window.scrollTo({
        top: window.innerHeight / 3,
        behavior: "smooth",
      });

      // عرض رسالة خطأ للتحقق من صحة البيانات
      const firstError = Object.values(newErrors)[0];
      showTempModal(`Validation Error: ${firstError}`, "error");
      return;
    }

    setIsLoading(true);
    try {
      // Upload images if new ones are selected
      let imageID = movie?.imageID || 0;
      let secondaryImageID = movie?.secondaryImageID || 0;

      if (imageWithoutTitle) {
        const formData = new FormData();
        formData.append("Image", imageWithoutTitle);
        formData.append("Title", "Movie Image");
        formData.append("Url", "");

        const imageResponse = await executeApiCall(() =>
          imageService.uploadImage(formData)
        );

        if (imageResponse?.data?.success) {
          imageID = imageResponse.data.data.id;
        }
      }

      if (imageWithTitle) {
        const formData = new FormData();
        formData.append("Image", imageWithTitle);
        formData.append("Title", "Movie Title Image");
        formData.append("Url", "");

        const imageResponse = await executeApiCall(() =>
          imageService.uploadImage(formData)
        );

        console.log(
          "Edit Modal - Cast IDs being sent:",
          movieCastMembers.map((cast) => cast.id)
        );
      }

      // Find directorId (if present)
      const director = movieCastMembers.find((cast) => cast.castType === "Director");
      const directorId = director ? director.id : null;

      // Build movieTimes array from hallSchedules state
      const movieTimes = hallSchedules.map(schedule => ({
        id: schedule.id || 0, // Pass ID for updates, 0 for new
        hallId: Number(schedule.hallId),
        time: `${schedule.time}:00`, // Format to HH:mm:ss for API
        is3d: schedule.is3d,
        languageId: Number(schedule.languageId),
        subtitleId: Number(schedule.subtitleId),
      }));

      // Prepare movie data for update (API-compliant)
      const movieData = {
        name: movieTitle.trim(),
        year: parseInt(releaseYear),
        imageID: imageID,
        secondaryImageID: secondaryImageID,
        trailerUrl: trailerUrl.trim(),
        directorId: directorId,
        description: description.trim(),
        movieClassificationId: parseInt(selectedClassification),
        status: status,
        fromDate: toApiDate(fromDate),
        toDate: toApiDate(toDate),
        rate: parseFloat(rate),
        durationInMinutes: parseInt(durationInMinutes),
        movieLanguageIds: selectedLanguages,
        movieSubtitleIds: selectedTranslations,
        movieTypeIds: selectedCategories,
        movieCastIds: movieCastMembers.map((cast) => cast.id),
        movieTimes: movieTimes,
      };


      // Update movie
      const updateResponse = await executeApiCall(() =>
        movieService.updateMovie(movie.id, movieData)
      );

      if (updateResponse?.data?.success) {
        // الانتقال إلى أعلى قليلاً لرؤية رسالة النجاح بوضوح
        window.scrollTo({
          top: window.innerHeight / 3,
          behavior: "smooth",
        });

        // عرض رسالة نجاح
        showTempModal("Movie updated successfully!", "success");

        // Close modal after showing success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error("Failed to update movie");
      }
    } catch (error) {
      console.error("Error updating movie:", error);

      // الانتقال إلى أعلى قليلاً لرؤية رسالة الخطأ بوضوح
      window.scrollTo({
        top: window.innerHeight / 3,
        behavior: "smooth",
      });

      // عرض رسالة خطأ
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update movie";
      showTempModal(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{ top: "2%" }}
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
        className={`relative bg-gray-900 text-white border border-border w-[95%] md:w-[900px] max-h-[90vh] overflow-y-auto p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Movie</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition duration-300 ease-in-out"
          >
            <IoClose />
          </button>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading data...</span>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* First Row: Movie Title and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="w-full" ref={titleRef}>
              <Input
                label="Movie Title"
                placeholder="Enter movie title"
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                className="w-full text-sm"
              />
              {errors.movieTitle && <p className="text-red-500 text-xs mt-1">{errors.movieTitle}</p>}
            </div>

            <div className="w-full" ref={durationRef}>
              <Input
                label="Duration (in minutes)"
                placeholder="(45-240 Minutes)"
                type="number"
                value={durationInMinutes}
                onChange={(e) => setDurationInMinutes(e.target.value)}
                className="w-full text-sm "
              />
              {errors.durationInMinutes && <p className="text-red-500 text-xs mt-1">{errors.durationInMinutes}</p>}
            </div>
          </div>

          {/* Second Row: Rating and Trailer URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-border">
                Movie Rating
              </label>
              <input
                type="text"
                value={rate === 0 ? "" : rate}
                onChange={(e) => setRate(e.target.value)}
                maxLength="4"
                placeholder="1-5"
                className={`w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm ${
                  errors.rate ? "border border-red-500" : ""
                }`}
              />
              {errors.rate && (
                <p className="text-red-500 text-xs mt-1">{errors.rate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-border">
                Trailer URL
              </label>
              <input
                type="url"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                className={`w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm ${
                  errors.trailerUrl ? "border border-red-500" : ""
                }`}
                placeholder="https://youtube.com/watch?v=..."
              />
              {errors.trailerUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.trailerUrl}</p>
              )}
            </div>
          </div>

          {/* Third Row: Languages and Subtitles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={languagesRef}>
              <MultiSelect
                label="Languages Used"
                options={languages}
                selectedValues={selectedLanguages}
                onChange={(values) => {
                  setSelectedLanguages(values);
                  if (errors.languages) {
                    setErrors((prev) => ({ ...prev, languages: "" }));
                  }
                }}
                placeholder="Select languages used in the movie"
              />
              {errors.languages && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.languages}
                </p>
              )}
            </div>

            <div ref={translationsRef}>
              <MultiSelect
                label="Subtitle Languages"
                options={languages}
                selectedValues={selectedTranslations}
                onChange={(values) => {
                  setSelectedTranslations(values);
                  if (errors.translations) {
                    setErrors((prev) => ({
                      ...prev,
                      translations: "",
                    }));
                  }
                }}
                placeholder="Select Subtitle Languages"
              />
              {errors.translations && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.translations}
                </p>
              )}
            </div>
          </div>

          {/* Fourth Row: Movie Types and Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={categoriesRef}>
              <MultiSelect
                label="Movie Types"
                options={categories}
                selectedValues={selectedCategories}
                onChange={(values) => {
                  setSelectedCategories(values);
                  if (errors.categories) {
                    setErrors((prev) => ({ ...prev, categories: "" }));
                  }
                }}
                placeholder="Select Movie Types"
              />
              {errors.categories && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories}
                </p>
              )}
            </div>

            <div ref={classificationRef}>
              <label className="block text-sm font-semibold mb-2 text-border">
                Movie Classification
              </label>
              <select
                value={selectedClassification}
                onChange={(e) => {
                  setSelectedClassification(parseInt(e.target.value));
                  if (errors.classificationId) {
                    setErrors((prev) => ({
                      ...prev,
                      classificationId: "",
                    }));
                  }
                }}
                className={`w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm ${
                  errors.classificationId ? "border border-red-500" : ""
                }`}
              >
                <option value={0}>Select movie classification</option>
                {movieClassifications.map((classification) => (
                  <option key={classification.id} value={classification.id}>
                    {classification.name} ({classification.code})
                  </option>
                ))}
              </select>
              {errors.classificationId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.classificationId}
                </p>
              )}
            </div>
          </div>

          {/* Fifth Row: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={fromDateRef}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(value) => {
                  setFromDate(value);
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

            <div ref={toDateRef}>
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
              />
              {errors.toDate && (
                <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>
              )}
            </div>
          </div>

          {/* Sixth Row: Year and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={yearRef}>
              <label className="block text-sm font-semibold mb-2 text-border">
                Year of Release
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={releaseYear || ""}
                  onChange={(e) => {
                    const value = e.target.value;
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
                  className={`w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm ${
                    errors.releaseYear ? "border border-red-500" : ""
                  }`}
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
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.releaseYear}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-border">
                Status
              </label>
              <select
                key={`status-${status}-${movie?.id || "new"}`}
                data-status-select="true"
                value={status}
                onChange={(e) => {
                  console.log("Status dropdown changed to:", e.target.value);
                  setStatus(e.target.value);
                  if (errors.status) {
                    setErrors((prev) => ({ ...prev, status: "" }));
                  }
                }}
                className={`w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm ${
                  errors.status ? "border border-red-500" : ""
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

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div ref={imageWithoutTitleRef}>
              <label className="block text-sm font-semibold mb-2 text-border">
                Image Without Title
              </label>
              <Uploader onFileSelect={handleImageWithoutTitleUpload} />
              {errors.imageWithoutTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.imageWithoutTitle}
                </p>
              )}
              {imageWithoutTitlePreview && (
                <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 mt-2">
                  <img
                    src={imageWithoutTitlePreview}
                    alt="Movie poster without title"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      console.log(
                        "Movie image failed to load:",
                        imageWithoutTitlePreview
                      );
                      e.target.style.display = "none";
                    }}
                    onLoad={() => {
                      console.log(
                        "Movie image loaded successfully:",
                        imageWithoutTitlePreview
                      );
                    }}
                  />
                </div>
              )}
            </div>

            <div ref={imageWithTitleRef}>
              <label className="block text-sm font-semibold mb-2 text-border">
                Image With Title
              </label>
              <Uploader onFileSelect={handleImageWithTitleUpload} />
              {errors.imageWithTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.imageWithTitle}
                </p>
              )}
              {imageWithTitlePreview && (
                <div className="w-32 h-32 p-2 bg-main border border-border rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 mt-2">
                  <img
                    src={imageWithTitlePreview}
                    alt="Movie poster with title"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      console.log(
                        "Movie secondary image failed to load:",
                        imageWithTitlePreview
                      );
                      e.target.style.display = "none";
                    }}
                    onLoad={() => {
                      console.log(
                        "Movie secondary image loaded successfully:",
                        imageWithTitlePreview
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="w-full col-span-2" ref={descRef}>
            <label className="text-border font-semibold text-sm">
              Description
            </label>
            <textarea
              className="w-full h-40 mt-2 p-6 text-sm bg-main border border-border rounded"
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

          {/* --- Cinema Halls Management (New) --- */}
          <div ref={schedulesRef} className="w-full col-span-2 bg-main border border-border rounded-2xl p-6">
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
            <div className="space-y-4">
              {hallSchedules.map((schedule, index) => {
                const hallDetails = halls.find(h => h.id === schedule.hallId);
                return (
                  <div key={index} className="p-6 bg-dry border border-beige3 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                       
                        {hallDetails && (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300 mt-1">
                            <span>
                              Hall:{" "}
                              <span className="text-beige3 font-medium">{hallDetails.name}</span>
                            </span>
                            <span>
                              Type:{" "}
                              <span className="text-beige3 font-medium">{hallDetails.hallType}</span>
                            </span>

                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Settings */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Hall Selection */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">Hall</label>
                        <select
                          value={schedule.hallId}
                          onChange={(e) => handleScheduleChange(index, 'hallId', e.target.value)}
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall) => (
                            <option key={hall.id} value={hall.id}>
                              {hall.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Show Time */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">Show Time</label>
                        <input
                          type="time"
                          value={schedule.time}
                          onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </div>

                      {/* Language Used */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">Language Used</label>
                        <select
                          value={schedule.languageId}
                          onChange={(e) => handleScheduleChange(index, 'languageId', e.target.value)}
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
                        >
                          <option value="">Select Language</option>
                          {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subtitle Language */}
                      <div className="flex flex-col gap-2">
                        <label className="text-border font-medium text-sm">Subtitle Language</label>
                        <select
                          value={schedule.subtitleId}
                          onChange={(e) => handleScheduleChange(index, 'subtitleId', e.target.value)}
                          className="w-full bg-main border border-border text-white rounded-xl p-3 font-medium text-sm transition-colors duration-300 hover:bg-dry focus:bg-dry focus:outline-none"
                        >
                          <option value="">Select Subtitle</option>
                          {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Screen Type 3D/2D */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-border font-medium text-sm">Screen Type</label>
                        <div className="flex items-center gap-3 p-3 bg-main border border-border rounded-xl w-full md:w-1/2">
                          <span className={`flex-1 text-center text-sm font-medium ${!schedule.is3d ? "text-white" : "text-gray-400"}`}>
                            2D
                          </span>
                          <button
                            type="button"
                            onClick={() => handleScheduleChange(index, 'is3d', !schedule.is3d)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${schedule.is3d ? "bg-beige3" : "bg-gray-600"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${schedule.is3d ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                          <span className={`flex-1 text-center text-sm font-medium ${schedule.is3d ? "text-white" : "text-gray-400"}`}>
                            3D
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.hallSchedules && (
              <p className="text-red-500 text-xs mt-2 text-center">{errors.hallSchedules}</p>
            )}
            <button
              type="button"
              onClick={addSchedule}
              className="mt-6 w-full flex items-center justify-center gap-2 font-medium text-white py-3 rounded-xl bg-beige3 hover:bg-main border border-beige3 transition-colors"
            >
              <FaPlus /> Add New Hall
            </button>
          </div>

          {/* Cast & Crew */}
          <div className="w-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-bold text-lg">Cast & Crew</h3>
              <span className="text-gray-400 text-sm">
                ({movieCastMembers.length} members)
              </span>
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-6 items-start">
              <button
                type="button"
                onClick={openAddCastModal}
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
                          src={
                            cast.imageUrl ? cast.imageUrl : `/images/user.png`
                          }
                          alt={cast.name}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            console.log(
                              "Cast image failed to load:",
                              cast.imageUrl,
                              "for",
                              cast.name
                            );
                            e.target.onerror = null;
                            e.target.src = "/images/user.png";
                          }}
                        />
                        {/* Cast Type Badge */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-60 rounded-2xl">
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
                      </div>
                      <p className="font-semibold">{cast.name}</p>
                      <div className="flex flex-rows mt-2 w-full gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => openDeleteCastModal(cast)}
                          className="w-6 h-6 flex justify-center items-center bg-dry border border-border text-beige3 rounded-2xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300"
                        >
                          <MdDelete />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditCastModal(cast)}
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
          </div>

          {/* Edit Button */}
          <div className="mt-4">
            <button
              onClick={handleEditMovie}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-beige3 hover:bg-main border border-beige3 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <HiPencilAlt className="text-lg" /> Update Movie
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close year picker when clicking outside */}
      {showYearPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowYearPicker(false)}
        />
      )}

      {/* Temporary Modal for success/error messages */}
      <TemporaryModal
        type={tempModal.type}
        message={tempModal.message}
        isVisible={tempModal.show}
        onClose={() => setTempModal((prev) => ({ ...prev, show: false }))}
        duration={2000}
      />

      {/* Add Cast Modal */}
      <AddCastModal
        isOpen={isAddCastModalOpen}
        onClose={closeAddCastModal}
        onAddCast={handleAddCast}
      />

      {/* Edit Cast Modal */}
      <EditCastModal
        isOpen={isEditCastModalOpen}
        onClose={closeEditCastModal}
        cast={selectedCast}
        onUpdateCast={handleUpdateCast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteCastModalOpen}
        onClose={closeDeleteCastModal}
        onConfirm={() => castToDelete && handleDeleteCast(castToDelete.id)}
        title="Delete Cast"
        message={`Are you sure you want to delete ${castToDelete?.name}?`}
      />
    </div>
  );
}

export default EditMovieModal;
