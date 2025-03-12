import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MedicalLoadingComponent = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing analysis...');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Redirect to analysis route when loading completes
          setTimeout(() => {
            navigate('/analysis');
          }, 500); // Small delay before redirect for better UX
          return 100;
        }
        
        // Update status text based on progress
        if (prevProgress >= 90) {
          setStatusText('Finalizing results...');
        } else if (prevProgress >= 70) {
          setStatusText('Processing medical data...');
        } else if (prevProgress >= 40) {
          setStatusText('Analyzing patterns...');
        } else if (prevProgress >= 10) {
          setStatusText('Preparing datasets...');
        }
        
        return prevProgress + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    // Overlay background for popup effect
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Popup container */}
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
        <div className="w-20 h-20 mb-6">
          {/* Medical cross/caduceus animation */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#e6e6e6" 
              strokeWidth="8"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#4299e1" 
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              transform="rotate(-90 50 50)"
              className="transition-all duration-300 ease-in-out"
            />
            {/* Medical cross */}
            <rect x="45" y="30" width="10" height="40" rx="2" fill="#3182ce" />
            <rect x="30" y="45" width="40" height="10" rx="2" fill="#3182ce" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Medical Analysis</h2>
        <p className="text-gray-600 mb-4 text-center">{statusText}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">{progress}% Complete</p>
        
        {progress < 100 && (
          <div className="mt-6 text-xs text-gray-500 max-w-xs text-center">
            Please wait while we process your medical data with precision and care.
          </div>
        )}
      </div>
    </div>
  );
};

// Add this to your CSS or tailwind.config.js to enable the fadeIn animation
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }

export default MedicalLoadingComponent;