import React from 'react';

interface EmptyStateProps {
  message?: string;
  isInitial: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, isInitial }) => {
  const title = isInitial ? "Ready to Find Your Mentor?" : "No Results Found";
  const defaultMessage = isInitial 
    ? "Use the form above to search for professors by institute, department, or research keywords."
    : "We couldn't find any professors matching your search criteria. Please try a different query.";
  
  return (
    <div className="text-center p-10 bg-gray-900/50 border border-gray-800 rounded-lg">
      <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="mt-2 text-xl font-medium text-white">{title}</h3>
      <p className="mt-1 text-md text-gray-400">
        {message || defaultMessage}
      </p>
    </div>
  );
};

export default EmptyState;