import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';
import { toast } from 'react-toastify';

/**
 * مكون حماية المصادقة - يتحقق من أن المستخدم مصادق قبل عرض المكون المحمي
 * @param {Object} props - خصائص المكون
 * @param {React.Component} props.component - المكون المراد حمايته
 * @param {Object} props.componentProps - خصائص المكون المحمي
 * @returns {React.Component} - المكون المحمي أو إعادة توجيه إلى صفحة تسجيل الدخول
 */
const AuthGuard = ({ component: Component, componentProps }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من وجود توكن المصادقة
    if (!isAuthenticated()) {
      toast.error('Please login to access this page', {
        position: 'top-center',
        autoClose: 2000,
      });
      navigate('/login');
    }
  }, [navigate]);

  // إذا كان المستخدم مصادقًا، عرض المكون المحمي
  return isAuthenticated() ? <Component {...componentProps} /> : null;
};

/**
 * دالة مساعدة لإنشاء مكون محمي بالمصادقة
 * @param {React.Component} Component - المكون المراد حمايته
 * @returns {React.Component} - المكون المحمي
 */
export const withAuth = (Component) => {
  return (props) => (
    <AuthGuard component={Component} componentProps={props} />
  );
};

export default AuthGuard;
