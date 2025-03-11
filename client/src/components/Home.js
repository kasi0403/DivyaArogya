import React from 'react'; 
import './Home.css';
import WobblyCircleImage from './image';

const Home = () => {
  const features = [
    {
      title: "Medication Reminders",
      description: "Never miss a dose with timely medication reminders and easy tracking.",
      imageUrl: "remind.jpg"
    },
    {
      title: "Medical Diagnosis",
      description : "Upload PDFs and get summarized report with risk prediction",
      imageUrl:"diag.jpg"
    },
    {
      title: "Health Monitoring",
      description: "Track vital signs and health metrics with easy-to-read charts and trends.",
      imageUrl: "monit.jpg"
    },
    {
      title: "Emergency Alerts",
      description: "Quick access to emergency contacts and services when needed.",
      imageUrl: "alert.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <WobblyCircleImage 
                imageUrl="https://i.pinimg.com/736x/3b/09/79/3b097973192f91d1c4c79d464162e2e3.jpg" 
                altText="Senior using Divya Arogya" 
              />
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                Divya Arogya
              </h1>
              <p className="mt-3 text-xl text-gray-500">
                A smart health companion designed specifically for seniors to monitor health, manage medications, and connect with caregivers.
              </p>
              <div className="mt-8">
                <a href="#features" className="px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Features Designed for Seniors</h2>
            <p className="mt-4 max-w-2xl text-xl text-white mx-auto">
              Divya Arogya makes health management simple and accessible for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48">
                  <img 
                    src={feature.imageUrl} 
                    alt={feature.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
