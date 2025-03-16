import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import { Input } from '../Components/UsedInputs';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiRefreshCcw } from 'react-icons/fi';

function ForgetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
 <div className="container mx-auto px-2 my-20 flex justify-center items-center animate-fadeIn">
 <div className="w-full 2xl:w-1/3 gap-4 flex-colo p-8 sm:p-6 md:w-2/5 bg-dry rounded-xl border border-border shadow-sm relative">
          {/* logo */}
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-1/4 h-auto object-contain mx-auto mb-3"
          />
          {/* Email Input */}
          <Input
            label="Email"
            placeholder="cinemate@gmail.com"
            type="email"
            bg={true}
          />
          {/* Password Input */}
          <div className="relative w-full">
            <Input
              label="New Password"
              placeholder="*******"
              type={showPassword ? 'text' : 'password'} 
              bg={true}
            />
            <div
              onClick={togglePassword}
              className="absolute right-5 top-1/2 transform -translate-y-1/14 cursor-pointer"
            >
              {showPassword ? (
                <FiEyeOff className="text-base text-gray-600" />
              ) : (
                <FiEye className="text-base text-gray-600" />
              )}
            </div>
          </div> 

          {/* Reset Password Button */}
          <Link
            to="/login"
            className="bg-beige3 transitions hover:bg-main hover:scale-105 flex-rows gap-2 text-white py-4 px-3 rounded-xl w-full text-xs font-semibold shadow-sm mt-5"
          >
            <FiRefreshCcw className="text-sm" /> Reset Password
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default ForgetPassword;
