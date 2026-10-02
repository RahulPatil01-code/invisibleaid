import { VULNERABILITY_LEVELS, VERIFICATION_STATUSES } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const getStatusColor = (status, type = 'verification') => {
  if (type === 'verification') {
    return VERIFICATION_STATUSES[status]?.color || 'text-gray-600';
  }
  return 'text-gray-600';
};

export const getVulnerabilityColor = (level) => {
  return VULNERABILITY_LEVELS[level]?.color || 'text-gray-500';
};

export const getVulnerabilityBgColor = (level) => {
  return VULNERABILITY_LEVELS[level]?.bg || 'bg-gray-100';
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateBeneficiaryId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BEN-${year}-${randomNum}`;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const downloadCSV = (data, filename = 'data.csv') => {
  if (!data || !data.length) return;
  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','),
    ...data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
