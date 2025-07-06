import React, { useState } from 'react';

export const Message = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="text-sm w-full">
      <label className='text-border font-semibold'>{label}</label>
      <textarea
        className="w-full h-40 mt-2 p-6 bg-main border border-border rounded-2xl"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};
export const Select =({label,options,onchange}) => {
return(
    <>
         <label className='text-border font-semibold'> {label}</label>
         <select 
         className="w-full mt-2 px-6 py-4 text-text bg-main border border-border rounded-2xl" 
         onChange={onchange}>
        {options.map((o,i) => (
        (<option key={i} value={o.value}>
        {o.title}
        </option>
        )))}
         </select>
    </>
);
};
export const Input = ({
  label,
  placeholder,
  type,
  bg,
  value,
  onChange,
  name,
  currency,
  ...rest
}) => {
    const numberInputStyles = {
        MozAppearance: 'textfield',
    };

    const webkitStyles = {
        WebkitAppearance: 'none',
        margin: 0,
    };

    return (
        <div className="w-full">
            <label className='text-border font-semibold text-sm mb-2'>{label}</label>
            <div className="relative">
                <input
                    required
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onWheel={(e) => e.target.blur()} // Prevent scroll from changing value
                    style={type === 'number' ? { ...numberInputStyles, ...webkitStyles } : {}}
                    {...rest}
                    className={`w-full text-xs p-4 ${currency ? 'pr-14' : ''} border border-border rounded-2xl text-white ${
                        bg ? 'bg-main' : 'bg-dry'
                    } ${type === 'number' || rest.inputMode === 'numeric' ? 'dir-ltr' : ''}`}
                />
                {currency && (
                    <div className="absolute top-0 right-0 h-full flex items-center pr-4 pointer-events-none">
                        <span className="text-gray-400 font-medium">{currency}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MobileInput = ({ label, placeholder, onChange }) => {
  const [countryCode, setCountryCode] = useState('+966');

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    let valid = false;

    if (countryCode === '+966') {
      valid = /^[5]\d*$/.test(input); 
    } else if (countryCode === '+963') {
      valid = /^[9]\d*$/.test(input);
    }

    if (valid || input === '') {
      onChange(input);
    }
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value); 
  };

  return (
    <div className="text-xs w-full">
      <label className="text-border font-semibold">{label}</label>
      <div className="flex items-center gap-2 bg-main border border-border rounded-2xl mt-2 p-4">
        <select
          className="bg-main  border-border text-white font-bold outline-none "
          value={countryCode}
          onChange={handleCountryCodeChange}
        >
          <option value="+966">+966 (Saudi Arabia)</option>
          <option value="+963">+963 (Syria)</option>
        </select>
        
        <input
          required
          type="text"
          placeholder={placeholder}
          onChange={handlePhoneNumberChange}
          className="w-full bg-transparent text-white text-xs outline-none"
        />
      </div>
    </div>
  );
};
