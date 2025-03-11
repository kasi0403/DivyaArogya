import React from 'react';

const WobblyCircleImage = ({ imageUrl, altText }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* SVG for wobbly circle shape */}
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="wobblyCircleClip">
            <path d="M250,470 
              C360,470 470,390 470,250 
              C470,140 390,30 250,30 
              C110,30 30,110 30,250 
              C30,360 140,470 250,470 Z" 
            />
          </clipPath>
        </defs>
        
        {/* Background shape */}
        <path 
          d="M250,470 
          C360,470 470,390 470,250 
          C470,140 390,30 250,30 
          C110,30 30,110 30,250 
          C30,360 140,470 250,470 Z" 
          fill="none" 
          stroke="#e5e7eb"
          strokeWidth="2"
        />
      </svg>
      
      {/* Image overlay properly clipped */}
      <div 
        className="absolute inset-0 bg-center bg-cover" 
        style={{
          backgroundImage: `url(${imageUrl})`,
          clipPath: 'url(#wobblyCircleClip)',
          width: '100%',
          height: '100%',
        }}
        aria-label={altText}
      ></div>
    </div>
  );
};

export default WobblyCircleImage;