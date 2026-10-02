import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Info } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
  
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"><AlertTriangle className="h-6 w-6 text-red-600" /></div>;
      case 'warning':
        return <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4"><AlertTriangle className="h-6 w-6 text-amber-600" /></div>;
      case 'info':
      default:
        return <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 mb-4"><Info className="h-6 w-6 text-teal-600" /></div>;
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'info':
      default: return 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500';
    }
  };

  const footer = (
    <div className="flex justify-end gap-3 w-full">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        onClick={onClose}
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonClass()}`}
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        {confirmText}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm" footer={footer}>
      <div className="text-center sm:text-left">
        <div className="sm:flex sm:items-start sm:gap-4">
          <div className="hidden sm:block">{getIcon()}</div>
          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <div className="sm:hidden">{getIcon()}</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
