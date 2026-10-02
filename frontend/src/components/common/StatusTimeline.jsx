import React from 'react';
import { format } from 'date-fns';

export default function StatusTimeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-gray-500">No events found.</p>;
  }

  const getStatusColor = (status) => {
    const s = String(status).toUpperCase();
    if (s.includes('APPROVE') || s.includes('VERIFIED') || s.includes('SUCCESS') || s.includes('ELIGIBLE')) return 'bg-green-500';
    if (s.includes('REJECT') || s.includes('FAIL') || s.includes('INELIGIBLE')) return 'bg-red-500';
    if (s.includes('PENDING') || s.includes('REVIEW')) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  return (
    <div className="relative border-l border-gray-200 ml-3 space-y-6 py-2">
      {events.map((event, index) => (
        <div key={index} className="relative pl-6">
          <span className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-gray-50 ${getStatusColor(event.status)}`}></span>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1 gap-2">
            <h4 className="text-sm font-medium text-gray-900 capitalize">{event.status.replace(/_/g, ' ').toLowerCase()}</h4>
            <time className="text-xs text-gray-500 shrink-0">
              {event.date ? format(new Date(event.date), 'MMM d, yyyy h:mm a') : 'Unknown Date'}
            </time>
          </div>
          <p className="text-sm text-gray-600 mb-1">{event.description}</p>
          {event.user && (
            <p className="text-xs text-gray-400">By {event.user}</p>
          )}
        </div>
      ))}
    </div>
  );
}
