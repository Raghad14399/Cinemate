import { toast } from "react-toastify";
import { createRoot } from "react-dom/client";
import SessionExpiryModal from "../Components/SessionExpiryModal";

// متغير لتتبع ما إذا كان تم بالفعل معالجة انتهاء الجلسة
let isHandlingSessionExpiration = false;
// متغير لتخزين عنصر DOM للنافذة المنبثقة
let modalContainer = null;
// متغير لتخزين جذر React للنافذة المنبثقة
let modalRoot = null;

/**
 * دالة مساعدة للتعامل مع انتهاء صلاحية الجلسة
 * @param {Function} navigate - دالة التنقل من react-router-dom
 */
export const handleSessionExpired = (navigate) => {
  // تجنب معالجة انتهاء الجلسة أكثر من مرة
  if (isHandlingSessionExpiration) {
    console.log("Already handling session expiration, ignoring duplicate call");
    return;
  }

  isHandlingSessionExpiration = true;
  console.log("Session expired. Redirecting to login...");

  // إنشاء عنصر DOM للنافذة المنبثقة إذا لم يكن موجودًا
  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.id = "session-expiry-modal";
    document.body.appendChild(modalContainer);
    modalRoot = createRoot(modalContainer);
  }

  // دالة لتنفيذ تسجيل الخروج
  const performLogout = () => {
    // إزالة بيانات المستخدم من التخزين المحلي
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // إزالة النافذة المنبثقة
    if (modalContainer) {
      modalRoot.unmount();
      modalContainer.remove();
      modalContainer = null;
      modalRoot = null;
    }

    // إعادة تعيين متغير تتبع معالجة انتهاء الجلسة
    isHandlingSessionExpiration = false;

    // توجيه المستخدم إلى صفحة تسجيل الدخول
    navigate("/login");
  };

  // عرض النافذة المنبثقة مع العداد التنازلي
  modalRoot.render(
    <SessionExpiryModal
      isVisible={true}
      onClose={() => {}}
      onTimeout={performLogout}
      initialSeconds={5}
    />
  );
};

/**
 * دالة مساعدة للتعامل مع أخطاء API
 * @param {Object} error - كائن الخطأ
 * @param {Function} navigate - دالة التنقل من react-router-dom
 * @param {Function} setError - دالة لتعيين رسالة الخطأ
 * @param {string} defaultErrorMessage - رسالة الخطأ الافتراضية
 * @returns {boolean} - إذا كان الخطأ متعلقًا بالمصادقة
 */
export const handleApiError = (
  error,
  navigate,
  setError,
  defaultErrorMessage = "An error occurred"
) => {
  console.error("API Error:", error);

  // التحقق مما إذا كان الخطأ متعلقًا بالمصادقة
  if (error.response && error.response.status === 401) {
    console.log("Unauthorized error caught");
    handleSessionExpired(navigate);
    return true; // تم معالجة الخطأ كخطأ مصادقة
  }

  // عرض رسالة خطأ عامة
  const errorMessage = error.message || defaultErrorMessage;
  if (setError) {
    setError(errorMessage);
  }
  toast.error(errorMessage);

  return false; // لم يتم معالجة الخطأ كخطأ مصادقة
};

/**
 * دالة مساعدة للتحقق من حالة الاستجابة
 * @param {Object} response - كائن الاستجابة
 * @param {Function} navigate - دالة التنقل من react-router-dom
 * @returns {boolean} - إذا كانت الاستجابة تحتوي على خطأ مصادقة
 */
export const checkResponseAuth = (response, navigate) => {
  if (response && response.status === 401) {
    console.log("Unauthorized response detected");
    handleSessionExpired(navigate);
    return true; // تم اكتشاف خطأ مصادقة
  }
  return false; // لم يتم اكتشاف خطأ مصادقة
};

/**
 * دالة مساعدة لإنشاء معالج أخطاء API مع حالة التحميل
 * @param {Function} setLoading - دالة لتعيين حالة التحميل
 * @param {Function} navigate - دالة التنقل من react-router-dom
 * @param {Function} setError - دالة لتعيين رسالة الخطأ
 * @param {string} defaultErrorMessage - رسالة الخطأ الافتراضية
 * @returns {Function} - دالة معالجة الخطأ
 */
export const createErrorHandler = (
  setLoading,
  navigate,
  setError,
  defaultErrorMessage
) => {
  return (error) => {
    const isAuthError = handleApiError(
      error,
      navigate,
      setError,
      defaultErrorMessage
    );
    if (!isAuthError && setLoading) {
      setLoading(false);
    }
    return isAuthError;
  };
};

/**
 * دالة مساعدة للتحقق من وجود توكن المصادقة
 * @returns {boolean} - إذا كان المستخدم مصادقًا
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * دالة مساعدة للحصول على معلومات المستخدم
 * @returns {Object|null} - معلومات المستخدم أو null إذا لم يكن مصادقًا
 */
export const getUserInfo = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};
