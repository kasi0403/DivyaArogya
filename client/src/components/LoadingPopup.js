import React, { useState, useEffect } from 'react';

const LoadingPopup = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const stages = [
    { name: "Reading PDF", icon: "📄" },
    { name: "Analyzing Data", icon: "🔍" },
    { name: "Generating Response", icon: "💬" }
  ];

  // Simulate progression through stages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        // Stay on the last stage
        if (prev === stages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000); // Move to next stage every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-md">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Processing Your Document</h3>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Stages */}
          <div className="w-full space-y-4">
            {stages.map((stage, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 
                  ${index < currentStage ? 'bg-green-100 text-green-600' : 
                    index === currentStage ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                    'bg-gray-100 text-gray-400'}`}>
                  {index < currentStage ? '✓' : stage.icon}
                </div>
                <span className={`${index === currentStage ? 'font-medium text-blue-600' : 
                  index < currentStage ? 'text-green-600' : 'text-gray-500'}`}>
                  {stage.name}
                </span>
                {index === currentStage && (
                  <div className="ml-auto flex space-x-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 mt-6 text-center">
            Please wait while we process your document. This may take a moment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;