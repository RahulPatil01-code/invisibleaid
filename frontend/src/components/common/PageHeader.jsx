import React from 'react';

export default function PageHeader({ title, subtitle, actions = [] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const baseClass = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
            
            let variantClass = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-teal-500";
            if (action.variant === 'primary') {
              variantClass = "bg-teal-600 border border-transparent text-white hover:bg-teal-700 focus:ring-teal-500";
            } else if (action.variant === 'danger') {
              variantClass = "bg-red-600 border border-transparent text-white hover:bg-red-700 focus:ring-red-500";
            } else if (action.variant === 'secondary') {
              variantClass = "bg-blue-600 border border-transparent text-white hover:bg-blue-700 focus:ring-blue-500";
            }

            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`${baseClass} ${variantClass}`}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden="true" />}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
