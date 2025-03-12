import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MedicalLoadingComponent from './MedicalLoadingComponent';
import axios from "axios"

const PatientDashboard = () => {
  const navigate = useNavigate();
  // Hardcoded patient data
  const patient = {
    name: 'Jane Smith',
    gender: 'Male',
    age: '45',
    bloodType: 'O+'
  };

  // Initial hardcoded vitals data
  const [vitals, setVitals] = useState({
    bp: [
      { date: '2025-01-15', value: 120 },
      { date: '2025-02-01', value: 125 },
      { date: '2025-02-15', value: 118 },
      { date: '2025-03-01', value: 130 },
      { date: '2025-03-10', value: 122 }
    ],
    sugar: [
      { date: '2025-01-15', value: 110 },
      { date: '2025-02-01', value: 115 },
      { date: '2025-02-15', value: 108 },
      { date: '2025-03-01', value: 120 },
      { date: '2025-03-10', value: 112 }
    ]
  });

  // Form input state
  const [newReading, setNewReading] = useState({
    date: '',
    bp: '',
    sugar: ''
  });

  // Previous reports data
  const [reports, setReports] = useState([
    // { id: 1, name: 'Annual Check-up Report', date: '2025-01-15', type: 'PDF' },
    // { id: 2, name: 'Blood Work Analysis', date: '2025-02-01', type: 'PDF' },
    // { id: 3, name: 'Cardiology Evaluation', date: '2025-03-01', type: 'DOCX' }
  ]);

  // Handle new vital reading input
  const handleReadingChange = (e) => {
    const { name, value } = e.target;
    setNewReading(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkAbnormalities = async () => {
    const { bp, sugar } = newReading;
    const highBP = bp > 140;
    const lowBP = bp < 90;
    const highSugar = sugar > 200;
    const lowSugar = sugar < 70;

    if (highBP || lowBP || highSugar || lowSugar) {
      let alertMessage = `🚨 ALERT: Abnormal vital signs detected for ${patient.name}! \n`;

      if (highBP) alertMessage += `High BP: ${bp} mmHg. `;
      if (lowBP) alertMessage += `Low BP: ${bp} mmHg. `;
      if (highSugar) alertMessage += `High Blood Sugar: ${sugar} mg/dL. `;
      if (lowSugar) alertMessage += `Low Blood Sugar: ${sugar} mg/dL. `;

      alertMessage += "Please check immediately.";

      try {
        const response = await axios.post('http://localhost:5000/api/send-notification', {
            message: alertMessage
        });

        console.log("Notification sent:", response.data);
      } catch (error) {
        console.error("Error sending notification:", error.response ? error.response.data : error.message);
      }
    }
  };

  // Add a new vital reading
  const addReading = (e) => {
    e.preventDefault();
    
    // Create new entries
    const bpEntry = {
      date: newReading.date,
      value: parseInt(newReading.bp)
    };
    
    const sugarEntry = {
      date: newReading.date,
      value: parseInt(newReading.sugar)
    };
    
    // Update vitals with new readings
    setVitals(prev => ({
      bp: [...prev.bp, bpEntry].sort((a, b) => new Date(a.date) - new Date(b.date)),
      sugar: [...prev.sugar, sugarEntry].sort((a, b) => new Date(a.date) - new Date(b.date))
    }));
    // checkAbnormalities();
    // Reset form
    setNewReading({
      date: '',
      bp: '',
      sugar: ''
    });
  };

  const handleUpload = (e) => {
    navigate("/loading")
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const newReport = {
        id: reports.length + 1,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        type: file.name.split('.').pop().toUpperCase()
      };
      
      setReports([...reports, newReport]);
      
      // Reset file input
      e.target.value = null;
    }
  };

  // Analyze vitals
  const analyzeVitals = () => {
    if (vitals.bp.length === 0) return null;
    
    const bpValues = vitals.bp.map(reading => reading.value);
    const sugarValues = vitals.sugar.map(reading => reading.value);
    
    const avgBP = bpValues.reduce((sum, val) => sum + val, 0) / bpValues.length;
    const avgSugar = sugarValues.reduce((sum, val) => sum + val, 0) / sugarValues.length;
    
    const latestBP = bpValues[bpValues.length - 1];
    const latestSugar = sugarValues[sugarValues.length - 1];
    
    const bpTrend = latestBP > avgBP ? "increasing" : latestBP < avgBP ? "decreasing" : "stable";
    const sugarTrend = latestSugar > avgSugar ? "increasing" : latestSugar < avgSugar ? "decreasing" : "stable";
    
    const bpStatus = latestBP > 140 ? "high" : latestBP < 90 ? "low" : "normal";
    const sugarStatus = latestSugar > 180 ? "high" : latestSugar < 70 ? "low" : "normal";
    
    return {
      bp: { avg: avgBP.toFixed(0), latest: latestBP, trend: bpTrend, status: bpStatus },
      sugar: { avg: avgSugar.toFixed(0), latest: latestSugar, trend: sugarTrend, status: sugarStatus }
    };
  };

  const analysis = analyzeVitals();

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Patient Info Header */}
      <div className="mt-20 bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-600">Patient Name</p>
            </div>
          </div>
          
          <div className="flex items-center mb-2 md:mb-0">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              {patient.gender === 'Female' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <line x1="12" y1="21" x2="12" y2="15"></line>
                  <line x1="9" y1="18" x2="15" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="5"></circle>
                  <line x1="12" y1="22" x2="12" y2="10"></line>
                  <line x1="15" y1="14" x2="9" y2="14"></line>
                </svg>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{patient.gender}</h2>
              <p className="text-gray-600">Gender</p>
            </div>
          </div>

          <div className="flex items-center mb-2 md:mb-0">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l3 8 4-16 3 8h4"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{patient.age}</h2>
              <p className="text-gray-600">Patient Age</p>
            </div>
          </div>

          <div className="flex items-center mb-2 md:mb-0">
            <div className="bg-blue-500 p-4 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{patient.bloodType}</h2>
              <p className="text-gray-600">Blood Type</p>
            </div>
          </div>

        </div>
      </div>

      {/* Time range selector */}
      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-l-lg">Today</button>
        <button className="bg-gray-200 px-4 py-2">7d</button>
        <button className="bg-gray-200 px-4 py-2">2w</button>
        <button className="bg-gray-200 px-4 py-2">1m</button>
        <button className="bg-gray-200 px-4 py-2">3m</button>
        <button className="bg-gray-200 px-4 py-2">6m</button>
        <button className="bg-gray-200 px-4 py-2 rounded-r-lg">1y</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BP Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 p-3 rounded-full text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">BP Levels</h2>
              <p className="text-gray-600">Recent {vitals.bp.length} visits</p>
            </div>
          </div>

          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitals.bp}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ef4444" fill="#fee2e2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Readings table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {vitals.bp.slice(-5).reverse().map((reading, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{reading.date}</td>
                    <td className="py-2 text-right">{reading.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {analysis && (
            <div className="mt-4 p-3 rounded bg-red-50 border border-red-200">
              <p>
                <span className="font-semibold">Analysis:</span> BP is {analysis.bp.status} 
                ({analysis.bp.latest} mmHg) and {analysis.bp.trend} compared to average 
                ({analysis.bp.avg} mmHg)
              </p>
            </div>
          )}
        </div>

        {/* Sugar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
                <circle cx="12" cy="10" r="3"></circle>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Sugar Levels</h2>
              <p className="text-gray-600">Recent {vitals.sugar.length} visits</p>
            </div>
          </div>

          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitals.sugar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" fill="#dbeafe" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Readings table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {vitals.sugar.slice(-5).reverse().map((reading, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{reading.date}</td>
                    <td className="py-2 text-right">{reading.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {analysis && (
            <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200">
              <p>
                <span className="font-semibold">Analysis:</span> Sugar is {analysis.sugar.status} 
                ({analysis.sugar.latest} mg/dL) and {analysis.sugar.trend} compared to average 
                ({analysis.sugar.avg} mg/dL)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Reading Form */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Vital Signs</h2>
        <form onSubmit={addReading}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                name="date" 
                value={newReading.date} 
                onChange={handleReadingChange}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Blood Pressure (mmHg)</label>
              <input 
                type="number" 
                name="bp" 
                value={newReading.bp} 
                onChange={handleReadingChange}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Blood Sugar (mg/dL)</label>
              <input 
                type="number" 
                name="sugar" 
                value={newReading.sugar} 
                onChange={handleReadingChange}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Reading
          </button>
        </form>
      </div>

      {/* Previous Reports Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Previous Reports</h2>
          <div>
            <label htmlFor="fileUpload" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
              Upload Report
            </label>
            <input 
              id="fileUpload"
              type="file" 
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        </div>
        
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Report Name</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b">
                    <td className="py-2 px-4">{report.name}</td>
                    <td className="py-2 px-4">{report.date}</td>
                    <td className="py-2 px-4">{report.type}</td>
                    <td className="py-2 px-4">
                      <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={handleUpload}>Analyze</button>
                      <button className="text-gray-500 hover:text-gray-700">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">No reports available</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;