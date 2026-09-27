import React from 'react';

export default function FormTextarea({ label, name, rows = 3, error, required, register, ...rest }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <textarea
          id={name}
          rows={rows}
          {...(register ? register(name) : {})}
          {...rest}
          className={`shadow-sm block w-full sm:text-sm rounded-md py-2 px-3 border ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
          }`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message || error}</p>}
    </div>
  );
}
