import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../api/services';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // خيار تذكرني
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // التحقق من وجود بيانات محفوظة عند تحميل الصفحة
  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول بالفعل (يوجد توكن)، انتقل مباشرة للوحة التحكم
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
      return;
    }
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      setFormData({ emailAddress: savedEmail, password: savedPassword });
      setRememberMe(true); // تمكين خيار "تذكرني" إذا كانت البيانات محفوظة
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // التحقق من إدخال البريد الإلكتروني
    if (!formData.emailAddress) {
      setError('Email field cannot be empty');
      return;
    }

    // التحقق من صحة تنسيق البريد الإلكتروني
    if (!validateEmail(formData.emailAddress)) {
      setError('The email address is not properly formatted');
      return;
    }

    // التحقق من إدخال كلمة المرور
    if (!formData.password) {
      setError('Password field cannot be empty');
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.password.length < 6) {
      setError('Your password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        emailAddress: formData.emailAddress.trim(),
        password: formData.password
      };

      console.log('Form data state:', formData);
      console.log('Sending exact login data:', loginData);

      const response = await authService.login(loginData);
      console.log('Login response:', response);

      if (response.success) {
        // حفظ التوكن في localStorage
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userID', response.data.userID);

        // حفظ البريد الإلكتروني وكلمة المرور إذا تم تحديد "تذكرني"
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.emailAddress);
          localStorage.setItem('savedPassword', formData.password);
        } else {
          // حذف البيانات المحفوظة إذا لم يتم تحديد "تذكرني"
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        // التوجيه إلى الصفحة الرئيسية أو لوحة التحكم
        navigate('/dashboard');
      } else {
        // تحليل رسالة الخطأ من الـ API
        if (response.message === 'wrong password') {
          setError('Incorrect password. Please try again.');
        } else if (response.message === 'wrong email') {
          setError('The email address you entered is incorrect.');
        } else {
          setError(response.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error details:', {
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        error: err
      });

      // تحسين رسائل الخطأ بناءً على حالة HTTP
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === 'wrong password') {
          setError('Incorrect password. Please try again.');
        } else if (errorMessage === 'wrong email') {
          setError('The email address you entered is incorrect.');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please sign in again');
      } else if (err.response?.status === 404) {
        setError("We couldn't find an account with that email address");
      } else if (err.response?.status === 429) {
        setError('Too many sign in attempts. Please try again later');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your network');
      } else {
        setError('Something went wrong. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 my-8 flex justify-center items-center animate-fadeIn">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          className="w-full 2xl:w-1/3 gap-4 flex-colo p-8 sm:p-6 md:w-2/5 bg-dry rounded-xl border border-border shadow-sm relative"
        >
          {/* logo */}
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-1/4 h-auto object-contain mx-auto mb-3"
          />
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-lg shadow-sm flex items-center justify-center space-x-2 mb-4">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {/* Email Input */}
          <div className='text-xs w-full'>
            <label className='text-border font-semibold'>Email</label>
            <div className='relative'>
              <input
                required
                type='email'
                name='emailAddress'
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder='cinemate@gmail.com'
                className='w-full text-xs mt-2 p-4 border border-border rounded-2xl text-white bg-main'
              />
            </div>
          </div>
          {/* Password Input */}
          <div className='text-xs w-full'>
            <label className='text-border font-semibold'>Password</label>
            <div className='relative'>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='*******'
                className='w-full text-xs mt-2 p-4 border border-border rounded-2xl text-white bg-main'
              />
              <button
                type='button'
                onClick={togglePassword}
                className='absolute right-4 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <FiEyeOff className='w-5 h-5' /> : <FiEye className='w-5 h-5' />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-start mt-4">
            <label className="flex items-center text-border text cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="mr-2 accent-beige3"
              />
              Remember Me
            </label>
            {/* Forget password */}
            {/* <Link
              to="/forget-password"
              className="text-border font-semibold text-xs hover:text-beige3 ml-auto"
            >
              Forget Password?
            </Link> */}
          </div>

          {/* Added Text Between Password and Button */}
          <div className="text-xs text-center text-border mt-2 ">
            Prepared to manage the cinema? Let’s get started. 🖥️
            
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-beige3 transitions hover:bg-main hover:scale-105 flex-rows gap-2 text-white py-4 px-3 rounded-xl w-full text-xs font-semibold shadow-sm mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogIn className="text-sm" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
//   خن