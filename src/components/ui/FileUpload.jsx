import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export function FileUpload({ onFileSelect, accept = '*', error }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name); // Set the file name for display
      onFileSelect(file); // Call the parent function with the selected file
    } else {
      setFileName(''); // Reset file name if no file is selected
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          {fileName && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{fileName}</p>}
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
