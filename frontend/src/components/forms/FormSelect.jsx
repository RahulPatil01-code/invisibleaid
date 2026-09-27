import React from 'react';

export default function FormSelect({ label, name, options = [], error, required, register, placeholder, ...rest }) {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <select
          id={name}
          {...(register ? register(name) : {})}
          {...rest}
          className={`block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md border ${
            error ? 'border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500'
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {safeOptions.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message || error}</p>}
    </div>
  );
}
