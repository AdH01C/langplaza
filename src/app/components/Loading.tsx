import React from 'react';
import './LoadingSpinner.css';
import Image from 'next/image';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col spinner-container">
      <Image 
        src="/images/loading.jpeg" 
        alt="loading" 
        className="spinner"
        height={100}
        width={100}
        />
        <h1 className="text-4xl font-bold text-center text-black mt-64">Connecting to services...</h1>
    </div>
  );
};

export default LoadingSpinner;
