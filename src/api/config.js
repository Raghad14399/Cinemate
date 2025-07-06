import axios from "axios";
import { toast } from "react-toastify";
import { handleSessionExpired as sharedHandleSessionExpired } from "../utils/authUtils";

const API_BASE_URL = "http://cinemate-001-site1.jtempurl.com";

// دالة مساعدة للتعامل مع انتهاء صلاحية الجلسة
const handleSessionExpired = () => {
  // استخدام الدالة المشتركة مع توفير دالة التنقل
  sharedHandleSessionExpired((path) => {
    window.location.href = path;
  });
};

// إنشاء متغير لتخزين طلب تحديث التوكن الحالي
let refreshTokenRequest = null;

// دالة لتحديث التوكن
const refreshTokenFn = async () => {
  try {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    const currentAccessToken = localStorage.getItem("token");

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/Auth/refresh-token`,
      {
        accessToken: currentAccessToken,
        refreshToken: currentRefreshToken,
      }
    );

    const { data } = response;
    if (data.success) {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      return data.data.accessToken;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    handleSessionExpired();
    throw error;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  // زيادة مهلة الانتظار الافتراضية
  timeout: 15000,
  // السماح بالمحاولة مرة أخرى في حالة فشل الاتصال
  retries: 2,
  retryDelay: 1000,
  // لا نستخدم withCredentials لتجنب مشكلة CORS
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

// إضافة معترض للاستجابة للتصحيح
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // فقط في بيئة التطوير
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.status);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for handling tokens
api.interceptors.request.use(
  (config) => {
    // فقط في بيئة التطوير
    if (process.env.NODE_ENV === "development") {
      console.log("Request Details:", {
        url: config.url,
        method: config.method,
        // عدم طباعة الهيدرز والبيانات الحساسة
        // headers: config.headers,
        // data: config.data
      });
    }

    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      // تسجيل الهيدر للتحقق
      if (process.env.NODE_ENV === "development") {
        console.log("Authorization header set:", config.headers.Authorization);
      }
    }

    // If we are sending FormData, we must let axios set the Content-Type header.
    // The global default 'application/json' would be incorrect.
    // Deleting it from the config headers allows axios to set the correct
    // 'multipart/form-data' with the required boundary.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    // التحقق من حالة الاستجابة 401 حتى في الاستجابات الناجحة
    if (response.status === 401) {
      console.log("Detected 401 status in successful response");
      handleSessionExpired();
    }
    return response;
  },
  async (error) => {
    console.log("Response error interceptor triggered:", error.message);

    // طباعة معلومات الخطأ للتصحيح
    if (error.response) {
      console.log("Error response status:", error.response.status);
    }

    const originalRequest = error.config;

    // إذا كان الخطأ 401 وليس طلب تحديث التوكن نفسه
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      console.log("Attempting to refresh token for 401 error");
      originalRequest._retry = true;

      try {
        // استخدام نفس طلب التحديث إذا كان موجوداً
        refreshTokenRequest = refreshTokenRequest || refreshTokenFn();
        const newAccessToken = await refreshTokenRequest;
        refreshTokenRequest = null;

        // تحديث التوكن في الطلب الأصلي وإعادة المحاولة
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        refreshTokenRequest = null;

        // استخدام الدالة المساعدة للتعامل مع انتهاء صلاحية الجلسة
        console.log("Calling handleSessionExpired after refresh token failure");
        handleSessionExpired();

        return Promise.reject(refreshError);
      }
    }

    // إذا كان الخطأ 401 ولم نتمكن من معالجته أعلاه
    if (error.response?.status === 401) {
      console.log("Calling handleSessionExpired for unhandled 401 error");
      handleSessionExpired();
    }

    return Promise.reject(error);
  }
);

// إضافة معترض للطلبات لإعادة المحاولة في حالة فشل الاتصال
api.interceptors.request.use(
  async (config) => {
    // إضافة معلومات إعادة المحاولة إلى التكوين
    config.retryCount = config.retryCount || 0;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // إذا لم يكن هناك تكوين، لا يمكن إعادة المحاولة
    if (
      !config ||
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      return Promise.reject(error);
    }

    // الحد الأقصى لعدد المحاولات
    const maxRetries = config.retries || api.defaults.retries || 2;

    // إذا تم تجاوز الحد الأقصى، رفض الوعد
    if (config.retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    // زيادة عداد المحاولات
    config.retryCount += 1;

    // حساب التأخير قبل إعادة المحاولة
    const delay = config.retryDelay || api.defaults.retryDelay || 1000;
    const retryDelay = delay * Math.pow(2, config.retryCount - 1);

    console.log(
      `Retrying request to ${config.url} (attempt ${config.retryCount}/${maxRetries}) after ${retryDelay}ms`
    );

    // انتظار قبل إعادة المحاولة
    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    // إعادة المحاولة
    return api(config);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // طباعة معلومات الخطأ للتصحيح
    if (process.env.NODE_ENV === "development") {
      if (error.response) {
        console.error(
          `API Error (${error.response.status}):`,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network Error:", error.message);
      } else {
        console.error("Error:", error.message);
      }
    }

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // استخدام الدالة المساعدة للتعامل مع انتهاء صلاحية الجلسة
          // لا نقوم بمعالجة الخطأ 401 هنا لأنه تم معالجته في معترض تحديث التوكن
          break;
        case 403:
          // Handle forbidden - عدم الصلاحية
          console.log("Forbidden access detected (403)");
          toast.warning("You don't have permission to access this resource", {
            position: "top-center",
            autoClose: 3000,
          });
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

// إضافة معترض استجابة أخير للتأكد من معالجة خطأ 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // التحقق من وجود خطأ 401 لم تتم معالجته
    if (error.response && error.response.status === 401) {
      // استخدام الدالة المساعدة للتعامل مع انتهاء صلاحية الجلسة
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;
