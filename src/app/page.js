'use client';
import React, { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleParse = async () => {
    if (!selectedFile) return alert("Please select a PDF first.");

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/parse_resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      const text = data.parsed_data;

      console.log(text);
      const nameMatch = text.match(/\*\*Name:\*\*\s*(.*)/);
      const emailMatch = text.match(/\*\*Email:\*\*\s*(.*)/);
      const phoneMatch = text.match(/\*\*Phone Number:\*\*\s*(.*)/);
      const degreeMatch = text.match(/\*\*Degree:\*\*\s*(.*)/);
      const collegeMatch = text.match(/\*\*College:\*\*\s*(.*)/);
      const skillsMatch = text.match(/\*\*Skills:\*\*\s*(.*)/);

      setUserData({
        name: nameMatch ? nameMatch[1].trim() : 'Not Found',
        email: emailMatch ? emailMatch[1].trim() : 'Not Found',
        phone: phoneMatch ? phoneMatch[1].trim() : 'Not Found',
        degree: degreeMatch ? degreeMatch[1].trim() : 'Not Found',
        college: collegeMatch ? collegeMatch[1].trim() : 'Not Found',
        skills: skillsMatch ? skillsMatch[1].trim() : 'Not Found',
      });

    } catch (err) {
      console.error(err);
      alert("Error parsing resume");
    } finally {
      setLoading(false);
    }
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
            onClick={handleParse}
            disabled={loading}
            className={`w-full py-2 mt-4 text-white font-semibold rounded-lg transition duration-200 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Parsing...' : 'Parse Resume'}
          </button>
        </div>
      </div>
      <div>
        {userData && (
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 shadow-xl rounded-2xl max-w-xl mx-auto">
            <h2 className="font-extrabold text-gray-950 mb-2 text-2xl">Extracted Details:</h2>
            <div className="text-gray-800 text-base leading-relaxed">
              {console.log(userData)}
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Name: </span> {userData.name}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Email: </span> {userData.email}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Phone: </span> {userData.phone}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Degree: </span> {userData.degree}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">College: </span> {userData.college}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Skills: </span> {userData.skills}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
