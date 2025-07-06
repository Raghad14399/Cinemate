import React, { useState } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";

function MultiSelect({
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select options...",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionId) => {
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];

    onChange(newSelectedValues);
  };

  const handleRemoveItem = (optionId, e) => {
    e.stopPropagation();
    const newSelectedValues = selectedValues.filter((id) => id !== optionId);
    onChange(newSelectedValues);
  };

  const getSelectedOptions = () => {
    return options.filter((option) => selectedValues.includes(option.id));
  };

  const getDisplayText = () => {
    const selected = getSelectedOptions();
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0].name || selected[0].title;
    return `${selected.length} items selected`;
  };

  return (
    <div className={`flex flex-col gap-2 text-border ${className}`}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div className="relative">
        {/* Main Select Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="w-full bg-main border border-border text-gray-400 rounded-2xl p-4 font-semibold text-sm transition-colors duration-300 hover:bg-dry hover:text-white flex items-center justify-between"
        >
          <span className="flex-1 text-left">{getDisplayText()}</span>
          <IoChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Selected Items Display */}
        {selectedValues.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {getSelectedOptions().map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-1 bg-beige3 text-white text-xs px-2 py-1 rounded-lg"
              >
                {option.name || option.title}
                <button
                  type="button"
                  onClick={(e) => handleRemoveItem(option.id, e)}
                  className="hover:bg-red-500 rounded-full p-0.5 transition-colors"
                >
                  <IoClose size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-main border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full text-left p-3 hover:bg-dry transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                    selectedValues.includes(option.id)
                      ? "bg-beige3 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.name || option.title}</span>
                    {selectedValues.includes(option.id) && (
                      <span className="text-white">✓</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default MultiSelect;
