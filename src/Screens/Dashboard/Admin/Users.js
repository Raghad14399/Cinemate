import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import Table2 from '../../../Components/Table2';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { authService } from '../../../api/services';
import { toast } from 'react-toastify';
import useAuthErrorHandler from '../../../hooks/useAuthErrorHandler';

function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ UserName: '', Email: '', ImageId: null });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  // تحميل المستخدمين
  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.SearchQuery = query;
      params.PageIndex = 0;
      params.PageSize = 50;
      const res = await authService.getAllUsers(params);
      setAllUsers(res.data || []);
      setUsers(res.data || []);
      console.log('Users after fetch:', res.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  // استخدام هوك معالجة أخطاء المصادقة
  const { loading: authLoading, error: authError, executeApiCall } = useAuthErrorHandler(
    "Failed to delete user. Please try again."
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  // البحث
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  // فتح نافذة التعديل
  const handleEditClick = async (user) => {
    setSelectedUser(user);
    setEditForm({
      UserName: user.fullName || '',
      Email: user.email || '',
      ImageId: user.image?.id || null,
    });
    setEditImage(null);
    setEditImagePreview(user.image && user.image.url
      ? (user.image.url.startsWith('http') ? user.image.url : `http://cinemate-001-site1.jtempurl.com/${user.image.url}`)
      : '/images/user.png');
    setEditModalOpen(true);
  };

  // رفع صورة جديدة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setEditImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // حظر/فك حظر المستخدم
  const handleBlockClick = async (user) => {
    try {
      let result;
      if (user.isBlocked) {
        result = await authService.unblockUser(user.id);
        console.log('Unblock API result:', result);
      } else {
        result = await authService.blockUser(user.id);
        console.log('Block API result:', result);
      }
      await fetchUsers(searchQuery);
    } catch (err) {
      setError('Failed to update block status');
      console.error('Block/Unblock error:', err);
    }
  };

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  // Calculate pagination when users change
  useEffect(() => {
    if (searchQuery) {
      setTotalPages(1);
      setCurrentPage(1);
    } else {
      const calculatedPages = Math.max(1, Math.ceil(users.length / usersPerPage));
      setTotalPages(calculatedPages);
      setCurrentPage(1);
    }
  }, [users.length, usersPerPage, searchQuery]);

  // Pagination functions
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Slice users for pagination
  const paginatedUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // حذف المستخدم
  const handleDeleteUser = async (user) => {
    // تحويل ID إلى رقم
    const userId = parseInt(user.id);
    setUserToDelete({ ...user, id: userId });
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    // استخدام نفس الخاصية المستخدمة في Table2
    const userId = userToDelete.id || userToDelete._id || userToDelete.userId;

    try {
      await executeApiCall(
        async () => await authService.deleteUser(userId),
        () => {
          toast.success("User deleted successfully");
          // تحديث قائمة المستخدمين مباشرة
          setAllUsers(allUsers.filter(user => user.id !== userId));
          setUsers(allUsers.filter(user => user.id !== userId));
          // تحديث القائمة من الخادم
          fetchUsers(searchQuery);
        }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  // حفظ التعديلات
  const handleSaveEdit = async () => {
    setSaving(true);
    setError('');
    try {
      let imageId = editForm.ImageId;
      // إذا تم رفع صورة جديدة، ارفعها أولاً
      if (editImage) {
        try {
          const { uploadImageToServer } = require('./AddMovie');
          imageId = await uploadImageToServer(editImage, editForm.UserName || 'User Image');
        } catch (err) {
          // fallback إذا لم تنجح الدالة الموحدة
          const formData = new FormData();
          formData.append('Image', editImage);
          formData.append('Title', editForm.UserName || 'User Image');
          formData.append('Url', '');
          const { imageService } = require('../../../api/services');
          const res = await imageService.uploadImage(formData);
          if (res?.data?.success) {
            imageId = res.data.data.id;
          }
        }
      }
      // إرسال التعديل
      // إعداد البيانات لتكون متوافقة مع متطلبات الـ API (multipart/form-data)
      const updatePayload = new FormData();
      updatePayload.append("UserName", editForm.UserName);
      // يجب إرسال الحقل باسم PhoneNubmer وليس PhoneNumber حتى لو كان فارغاً
      updatePayload.append("PhoneNubmer", "");
      if (imageId) updatePayload.append("ImageId", imageId);
      // إذا كان الحقل Email مطلوباً من الـ API يمكن إرساله أيضاً
      if (editForm.Email) updatePayload.append("Email", editForm.Email);
      await authService.updateUser(selectedUser.id, updatePayload);
      setEditModalOpen(false);
      fetchUsers(searchQuery);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SideBar>
      {/* Confirmation Dialog */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dry p-6 rounded-xl w-96 text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-6'>
        <div className="flex items-center justify-start w-3/4">
          <form
            className="text-sm bg-dry border border-border rounded-xl flex items-center gap-4 w-full shadow-md"
            onSubmit={handleSearch}
          >
            <button
              type="submit"
              className="w-10 flex-colo h-10 rounded-2xl text-border hover:bg-subMain-dark transition duration-200"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search User Name or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dry font-medium placeholder:text-border text-sm h-10 bg-lightGray rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-beige transition-all duration-300 w-full"
            />
          </form>
        </div>
        <h2 className='text-xl font-bold'> Users </h2>
        {error && <div className="text-red-500">{error}</div>}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige3"></div>
            <span className="ml-3 text-white">Loading users...</span>
          </div>
        )}

        {!loading && (
          users.length > 0 ? (
            <>
              <Table2
                data={users}
                users={true}
                onEditClick={handleEditClick}
                onBlockClick={handleBlockClick}
                onDeleteClick={handleDeleteUser}
              />
              {/* Pagination controls */}
              {!searchQuery && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex-colo px-4 py-2 rounded-lg bg-beige3 hover:bg-beige transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="mr-2" />
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg ${currentPage === page
                          ? "bg-beige text-white"
                          : "bg-beige3 hover:bg-beige transition duration-200"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex-colo px-4 py-2 rounded-lg bg-beige3 hover:bg-beige transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaChevronRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchQuery ? "No users found matching your search." : "No users available."}
              </p>
            </div>
          )
        )}
      </div>

      {/* نافذة التعديل */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center">
                <img
                  src={editImagePreview}
                  alt="User Preview"
                  className="w-24 h-24 rounded-full object-cover border mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="User Name"
                value={editForm.UserName}
                onChange={(e) => setEditForm({ ...editForm, UserName: e.target.value })}
                className="bg-dry border border-border rounded-xl px-4 py-2 text-white focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.Email}
                onChange={(e) => setEditForm({ ...editForm, Email: e.target.value })}
                className="bg-dry border border-border rounded-xl px-4 py-2 text-white focus:outline-none"
              />
              <div className="flex gap-4 justify-end mt-2">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-main hover:bg-beige3 text-white px-4 py-2 rounded-lg"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SideBar>
  );
}

export default Users;
