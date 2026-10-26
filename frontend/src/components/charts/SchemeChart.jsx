import React from 'react';

export default function SchemeChart({ data }) {
  const schemes = Array.isArray(data)
    ? [...data].sort((left, right) => Number(right.count) - Number(left.count))
    : [];
  const maxCount = Math.max(0, ...schemes.map(scheme => Number(scheme.count) || 0));

  if (!schemes.length) {
    return <p className="py-8 text-center text-sm text-gray-500">No scheme recommendations yet.</p>;
  }

  return (
    <div className="w-full">
      <ol className="space-y-4">
        {schemes.map((scheme, index) => {
          const count = Math.max(0, Number(scheme.count) || 0);
          const width = maxCount ? (count / maxCount) * 100 : 0;
          return (
            <li key={`${scheme.name || 'scheme'}-${index}`} className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 break-words text-sm font-medium leading-5 text-gray-800 [overflow-wrap:anywhere]">
                    {scheme.name || 'Unnamed scheme'}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums text-gray-700">
                    {count.toLocaleString()}
                  </span>
                </div>
                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label={`${scheme.name || 'Unnamed scheme'} recommendations`}
                  aria-valuemin={0}
                  aria-valuemax={maxCount}
                  aria-valuenow={count}
                >
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
