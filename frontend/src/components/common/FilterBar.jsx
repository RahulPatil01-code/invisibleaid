import React from 'react';
import { Search } from 'lucide-react';

export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
      {filters.map((filter) => (
        <div key={filter.key} className="flex-1 min-w-[200px]">
          {filter.type === 'search' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={filter.label}
                value={values[filter.key] || ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          ) : filter.type === 'select' ? (
            <select
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ))}
    </div>
  );
}
