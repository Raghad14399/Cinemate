import React, { useEffect } from "react";
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from "react-icons/io5";

function TemporaryModal({ type = "success", message, isVisible, onClose, duration = 2000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircle className="text-green-500 text-4xl" />;
      case "error":
        return <IoCloseCircle className="text-red-500 text-4xl" />;
      case "info":
        return <IoInformationCircle className="text-blue-500 text-4xl" />;
      default:
        return <IoCheckmarkCircle className="text-green-500 text-4xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500 bg-opacity-10 border-green-500";
      case "error":
        return "bg-red-500 bg-opacity-10 border-red-500";
      case "info":
        return "bg-blue-500 bg-opacity-10 border-blue-500";
      default:
        return "bg-green-500 bg-opacity-10 border-green-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative p-6 rounded-xl border ${getBgColor()} bg-gray-900 text-white shadow-lg max-w-md mx-auto text-center`}>
        <div className="flex flex-col items-center">
          <div className="mb-4">{getIcon()}</div>
          <h3 className="text-xl font-bold mb-2">
            {type === "success" ? "Success" : type === "error" ? "Error" : "Information"}
          </h3>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default TemporaryModal;
