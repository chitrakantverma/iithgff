import React, { useState } from 'react';
import type { SearchParams } from '../types';
import { INSTITUTES, DEPARTMENTS } from '../constants';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [institute, setInstitute] = useState('');
  const [department, setDepartment] = useState('');
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institute && !department && !keyword) {
      setError('Please fill at least one field to search.');
      return;
    }
    setError('');
    onSearch({ institute, department, keyword });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-6 md:p-8 rounded-lg mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="institute" className="block text-sm font-medium text-gray-300 mb-2">
              Institute (IIT/NIT)
            </label>
            <select
              id="institute"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-white"
            >
              <option value="">Select an Institute</option>
              {INSTITUTES.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
              Branch / Department
            </label>
            <input
              type="text"
              id="department"
              list="department-suggestions"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-white"
            />
            <datalist id="department-suggestions">
                {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-2">
              Field / Keyword
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., Machine Learning"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-white"
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search Professors'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;