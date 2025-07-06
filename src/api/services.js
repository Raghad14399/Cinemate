import api from "./config";

// دالة مساعدة لتحويل التاريخ إلى تنسيق API
const convertDateToAPIFormat = (dateString) => {
  if (!dateString) return null;

  // إذا كان التاريخ بالفعل بتنسيق YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // إذا كان التاريخ بتنسيق DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // محاولة تحويل التاريخ باستخدام Date object
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }
  } catch (error) {
    console.warn("Invalid date format:", dateString);
  }

  return dateString; // إرجاع القيمة الأصلية إذا فشل التحويل
};

// Auth Services
export const authService = {
  // Block user
  blockUser: async (userId) => {
    const response = await api.put(`/api/Auth/users/${userId}/block`);
    return response.data;
  },
  // Unblock user
  unblockUser: async (userId) => {
    const response = await api.put(`/api/Auth/users/${userId}/unblock`);
    return response.data;
  },
  getUsersCount: async () => {
    const response = await api.get("/api/Auth/count");
    return response.data?.data;
  },
  // Login
  login: async (formData) => {
    const response = await api.post("/api/Auth/LogIn", formData);
    return response.data;
  },

  // Customer Registration
  customerRegister: (userData) =>
    api.post("/api/Auth/customer-register", userData),

  // Email Verification
  resendVerificationCode: (email) =>
    api.post("/api/Auth/resend-verification-code", { email }),
  confirmEmail: (data) => api.post("/api/Auth/confirm-email", data),

  // Password Management
  changePassword: async (passwordData) => {
    const response = await api.post("/api/Auth/change-password", {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });
    return response.data;
  },
  resetPassword: (data) => api.post("/api/Auth/reset-password", data),
  sendResetPasswordCode: (email) =>
    api.post("/api/Auth/send-reset-passwordCode", { email }),

  // Token Management
  refreshToken: (token) => api.post("/api/Auth/refresh-token", { token }),

  // Scanner Management
  addScanner: (data) => api.post("/api/Auth/add-scanner", data),

  // User Management
  addUser: (data) => {
    // إذا كانت البيانات FormData، نحتاج لضبط headers مختلفة
    const config = {};
    if (data instanceof FormData) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      };
    }
    return api.post("/api/Auth/add-user", data, config);
  },

  // Admin Registration
  adminRegister: (userData) => api.post("/api/Auth/admin-register", userData),

  // Delete user
  deleteUser: async (userId) => {
    try {
      // تحويل ID إلى رقم
      const numericId = parseInt(userId);
      console.log(`Deleting user ${numericId}`);
      const response = await api.delete(`/api/Auth/delete-user/${numericId}`);
      console.log("Delete user response:", response);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Get all users with optional search and pagination
  getAllUsers: async (params = {}) => {
    // params: { SearchQuery, PageIndex, PageSize }
    const response = await api.get("/api/Auth/users", { params });
    return response.data;
  },

  // Get all employees with optional search and pagination
  getAllEmployees: async (params = {}) => {
    // params: { SearchQuery, PageIndex, PageSize }
    const response = await api.get("/api/Auth/employees", { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/api/Auth/users/${id}`);
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/api/Auth/employees/${id}`);
    return response.data;
  },

  // Update user (with FormData if image is present)
  updateUser: async (id, data) => {
    try {
      // تحويل ID إلى رقم
      const numericId = parseInt(id);

      // تحويل البيانات إلى FormData إذا لم تكن بالفعل
      const formData = new FormData();

      // إضافة الحقول المطلوبة
      formData.append("UserName", data.UserName || "");
      if (data.ImageId !== undefined) {
        formData.append("ImageId", data.ImageId);
      }
      if (data.PhoneNubmer) {
        formData.append("PhoneNubmer", data.PhoneNubmer);
      }

      // إعداد headers
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await api.put(`/api/Auth/update-user/${numericId}`, formData, config);
      console.log("Update user response:", response);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
};

// Movies Services
export const movieService = {
  getMoviesCount: async () => {
    const response = await api.get("/api/Movie/count");
    return response.data?.data;
  },
  // Get all movies with optional filtering
  getAllMovies: async (params) => {
    try {
      console.log("Fetching movies with params:", params);
      const response = await api.get("/api/Movie", { params });
      console.log("Movies API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }
  },

  // Get a specific movie by ID
  getMovieById: async (id) => {
    try {
      console.log(`Fetching movie with ID: ${id}`);
      const response = await api.get(`/api/Movie/${id}`);
      console.log("Movie details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      throw new Error(`Failed to fetch movie ${id}: ${error.message}`);
    }
  },

  // Create a new movie
  createMovie: async (movieData) => {
    try {
      console.log("Creating movie with data:", movieData);

      // التأكد من أن البيانات في التنسيق الصحيح بناءً على مواصفات AddMovieDTO
      const formattedData = {
        name: movieData.name || "", // مطلوب
        year: Math.max(1900, Math.min(2100, parseInt(movieData.year))), // مطلوب، 1900-2100
        imageId: parseInt(movieData.imageID) || 0, // مطلوب - تجربة تغيير الاسم
        secondaryImageId: movieData.secondaryImageID
          ? parseInt(movieData.secondaryImageID)
          : 0, // مطلوب - تجربة تغيير الاسم
        trailerUrl: movieData.trailerUrl || "", // مطلوب
        directorId: parseInt(movieData.directorId) || 0, // مطلوب
        description:
          movieData.description && movieData.description.length >= 3
            ? movieData.description.substring(0, 2000)
            : "Default movie description", // مطلوب، 3-2000 حرف
        movieClassificationId: parseInt(movieData.movieClassificationId) || 0, // مطلوب
        status: movieData.status || "", // مطلوب
        fromDate: movieData.fromDate
          ? convertDateToAPIFormat(movieData.fromDate)
          : "2025-01-01", // تنسيق التاريخ البسيط
        toDate: movieData.toDate
          ? convertDateToAPIFormat(movieData.toDate)
          : "2025-12-31", // تنسيق التاريخ البسيط
        rate: movieData.rate
          ? Math.max(0, Math.min(5, parseFloat(movieData.rate)))
          : 0, // مطلوب
        durationInMinutes: Math.max(
          1,
          Math.min(600, parseInt(movieData.durationInMinutes) || 120)
        ), // مطلوب، 1-600 دقيقة حسب API
        movieSubtitleIds: Array.isArray(movieData.movieSubtitleIds)
          ? movieData.movieSubtitleIds
          : [], // مطلوب
        movieLanguageIds: Array.isArray(movieData.movieLanguageIds)
          ? movieData.movieLanguageIds
          : [], // مطلوب
        movieTypeIds: Array.isArray(movieData.movieTypeIds)
          ? movieData.movieTypeIds
          : [], // مطلوب
        movieCastIds: Array.isArray(movieData.movieCastIds)
          ? movieData.movieCastIds
          : [], // مطلوب
        movieTimes: Array.isArray(movieData.movieTimes)
          ? movieData.movieTimes
          : [], // مصفوفة أوقات العرض مع القاعات
      };

      console.log("Formatted movie data for API:", formattedData);
      console.log(
        "Formatted movie data JSON:",
        JSON.stringify(formattedData, null, 2)
      );
      console.log("🖼️ Image IDs in formatted data:", {
        imageId: formattedData.imageId,
        secondaryImageId: formattedData.secondaryImageId,
        directorId: formattedData.directorId,
      });

      const response = await api.post("/api/Movie", formattedData);
      console.log("Create movie response:", response);
      return response;
    } catch (error) {
      console.error("=== MOVIE CREATION ERROR DETAILS ===");
      console.error("Full error object:", error);

      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("❌ Error response status:", error.response.status);
        console.error("❌ Error response data:", error.response.data);
        console.error("❌ Error response headers:", error.response.headers);

        // طباعة تفاصيل أكثر عن الخطأ
        if (error.response.data) {
          console.error("📋 Detailed error info:");
          console.error(JSON.stringify(error.response.data, null, 2));

          // طباعة أي رسائل خطأ محددة
          if (error.response.data.errors) {
            console.error("🔍 Validation errors:", error.response.data.errors);
          }
          if (error.response.data.title) {
            console.error("📝 Error title:", error.response.data.title);
          }
          if (error.response.data.detail) {
            console.error("📄 Error detail:", error.response.data.detail);
          }
        }
      } else if (error.request) {
        console.error("❌ No response received:", error.request);
      } else {
        console.error("❌ Error message:", error.message);
      }
      console.error("=== END ERROR DETAILS ===");

      // إعادة رمي الخطأ مع تفاصيل أكثر
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message;
      throw new Error(`Failed to create movie: ${errorMessage}`);
    }
  },

  // Update an existing movie
  updateMovie: async (id, movieData) => {
    try {
      console.log(`Updating movie ${id} with data:`, movieData);

      // تنسيق البيانات للتأكد من التوافق مع API - نفس تنسيق createMovie
      const formattedData = {
        name: movieData.name || "",
        year: parseInt(movieData.year) || new Date().getFullYear(),
        imageID: parseInt(movieData.imageID) || 0,
        secondaryImageID: parseInt(movieData.secondaryImageID) || 0,
        trailerUrl: movieData.trailerUrl || "",
        directorId: parseInt(movieData.directorId) || 0,
        description: movieData.description || "",
        movieClassificationId: parseInt(movieData.movieClassificationId) || 0,
        status: movieData.status || "Coming Soon",
        // تنسيق التاريخ كـ string بسيط (YYYY-MM-DD)
        fromDate: movieData.fromDate || "2025-01-01",
        toDate: movieData.toDate || "2025-12-31",
        rate: parseFloat(movieData.rate) || 0,
        durationInMinutes: parseInt(movieData.durationInMinutes) || 120,
        // إضافة الحقول المطلوبة للتحديث
        movieLanguageIds: Array.isArray(movieData.movieLanguageIds)
          ? movieData.movieLanguageIds
          : [],
        movieSubtitleIds: Array.isArray(movieData.movieSubtitleIds)
          ? movieData.movieSubtitleIds
          : [],
        movieTypeIds: Array.isArray(movieData.movieTypeIds)
          ? movieData.movieTypeIds
          : [],
        movieCastIds: Array.isArray(movieData.movieCastIds)
          ? movieData.movieCastIds
          : [],
        movieTimes: Array.isArray(movieData.movieTimes)
          ? movieData.movieTimes
          : [],
      };

      console.log("Formatted movie data for update API:", formattedData);

      const response = await api.put(`/api/Movie/${id}`, formattedData);
      console.log("Update movie response:", response);
      return response;
    } catch (error) {
      console.error(`=== MOVIE UPDATE ERROR DETAILS (ID: ${id}) ===`);
      console.error("Full error object:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 400 && error.response.data) {
          const errorData = error.response.data;
          if (errorData.errors) {
            const validationErrors = errorData.errors;
            let errorMessage = "Validation errors:\n";
            Object.keys(validationErrors).forEach((field) => {
              errorMessage += `• ${field}: ${validationErrors[field].join(
                ", "
              )}\n`;
            });
            throw new Error(errorMessage);
          }
          if (errorData.message) {
            throw new Error(`API Error: ${errorData.message}`);
          }
        }

        throw new Error(
          `Server Error (${error.response.status}): ${
            error.response.data?.message || "Unknown server error"
          }`
        );
      } else if (error.request) {
        throw new Error(
          "Network Error: Unable to connect to server. Please check your internet connection."
        );
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  },

  // Delete a movie
  deleteMovie: async (id) => {
    try {
      console.log(`Deleting movie ${id}`);
      const response = await api.delete(`/api/Movie/${id}`);
      console.log("Delete movie response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting movie ${id}:`, error);
      throw new Error(`Failed to delete movie ${id}: ${error.message}`);
    }
  },

  // Add language to movie
  addLanguageToMovie: async (movieId, languageId) => {
    try {
      console.log(`Adding language ${languageId} to movie ${movieId}`);
      const response = await api.post(
        `/api/Movie/${movieId}/languages/${languageId}`
      );
      console.log("Add language to movie response:", response);
      return response;
    } catch (error) {
      console.error(
        `Error adding language ${languageId} to movie ${movieId}:`,
        error
      );
      throw new Error(`Failed to add language to movie: ${error.message}`);
    }
  },

  // Remove language from movie
  removeLanguageFromMovie: async (movieId, languageId) => {
    try {
      console.log(`Removing language ${languageId} from movie ${movieId}`);
      const response = await api.delete(
        `/api/Movie/${movieId}/languages/${languageId}`
      );
      console.log("Remove language from movie response:", response);
      return response;
    } catch (error) {
      console.error(
        `Error removing language ${languageId} from movie ${movieId}:`,
        error
      );
      throw new Error(`Failed to remove language from movie: ${error.message}`);
    }
  },

  // Add subtitle to movie
  addSubtitleToMovie: async (movieId, languageId) => {
    try {
      console.log(`Adding subtitle ${languageId} to movie ${movieId}`);
      const response = await api.post(
        `/api/Movie/${movieId}/subtitles/${languageId}`
      );
      console.log("Add subtitle to movie response:", response);
      return response;
    } catch (error) {
      console.error(
        `Error adding subtitle ${languageId} to movie ${movieId}:`,
        error
      );
      throw new Error(`Failed to add subtitle to movie: ${error.message}`);
    }
  },

  // Remove subtitle from movie
  removeSubtitleFromMovie: async (movieId, languageId) => {
    try {
      console.log(`Removing subtitle ${languageId} from movie ${movieId}`);
      const response = await api.delete(
        `/api/Movie/${movieId}/subtitles/${languageId}`
      );
      console.log("Remove subtitle from movie response:", response);
      return response;
    } catch (error) {
      console.error(
        `Error removing subtitle ${languageId} from movie ${movieId}:`,
        error
      );
      throw new Error(`Failed to remove subtitle from movie: ${error.message}`);
    }
  },

  // Add cast to movie
  addCastToMovie: async (movieId, actorId) => {
    try {
      console.log(`Adding cast ${actorId} to movie ${movieId}`);
      const response = await api.post(`/api/Movie/${movieId}/casts/${actorId}`);
      console.log("Add cast to movie response:", response);
      return response;
    } catch (error) {
      console.error(`Error adding cast ${actorId} to movie ${movieId}:`, error);
      throw new Error(`Failed to add cast to movie: ${error.message}`);
    }
  },

  // Remove cast from movie
  removeCastFromMovie: async (movieId, actorId) => {
    try {
      console.log(`Removing cast ${actorId} from movie ${movieId}`);
      const response = await api.delete(
        `/api/Movie/${movieId}/casts/${actorId}`
      );
      console.log("Remove cast from movie response:", response);
      return response;
    } catch (error) {
      console.error(
        `Error removing cast ${actorId} from movie ${movieId}:`,
        error
      );
      throw new Error(`Failed to remove cast from movie: ${error.message}`);
    }
  },

  // Search movies (legacy support)
  searchMovies: async (query) => {
    try {
      console.log(`Searching movies with query: ${query}`);
      const response = await api.get("/api/Movie", {
        params: { SearchQuery: query },
      });
      console.log("Search movies response:", response);
      return response;
    } catch (error) {
      console.error(`Error searching movies with query ${query}:`, error);
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  },
};

// Booking Services
export const bookingService = {
  createBooking: (bookingData) => api.post("/api/Booking", bookingData),
  getBookingsByUser: () => api.get("/api/Booking/user"),
  cancelBooking: (id) => api.delete(`/api/Booking/${id}`),
};

// Cinema Services
export const cinemaService = {
  getAllCinemas: () => api.get("/api/Cinema"),
  getCinemaById: (id) => api.get(`/api/Cinema/${id}`),
};

// Showtime Services
export const showtimeService = {
  getShowtimes: () => api.get("/api/Showtime"),
  getShowtimeById: (id) => api.get(`/api/Showtime/${id}`),
};

// Cast Services
export const castService = {
  // Get all cast members with optional filtering
  getAllCast: async (params) => {
    try {
      console.log("Fetching cast with params:", params);
      const response = await api.get("/api/Cast", { params });
      console.log("Cast API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching cast:", error);
      // إعادة رمي الخطأ مع معلومات إضافية
      throw new Error(`Failed to fetch cast: ${error.message}`);
    }
  },

  // Get a specific cast member by ID
  getCastById: async (id) => {
    try {
      console.log("Fetching cast with ID:", id);
      const response = await api.get(`/api/Cast/${id}`);
      console.log("Cast details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching cast ${id}:`, error);
      throw new Error(`Failed to fetch cast ${id}: ${error.message}`);
    }
  },

  // Create a new cast member
  createCast: async (castData) => {
    try {
      console.log("Creating cast with data:", castData);
      const response = await api.post("/api/Cast", castData);
      console.log("Create cast response:", response);
      return response;
    } catch (error) {
      console.error("Error creating cast:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw new Error(`Failed to create cast: ${error.message}`);
    }
  },

  // Update an existing cast member
  updateCast: async (id, castData) => {
    try {
      console.log(`Updating cast ${id} with data:`, castData);
      const response = await api.put(`/api/Cast/${id}`, castData);
      console.log("Update cast response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating cast ${id}:`, error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update cast ${id}: ${error.message}`);
    }
  },

  // Delete a cast member
  deleteCast: async (id) => {
    try {
      console.log(`Deleting cast ${id}`);
      const response = await api.delete(`/api/Cast/${id}`);
      console.log("Delete cast response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting cast ${id}:`, error);
      throw new Error(`Failed to delete cast ${id}: ${error.message}`);
    }
  },
};

// Image Services
export const imageService = {
  // Upload a new image
  uploadImage: async (formData) => {
    try {
      console.log(
        "Uploading image with form data:",
        Array.from(formData.entries()).map(
          ([key, value]) =>
            `${key}: ${
              value instanceof File
                ? `File(${value.name}, ${value.size} bytes)`
                : value
            }`
        )
      );

      const response = await api.post("/api/Image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // زيادة مهلة الانتظار لتحميل الملفات الكبيرة
        timeout: 30000,
      });

      console.log("Image upload response:", response);
      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  },

  // Get an image by ID
  getImage: async (id) => {
    try {
      console.log(`Fetching image ${id}`);
      const response = await api.get(`/api/Image/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching image ${id}:`, error);
      throw new Error(`Failed to fetch image ${id}: ${error.message}`);
    }
  },

  // Update an image
  updateImage: async (id, formData) => {
    try {
      console.log(
        `Updating image ${id} with form data:`,
        Array.from(formData.entries()).map(
          ([key, value]) =>
            `${key}: ${
              value instanceof File
                ? `File(${value.name}, ${value.size} bytes)`
                : value
            }`
        )
      );

      const response = await api.put(`/api/Image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      console.log("Image update response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating image ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update image ${id}: ${error.message}`);
    }
  },

  // Delete an image
  deleteImage: async (id) => {
    try {
      console.log(`Deleting image ${id}`);
      const response = await api.delete(`/api/Image/${id}`);
      console.log("Image delete response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error);
      throw new Error(`Failed to delete image ${id}: ${error.message}`);
    }
  },
};

// MovieClassification Services
export const movieClassificationService = {
  // Get all movie classifications with optional filtering
  getAllMovieClassifications: async (params) => {
    try {
      console.log("Fetching movie classifications with params:", params);
      const response = await api.get("/api/MovieClassification", { params });
      console.log("Movie classifications API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching movie classifications:", error);
      throw new Error(
        `Failed to fetch movie classifications: ${error.message}`
      );
    }
  },

  // Get a specific movie classification by ID
  getMovieClassificationById: async (id) => {
    try {
      console.log(`Fetching movie classification with ID: ${id}`);
      const response = await api.get(`/api/MovieClassification/${id}`);
      console.log("Movie classification details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching movie classification ${id}:`, error);
      throw new Error(
        `Failed to fetch movie classification ${id}: ${error.message}`
      );
    }
  },

  // Create a new movie classification
  createMovieClassification: async (classificationData) => {
    try {
      console.log(
        "Creating movie classification with data:",
        classificationData
      );
      const response = await api.post(
        "/api/MovieClassification",
        classificationData
      );
      console.log("Create movie classification response:", response);
      return response;
    } catch (error) {
      console.error("Error creating movie classification:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(
        `Failed to create movie classification: ${error.message}`
      );
    }
  },

  // Update an existing movie classification
  updateMovieClassification: async (id, classificationData) => {
    try {
      console.log(
        `Updating movie classification ${id} with data:`,
        classificationData
      );
      const response = await api.put(
        `/api/MovieClassification/${id}`,
        classificationData
      );
      console.log("Update movie classification response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating movie classification ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(
        `Failed to update movie classification ${id}: ${error.message}`
      );
    }
  },

  // Delete a movie classification
  deleteMovieClassification: async (id) => {
    try {
      console.log(`Deleting movie classification ${id}`);
      const response = await api.delete(`/api/MovieClassification/${id}`);
      console.log("Delete movie classification response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting movie classification ${id}:`, error);
      throw new Error(
        `Failed to delete movie classification ${id}: ${error.message}`
      );
    }
  },
};

// MovieType Services
export const movieTypeService = {
  // Get all movie types with optional filtering
  getAllMovieTypes: async (params) => {
    try {
      console.log("Fetching movie types with params:", params);
      const response = await api.get("/api/MovieType", { params });
      console.log("Movie types API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching movie types:", error);
      throw new Error(`Failed to fetch movie types: ${error.message}`);
    }
  },

  // Get a specific movie type by ID
  getMovieTypeById: async (id) => {
    try {
      console.log(`Fetching movie type with ID: ${id}`);
      const response = await api.get(`/api/MovieType/${id}`);
      console.log("Movie type details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching movie type ${id}:`, error);
      throw new Error(`Failed to fetch movie type ${id}: ${error.message}`);
    }
  },

  // Create a new movie type
  createMovieType: async (typeData) => {
    try {
      console.log("Creating movie type with data:", typeData);
      const response = await api.post("/api/MovieType", typeData);
      console.log("Create movie type response:", response);
      return response;
    } catch (error) {
      console.error("Error creating movie type:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to create movie type: ${error.message}`);
    }
  },

  // Update an existing movie type
  updateMovieType: async (id, typeData) => {
    try {
      console.log(`Updating movie type ${id} with data:`, typeData);
      const response = await api.put(`/api/MovieType/${id}`, typeData);
      console.log("Update movie type response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating movie type ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update movie type ${id}: ${error.message}`);
    }
  },

  // Delete a movie type
  deleteMovieType: async (id) => {
    try {
      console.log(`Deleting movie type ${id}`);
      const response = await api.delete(`/api/MovieType/${id}`);
      console.log("Delete movie type response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting movie type ${id}:`, error);
      throw new Error(`Failed to delete movie type ${id}: ${error.message}`);
    }
  },
};

// Language Services
export const languageService = {
  // Get all languages with optional filtering
  getAllLanguages: async (params) => {
    try {
      console.log("Fetching languages with params:", params);
      const response = await api.get("/api/Language", { params });
      console.log("Languages API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw new Error(`Failed to fetch languages: ${error.message}`);
    }
  },

  // Get a specific language by ID
  getLanguageById: async (id) => {
    try {
      console.log(`Fetching language with ID: ${id}`);
      const response = await api.get(`/api/Language/${id}`);
      console.log("Language details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching language ${id}:`, error);
      throw new Error(`Failed to fetch language ${id}: ${error.message}`);
    }
  },

  // Create a new language
  createLanguage: async (languageData) => {
    try {
      console.log("Creating language with data:", languageData);
      const response = await api.post("/api/Language", languageData);
      console.log("Create language response:", response);
      return response;
    } catch (error) {
      console.error("Error creating language:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to create language: ${error.message}`);
    }
  },

  // Update an existing language
  updateLanguage: async (id, languageData) => {
    try {
      console.log(`Updating language ${id} with data:`, languageData);
      const response = await api.put(`/api/Language/${id}`, languageData);
      console.log("Update language response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating language ${id}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update language ${id}: ${error.message}`);
    }
  },

  // Delete a language
  deleteLanguage: async (id) => {
    try {
      console.log(`Deleting language ${id}`);
      const response = await api.delete(`/api/Language/${id}`);
      console.log("Delete language response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting language ${id}:`, error);
      throw new Error(`Failed to delete language ${id}: ${error.message}`);
    }
  },
};

// Hall Services
export const snackService = {
  // Get a single snack by ID
  getSnackById: async (id) => {
    try {
      const response = await api.get(`/api/Snak/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching snack ${id}:`, error);
      throw new Error(`Failed to fetch snack ${id}: ${error.message}`);
    }
  },
  // Update a snack
  updateSnack: async (id, snackData) => {
    try {
      const response = await api.put(`/api/Snak/${id}`, snackData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Delete a snack by ID
  deleteSnack: async (id) => {
    try {
      const response = await api.delete(`/api/Snak/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Fetch snacks with optional search and pagination
  getSnacks: async (params = {}) => {
    try {
      console.log("Fetching snacks with params:", params);
      const response = await api.get("/api/Snak", { params });
      console.log("Snacks API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching snacks:", error);
      throw new Error(`Failed to fetch snacks: ${error.message}`);
    }
  },
  createSnack: async (snackData) => {
    try {
      const response = await api.post("/api/Snak", snackData);
      return response;
    } catch (error) {
      // يمكنك إضافة لوجيك الخطأ هنا إذا رغبت
      throw error;
    }
  },
};

export const hallService = {
  // Get all halls with optional filtering
  getAllHalls: async (params) => {
    try {
      console.log("Fetching halls with params:", params);
      const response = await api.get("/api/Hall", { params });
      console.log("Halls API response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching halls:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      throw new Error(`Failed to fetch halls: ${error.message}`);
    }
  },

  // Get a specific hall by ID
  getHallById: async (id) => {
    try {
      console.log(`Fetching hall with ID: ${id}`);
      const response = await api.get(`/api/Hall/${id}`);
      console.log("Hall details response:", response);
      return response;
    } catch (error) {
      console.error(`Error fetching hall ${id}:`, error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to fetch hall ${id}: ${error.message}`);
    }
  },

  // Create a new hall
  createHall: async (hallData) => {
    try {
      console.log("Creating hall with data:", hallData);
      const response = await api.post("/api/Hall", hallData);
      console.log("Create hall response:", response);
      return response;
    } catch (error) {
      console.error("Error creating hall:", error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw new Error(`Failed to create hall: ${error.message}`);
    }
  },

  // Update an existing hall
  updateHall: async (id, hallData) => {
    try {
      console.log(`Updating hall ${id} with data:`, hallData);
      const response = await api.put(`/api/Hall/${id}`, hallData);
      console.log("Update hall response:", response);
      return response;
    } catch (error) {
      console.error(`Error updating hall ${id}:`, error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to update hall ${id}: ${error.message}`);
    }
  },

  // Delete a hall
  deleteHall: async (id) => {
    try {
      console.log(`Deleting hall ${id}`);
      // إضافة retry logic
      const response = await api.delete(`/api/Hall/${id}`);
      console.log("Delete hall response:", response);
      return response;
    } catch (error) {
      console.error(`Error deleting hall ${id}:`, error);
      // طباعة تفاصيل الخطأ للتصحيح
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
        // إذا كان الخطأ 404، نعتبر أن القاعة تم حذفها بالفعل
        if (error.response.status === 404) {
          return { success: true, message: 'Hall not found (already deleted)' };
        }
      }
      
      // إضافة معلومات إضافية عن الخطأ
      const errorMessage = `Failed to delete hall ${id}: ${error.message}`;
      console.error("Full error details:", {
        message: errorMessage,
        config: error.config,
        request: error.request,
        response: error.response
      });
      
      throw new Error(errorMessage);
    }
  },

  // Helper functions for data transformation

  // Transform hall data from UI format to API format
  transformHallDataForAPI: (hallData) => {
    // إنشاء مصفوفة hallChairs بناءً على rows و columns و aisles
    const hallChairs = [];
    const rowLabels = [];

    // إنشاء تسميات الصفوف
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
        const isAisle =
          Array.isArray(hallData.aisles) && hallData.aisles.includes(seat);

        // إضافة جميع المقاعد مع تحديد isValid بناءً على ما إذا كان الكرسي ممرًا أم لا
        hallChairs.push({
          column: j.toString(),
          row: rowLabels[i],
          code: seat,
          isValid: !isAisle, // إذا كان الكرسي ممرًا، فإن isValid يكون false، وإلا يكون true
        });
      }
    }

    // تحديد ما إذا كانت القاعة VIP بناءً على نوع القاعة
    const isVip = hallData.hallType === "VIP" || hallData.hallType === "Vip";

    return {
      name: hallData.hallNumber || hallData.name || "",
      isVip: isVip,
      rowCount: hallData.rows,
      columnCount: hallData.columns,
      hallChairs: hallChairs,
    };
  },

  // Transform hall data from API format to UI format
  transformHallDataFromAPI: (apiData) => {
    if (!apiData) return null;

    console.log("Transforming hall data from API:", apiData);

    // التحقق من وجود البيانات الأساسية
    if (!apiData.id) {
      console.warn("Hall data missing ID:", apiData);
    }

    // التعامل مع تنسيقات مختلفة للبيانات
    // في بعض الحالات قد تكون البيانات مغلفة في كائن آخر
    const actualData = apiData.data ? apiData.data : apiData;

    const rowCount = actualData.rowCount || 0;
    const columnCount = actualData.columnCount || 0;

    // إنشاء تسميات الصفوف
    const rowLabels = [];
    for (let i = 0; i < rowCount; i++) {
      let label = "";
      let num = i;
      while (num >= 0) {
        label = String.fromCharCode(65 + (num % 26)) + label;
        num = Math.floor(num / 26) - 1;
      }
      rowLabels.push(label);
    }

    // استخراج الممرات (المقاعد التي لها isValid = false)
    const aisles = [];

    if (Array.isArray(actualData.hallChairs)) {
      // تجميع المقاعد التي لها isValid = false
      actualData.hallChairs.forEach((chair) => {
        if (chair.isValid === false) {
          aisles.push(`${chair.row}${chair.column}`);
        }
      });

      // التحقق من المقاعد المفقودة (غير موجودة في hallChairs)
      const existingCodes = actualData.hallChairs.map(
        (chair) => `${chair.row}${chair.column}`
      );

      // إنشاء جميع المقاعد المحتملة
      const allPossibleSeats = [];
      for (let i = 0; i < rowCount; i++) {
        for (let j = 1; j <= columnCount; j++) {
          const seat = `${rowLabels[i]}${j}`;
          allPossibleSeats.push(seat);

          // إذا كان المقعد غير موجود في hallChairs، فهو ممر
          if (!existingCodes.includes(seat)) {
            aisles.push(seat);
          }
        }
      }
    }

    const transformedData = {
      id: actualData.id || "",
      hallNumber: actualData.name || "",
      name: actualData.name || "",
      hallType: actualData.isVip ? "VIP" : "Standard",
      rows: actualData.rowCount || 0,
      columns: actualData.columnCount || 0,
      aisles: aisles,
      // حساب عدد المقاعد الظاهرة فقط (التي لها isValid = true)
      totalseats: Array.isArray(actualData.hallChairs)
        ? actualData.hallChairs.filter((chair) => chair.isValid !== false)
            .length
        : 0,
    };

    console.log("Transformed hall data for UI:", transformedData);
    return transformedData;
  },
};

// Payment Services
export const paymentService = {

  // جلب جميع الدفعات مع دعم جميع الفلاتر الممكنة
  // params: { status, PaymentStatus, UserId, BookingId, dateFrom, dateTo, ...أي باراميتر آخر يدعمه الـ API }
  getPayments: async (params = {}) => {
    /*
      يمكنك تمرير أي باراميتر متاح في الـ API مثل:
      - status أو PaymentStatus: حالة الدفع (Pending, Accepted, canceled)
      - UserId: رقم المستخدم
      - BookingId: رقم الحجز
      - dateFrom, dateTo: نطاق التاريخ
      - ... إلخ
    */
    const response = await api.get('/api/Payment', { params });
    return response.data;
  },
  // جلب تفاصيل دفع محدد
  getPaymentById: async (id) => {
    const response = await api.get(`/api/Payment/${id}`);
    return response.data;
  },
  // تحديث حالة دفع
  updatePayment: async (id, data = {}) => {
    // data: { Status, ImageId }
    const response = await api.put(`/api/Payment/${id}`, null, { params: data });
    return response.data;
  },
  // حذف دفع
  deletePayment: async (id) => {
    const response = await api.delete(`/api/Payment/${id}`);
    return response.data;
  },
};

// Pricing Services
export const pricingService = {
  // Set pricing value for a specific pricing type
  setPricingValue: async (pricingType, value) => {
    try {
      console.log(`Setting pricing for type ${pricingType} to value ${value}`);
      const response = await api.put(
        `/api/Pricing/set-pricing-value/${pricingType}`,
        null,
        {
          params: { value: value.toString() },
        }
      );
      console.log("Set pricing response:", response);
      return response;
    } catch (error) {
      console.error(`Error setting pricing for type ${pricingType}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      throw new Error(`Failed to set pricing: ${error.message}`);
    }
  },

  // Get current pricing values (if API supports it)
  getPricingValues: async () => {
    try {
      console.log("Fetching current pricing values");
      const response = await api.get("/api/Pricing");
      console.log("Get pricing response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching pricing values:", error);
      // If API doesn't support getting pricing, return empty object
      return { data: {} };
    }
  },

  // Pricing type constants
  PRICING_TYPES: {
    STANDARD_2D: 1,
    STANDARD_3D: 2,
    VIP_2D: 3,
    VIP_3D: 4,
  },

  // Helper function to get pricing type name
  getPricingTypeName: (type) => {
    const names = {
      1: "Standard 2D",
      2: "Standard 3D",
      3: "VIP 2D",
      4: "VIP 3D",
    };
    return names[type] || "Unknown";
  },
};
