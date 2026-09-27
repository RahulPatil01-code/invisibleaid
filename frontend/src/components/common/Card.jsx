import React from 'react';

const colorStyles = {
  teal: 'border-l-teal-500 bg-white text-teal-600',
  blue: 'border-l-blue-500 bg-white text-blue-600',
  red: 'border-l-red-500 bg-white text-red-600',
  amber: 'border-l-amber-500 bg-white text-amber-600',
  green: 'border-l-green-500 bg-white text-green-600',
  purple: 'border-l-purple-500 bg-white text-purple-600',
};

const iconBgStyles = {
  teal: 'bg-teal-50 text-teal-600',
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function Card({ title, value, icon: Icon, change, color = 'teal' }) {
  const borderClass = colorStyles[color]?.split(' ')[0] || 'border-l-teal-500';
  const iconBgClass = iconBgStyles[color] || 'bg-teal-50 text-teal-600';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${borderClass} p-5 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {change && (
            <p className={`text-xs mt-2 font-medium ${change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
              {change} from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBgClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
