import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

function EditeEmploye({ isOpen, onClose, employe, onEdit }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (isOpen && employe) {
      setName(employe.name || '');
      setPhoneNumber(employe.phoneNumber || '');
      setEmail(employe.email || '');
      setRole(employe.role || '');
    }
  }, [isOpen, employe]);

  const handleUpdateEmployee = () => {
    if (name && phoneNumber && email && role) {
      onEdit({ ...employe, name, phoneNumber, email, role });

      onClose();
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-4 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Background overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl" onClick={onClose} />
      )}

      {/* Sidebar content */}
      <div className={`relative bg-gray-900 text-white border border-border w-[90%] md:w-[650px] lg:w-[750px] p-8 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${isOpen ? 'translate-y-0' : '-translate-y-10'}`}>
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-xl font-bold text-center w-full">Edit Employee</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-400 ml-4">
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          {/* Flexbox for input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter name"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter phone number"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter email"
              />
            </div>

            {/* Role Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 p-2 text-border">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-main text-sm"
                placeholder="Enter role"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateEmployee}
            className="w-full flex items-center justify-center gap-2 bg-beige3 hover:bg-main border border-beige3 text-white font-medium py-3 rounded-xl transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditeEmploye;
