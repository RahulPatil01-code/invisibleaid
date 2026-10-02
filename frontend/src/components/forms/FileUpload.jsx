import React, { useCallback } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function FileUpload({ label, accept, onFileSelect, error, currentFile }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md relative cursor-pointer hover:bg-gray-50 transition-colors ${error ? 'border-red-300' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-upload-${label}`).click()}
      >
        <div className="space-y-1 text-center">
          {currentFile ? (
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-2 text-teal-600 font-medium">
                  <span className="truncate max-w-[200px]">{currentFile.name}</span>
                  <button type="button" onClick={removeFile} className="p-1 hover:bg-teal-50 rounded-full" aria-label="Remove file">
                    <X className="h-4 w-4" />
                  </button>
               </div>
               <p className="text-xs text-gray-500 mt-2">Click or drag to replace</p>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                  Upload a file
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {accept ? `Accepted formats: ${accept}` : 'Any file type'}
              </p>
            </>
          )}
        </div>
        <input
          id={`file-upload-${label}`}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleChange}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
