'use client';
import React, { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50 p-6">
      <div className='flex justify-center m-6'>
        <div className="w-2xl max-w-xl bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Resume Parser</h1>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Upload PDF Resume:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">Selected File: <span className="font-semibold">{selectedFile.name}</span></p>
            )}
          </div>
          <button
            onClick={console.log("test")}
            className={'w-full py-2 mt-4 text-white font-semibold rounded-lg transition duration-200 bg-blue-600 hover:bg-blue-700'}
          >Upload Resume
          </button>
        </div>
      </div>
    </main>
  );
}
