import React, { useState } from 'react';

export const PublishModal = ({ onClose, onPublish, currentVersion }) => {
  const [versionType, setVersionType] = useState('patch');
  const [summary, setSummary] = useState('');
  
  // Calculate new version based on current version and selected type
  const calculateNewVersion = () => {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (versionType) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onPublish({
      version: calculateNewVersion(),
      summary,
      timestamp: new Date().toISOString()
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Publish New Version</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Version Type
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={versionType} 
              onChange={(e) => setVersionType(e.target.value)}
            >
              <option value="patch">Patch (Bug Fix)</option>
              <option value="minor">Minor (New Feature)</option>
              <option value="major">Major (Breaking Change)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Version
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              value={calculateNewVersion()} 
              disabled 
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Change Summary
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={summary} 
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Describe the changes in this version..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

