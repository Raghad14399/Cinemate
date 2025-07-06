import React from "react";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pt-12 transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-40 rounded-2xl"
          onClick={onClose}
        />
      )}

      {/* Modal content */}
      <div
        className={`relative bg-gray-900 text-white border border-border w-[80%] md:w-[400px] lg:w-[450px] p-6 rounded-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-bold text-center w-full">
            {title || "Confirm Delete"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-400 ml-4"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                <MdDelete className="text-red-500 text-3xl" />
              </div>
            </div>
            <p className="text-gray-300">
              {message || "Are you sure you want to delete this item?"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              This action cannot be undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 border border-red-600 text-white font-medium rounded-xl transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
