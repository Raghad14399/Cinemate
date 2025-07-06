import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiError, checkResponseAuth } from '../utils/authUtils';

/**
 * هوك مخصص للتعامل مع أخطاء المصادقة في الواجهات
 * @param {string} defaultErrorMessage - رسالة الخطأ الافتراضية
 * @returns {Object} - كائن يحتوي على دوال وحالات لمعالجة الأخطاء
 */
const useAuthErrorHandler = (defaultErrorMessage = "An error occurred") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * دالة لمعالجة أخطاء API
   * @param {Object} error - كائن الخطأ
   * @returns {boolean} - إذا كان الخطأ متعلقًا بالمصادقة
   */
  const handleError = useCallback((error) => {
    return handleApiError(error, navigate, setError, defaultErrorMessage);
  }, [navigate, defaultErrorMessage]);

  /**
   * دالة للتحقق من حالة الاستجابة
   * @param {Object} response - كائن الاستجابة
   * @returns {boolean} - إذا كانت الاستجابة تحتوي على خطأ مصادقة
   */
  const checkAuth = useCallback((response) => {
    return checkResponseAuth(response, navigate);
  }, [navigate]);

  /**
   * دالة مساعدة لتنفيذ طلب API مع معالجة الأخطاء
   * @param {Function} apiCall - دالة طلب API
   * @param {Function} onSuccess - دالة تنفذ عند نجاح الطلب
   * @param {boolean} keepLoadingOnSuccess - الاحتفاظ بحالة التحميل عند النجاح
   * @returns {Promise} - وعد بنتيجة الطلب
   */
  const executeApiCall = useCallback(async (apiCall, onSuccess, keepLoadingOnSuccess = false) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await apiCall();
      
      // التحقق من حالة الاستجابة
      if (checkAuth(response)) {
        return null; // تم معالجة خطأ المصادقة
      }
      
      // تنفيذ دالة النجاح إذا تم توفيرها
      if (onSuccess) {
        onSuccess(response);
      }
      
      // إيقاف حالة التحميل إذا لم يتم طلب الاحتفاظ بها
      if (!keepLoadingOnSuccess) {
        setLoading(false);
      }
      
      return response;
    } catch (error) {
      // معالجة الخطأ
      const isAuthError = handleError(error);
      
      // إيقاف حالة التحميل إذا لم يكن خطأ مصادقة
      if (!isAuthError) {
        setLoading(false);
      }
      
      return null;
    }
  }, [checkAuth, handleError]);

  return {
    loading,
    setLoading,
    error,
    setError,
    handleError,
    checkAuth,
    executeApiCall
  };
};

export default useAuthErrorHandler;
