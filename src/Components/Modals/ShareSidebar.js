import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope } from 'react-icons/fa';

function ShareSidebar({ isOpen, onClose }) {
  const currentUrl = window.location.href; 

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-green-500 text-3xl" />,
      link: `https://wa.me/?text=Check%20this%20out!%20${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-blue-600 text-3xl" />,
      link: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="text-blue-400 text-3xl" />,
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`,
    },
    {
      name: 'Email',
      icon: <FaEnvelope className="text-beige3 text-3xl" />,
      link: `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(currentUrl)}`,
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[90%] max-w-[800px] h-[50%] p-12 rounded-3xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? 'translate-y-0' : '-translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Share This Page</h2>
          <button onClick={onClose} className="text-3xl hover:text-gray-400">
            <IoClose />
          </button>
        </div>

        {/* Share Links */}
        <div className="flex justify-center gap-10 flex-wrap">
          {shareLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl transition transform hover:scale-105"
            >
              {/* Icon container */}
              <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full">
                {link.icon}
              </div>
              <span className="text-lg font-semibold">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShareSidebar
