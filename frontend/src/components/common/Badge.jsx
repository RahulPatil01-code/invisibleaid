import React from 'react';

const variantStyles = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  teal: 'bg-teal-100 text-teal-800 border-teal-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({ text, variant = 'neutral', size = 'sm' }) {
  const baseClass = 'inline-flex items-center font-medium rounded-full border';
  return (
    <span className={`${baseClass} ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {text}
    </span>
  );
}

export function getVulnerabilityBadge(level) {
  const upperLevel = String(level).toUpperCase();
  switch (upperLevel) {
    case 'HIGH': return <Badge text="High" variant="danger" />;
    case 'MODERATE': return <Badge text="Moderate" variant="warning" />;
    case 'LOW': return <Badge text="Low" variant="success" />;
    default: return <Badge text={level || 'Unknown'} variant="neutral" />;
  }
}

export function getVerificationBadge(status) {
  const upperStatus = String(status).toUpperCase();
  switch (upperStatus) {
    case 'VERIFIED': return <Badge text="Verified" variant="success" />;
    case 'PENDING': return <Badge text="Pending" variant="warning" />;
    case 'REJECTED': return <Badge text="Rejected" variant="danger" />;
    default: return <Badge text={status || 'Unknown'} variant="neutral" />;
  }
}

export function getEligibilityBadge(status) {
  const upperStatus = String(status).toUpperCase();
  switch (upperStatus) {
    case 'ELIGIBLE': return <Badge text="Eligible" variant="success" />;
    case 'INELIGIBLE': return <Badge text="Ineligible" variant="danger" />;
    case 'NEEDS_REVIEW': return <Badge text="Needs Review" variant="warning" />;
    default: return <Badge text={status || 'Unknown'} variant="neutral" />;
  }
}

export function getApplicationBadge(status) {
  const upperStatus = String(status).toUpperCase();
  switch (upperStatus) {
    case 'APPROVED': return <Badge text="Approved" variant="success" />;
    case 'REJECTED': return <Badge text="Rejected" variant="danger" />;
    case 'PENDING': return <Badge text="Pending" variant="warning" />;
    case 'DRAFT': return <Badge text="Draft" variant="neutral" />;
    default: return <Badge text={status || 'Unknown'} variant="neutral" />;
  }
}