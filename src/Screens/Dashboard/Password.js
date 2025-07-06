import React, { useState } from 'react'
import SideBar from './SideBar'
import { authService } from '../../api/services'
import { toast } from 'react-hot-toast'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Password() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // التعامل مع تغيير قيم الحقول
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // التحقق من صحة كلمة المرور
  const validateForm = () => {
    if (!formData.oldPassword) {
      toast.error('Please enter your current password')
      return false
    }
    if (!formData.newPassword) {
      toast.error('Please enter your new password')
      return false
    }
    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  // تغيير كلمة المرور
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      const passwordData = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      }
      console.log('Sending password data:', passwordData)
      const response = await authService.changePassword(passwordData)

      if (response.success) {
        toast.success('Password changed successfully. Please login with your new password')
        // تفريغ الحقول
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // حذف التوكن وتسجيل الخروج
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        // إعادة توجيه المستخدم لصفحة تسجيل الدخول بعد ثانيتين
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      console.log('Error response:', error.response)
      console.log('Error data:', error.response?.data)
      console.log('Full error:', error)

      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Current password is incorrect')
      } else if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again')
        // إعادة توجيه المستخدم لصفحة تسجيل الدخول
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong. Please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SideBar>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <h2 className='text-xl font-bold'>Change Password</h2>
        
        {/* كلمة المرور الحالية */}
        <div className='text-xs w-full'>
          <label className='text-border font-semibold'>Current Password</label>
          <div className='relative'>
            <input
              required
              type={showOldPassword ? 'text' : 'password'}
              name='oldPassword'
              value={formData.oldPassword}
              onChange={handleInputChange}
              placeholder='********'
              className='w-full text-xs mt-2 p-4 border border-border rounded-2xl text-white bg-main'
            />
            <button
              type='button'
              onClick={() => setShowOldPassword(!showOldPassword)}
              className='absolute right-4 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700'
            >
              {showOldPassword ? <FiEyeOff className='w-5 h-5' /> : <FiEye className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* كلمة المرور الجديدة */}
        <div className='text-xs w-full'>
          <label className='text-border font-semibold'>New Password</label>
          <div className='relative'>
            <input
              required
              type={showNewPassword ? 'text' : 'password'}
              name='newPassword'
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder='********'
              className='w-full text-xs mt-2 p-4 border border-border rounded-2xl text-white bg-main'
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-4 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700'
            >
              {showNewPassword ? <FiEyeOff className='w-5 h-5' /> : <FiEye className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* تأكيد كلمة المرور */}
        <div className='text-xs w-full'>
          <label className='text-border font-semibold'>Confirm Password</label>
          <div className='relative'>
            <input
              required
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder='********'
              className='w-full text-xs mt-2 p-4 border border-border rounded-2xl text-white bg-main'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-4 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700'
            >
              {showConfirmPassword ? <FiEyeOff className='w-5 h-5' /> : <FiEye className='w-5 h-5' />}
            </button>
          </div>
        </div>

        {/* زر تغيير كلمة المرور */}
        <div className='flex justify-end items-center my-4'>
          <button
            type="submit"
            disabled={loading}
            className='bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-6 rounded-2xl w-full sm:w-auto disabled:bg-gray-500'
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </SideBar>
  )
}

export default Password
