'use client';
import React, { useState } from 'react';

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userDatas, setUserDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleParse = async () => {
    if (!selectedFiles.length) return alert("Please select at least one PDF");
  
    setLoading(true);
    setUserDatas([]);
  
    try {
      const parsedResults = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            const formData = new FormData();
            formData.append('file', file);
            for (let [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
            }
            const res = await fetch(process.env.NEXT_PUBLIC_FASTAPI_RUNNING_URL, {
              method: 'POST',
              body: formData,
            });
  
            const data = await res.json();

            const text = data.parsed_data;
  
            const nameMatch = text.match(/\*\*Name:\*\*\s*(.*)/);
            const emailMatch = text.match(/\*\*Email:\*\*\s*(.*)/);
            const phoneMatch = text.match(/\*\*Phone Number:\*\*\s*(.*)/);
            const degreeMatch = text.match(/\*\*Degree:\*\*\s*(.*)/);
            const collegeMatch = text.match(/\*\*College:\*\*\s*(.*)/);
            const skillsMatch = text.match(/\*\*Skills:\*\*\s*(.*)/);
  
            return {
              filename: file.name,
              name: nameMatch ? nameMatch[1].trim() : 'Not Found',
              email: emailMatch ? emailMatch[1].trim() : 'Not Found',
              phone: phoneMatch ? phoneMatch[1].trim() : 'Not Found',
              degree: degreeMatch ? degreeMatch[1].trim() : 'Not Found',
              college: collegeMatch ? collegeMatch[1].trim() : 'Not Found',
              skills: skillsMatch ? skillsMatch[1].trim() : 'Not Found',
            };
          } catch (error) {
            console.error(`Failed to parse ${file.name}:`, error);
            return {
              filename: file.name,
              name: 'Error',
              email: 'Error',
              phone: 'Error',
              degree: 'Error',
              college: 'Error',
              skills: 'Error',
            };
          }
        })
      );
  
      setUserDatas(parsedResults);
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
            <label className="block text-gray-700 font-medium mb-2">Upload PDF Resumes:</label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {selectedFiles.length > 0 && (
                selectedFiles.map((file, index) => (
                  <p key={index} className="text-gray-700 font-medium">{file.name}</p>
                ))
            )}
          </div>

          <button
            onClick={handleParse}
            disabled={loading}
            className={`w-full py-2 mt-4 text-white font-semibold rounded-lg transition duration-200 ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Parsing...' : 'Parse Resumes'}
          </button>
        </div>
      </div>

      <div className="space-y-6 flex gap-2 flex-row flex-wrap flex-lg-column justify-center">
        {userDatas.map((userData, index) => (
          <div key={index} className="p-4 bg-gray-50 border border-gray-200 shadow-xl rounded-2xl w-full sm:w-[48%] xl:w-[30%] max-w-xl">
            <h2 className="font-extrabold text-gray-950 mb-2 text-2xl">File: {userData.filename}</h2>
            <div className="text-gray-800 text-base leading-relaxed">
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Name:</span> {userData.name}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Email:</span> {userData.email}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Phone:</span> {userData.phone}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Degree:</span> {userData.degree}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">College:</span> {userData.college}</p>
              <p className='p-1'><span className="font-extrabold text-gray-950 text-xl">Skills:</span> {userData.skills}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
