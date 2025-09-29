import React from 'react';
import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
        pointerEvents: 'none', // Allow interaction with the page
        visibility: 'hidden', // Ensure the overlay is hidden when not needed
      }}
    >
      <div className="loading-spinner">
        <Image
          src="/assets/images/loader.svg"
          alt="Loading..."
          width={50}
          height={50}
          priority
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;