import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-200">
        Fetching Professor Details...
      </p>
      <p className="text-sm text-gray-400">This might take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;