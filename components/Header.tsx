import React from 'react';

interface HeaderProps {
  onExport: () => void;
  isExportDisabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExport, isExportDisabled }) => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Professor Outreach Assistant
          </h1>
          <p className="text-center text-gray-400 mt-2 md:text-left">
            Find professors from top Indian institutes for your next big opportunity.
          </p>
        </div>
        <button
            onClick={onExport}
            disabled={isExportDisabled}
            className="hidden md:inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-700 transition-colors flex-shrink-0"
          >
             <i data-lucide="file-text" className="w-4 h-4 mr-2"></i>
            Download PDF
        </button>
      </div>
    </header>
  );
};

export default Header;