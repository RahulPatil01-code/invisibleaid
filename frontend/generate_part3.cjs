const fs = require('fs');
const path = require('path');

const files3 = {
  "src/pages/assessments/AssessmentResult.jsx": `import React from 'react';
import Navbar from '../../components/common/Navbar';

export default function AssessmentResult() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Assessment Result</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-xl font-semibold">Beneficiary: Aarav Sharma</h2>
              <p className="text-gray-500">ID: BEN-001</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-800 font-bold rounded-full text-lg">HIGH Vulnerability</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Assessment Score</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-teal-600 h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-right font-bold">85 / 100</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Why was this child identified?</h4>
            <ul className="list-disc pl-5 text-blue-700">
              <li>Low Family Income (₹12,000/mo)</li>
              <li>Large Family Size (6 members)</li>
              <li>No fixed housing</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800 font-medium">
              <strong>Disclaimer:</strong> This is a preliminary rule-based assessment and is not a legal declaration of poverty or final scheme eligibility. Final eligibility must be verified according to official government guidelines.
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <button className="bg-teal-600 text-white px-4 py-2 rounded font-medium hover:bg-teal-700">Generate Scheme Recommendations</button>
            <button className="border border-teal-600 text-teal-600 px-4 py-2 rounded font-medium hover:bg-teal-50">Print Assessment</button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  "src/pages/schemes/SchemeList.jsx": `import React from 'react';
import Navbar from '../../components/common/Navbar';
import { mockSchemes } from '../../data/mockData';

export default function SchemeList() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Government Schemes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSchemes.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-bold text-teal-700 mb-2">{s.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{s.department}</p>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{s.type}</span>
                <button className="text-teal-600 hover:underline text-sm font-medium">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`
};

Object.entries(files3).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Files 3 generated");
