import React, { useState, useEffect } from 'react';
import './App.css';

export function PublisherApp() {
  const [versions, setVersions] = useState([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publishData, setPublishData] = useState({
    version: '',
    version_type: 'patch',
    change_summary: ''
  });
  
  // Mock data for development
  const mockVersions = [
    {
      id: 1,
      version: '1.2.0',
      version_type: 'minor',
      change_summary: 'Added new features and improved user interface',
      deployed_at: '2024-06-19T10:30:00Z',
      status: 'active',
      commit_hash: 'abc123def456'
    },
    {
      id: 2,
      version: '1.1.5',
      version_type: 'patch',
      change_summary: 'Fixed critical bugs and performance improvements',
      deployed_at: '2024-06-18T15:45:00Z',
      status: 'reverted',
      commit_hash: 'def456ghi789'
    },
    {
      id: 3,
      version: '1.1.0',
      version_type: 'minor',
      change_summary: 'Initial release with core functionality',
      deployed_at: '2024-06-17T09:15:00Z',
      status: 'reverted',
      commit_hash: 'ghi789jkl012'
    }
  ];
  
  // Fetch versions on component mount
  useEffect(() => {
    fetchVersions();
  }, []);
  
  // Function to fetch versions from the API
  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, use mock data since backend has issues
      setTimeout(() => {
        setVersions(mockVersions);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error fetching versions:', err);
      setError('Failed to fetch versions. Please try again.');
      setVersions(mockVersions);
      setIsLoading(false);
    }
  };
  
  // Function to handle publishing new version
  const handlePublish = async () => {
    try {
      if (!publishData.version || !publishData.change_summary) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Create new version
      const newVersion = {
        id: versions.length + 1,
        version: publishData.version,
        version_type: publishData.version_type,
        change_summary: publishData.change_summary,
        deployed_at: new Date().toISOString(),
        status: 'active',
        commit_hash: Math.random().toString(36).substring(7)
      };
      
      // Mark previous versions as reverted
      const updatedVersions = versions.map(v => ({ ...v, status: 'reverted' }));
      
      // Add new version at the top
      setVersions([newVersion, ...updatedVersions]);
      
      // Reset form and close modal
      setPublishData({ version: '', version_type: 'patch', change_summary: '' });
      setShowPublishModal(false);
      
      alert('Version published successfully!');
      
    } catch (err) {
      console.error('Error publishing version:', err);
      alert('Failed to publish version. Please try again.');
    }
  };
  
  // Function to handle reverting to a previous version
  const handleRevert = async (version) => {
    try {
      // Mark all versions as reverted
      const updatedVersions = versions.map(v => ({ ...v, status: 'reverted' }));
      
      // Mark selected version as active
      const revertedVersions = updatedVersions.map(v => 
        v.id === version.id 
          ? { ...v, status: 'active', deployed_at: new Date().toISOString() }
          : v
      );
      
      setVersions(revertedVersions);
      setShowRevertModal(false);
      setSelectedVersion(null);
      
      alert(`Successfully reverted to version ${version.version}!`);
      
    } catch (err) {
      console.error('Error reverting version:', err);
      alert('Failed to revert version. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getVersionTypeColor = (type) => {
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      case 'patch': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">TransitionMarketingAI Publisher</h1>
                <p className="text-slate-600">Manage website versions and deployments</p>
              </div>
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Publish New Version</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Staging Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Staging Preview</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">demo.transitionmarketingai.com</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-slate-600">
                      demo.transitionmarketingai.com
                    </div>
                  </div>
                  <iframe
                    src="https://demo.transitionmarketingai.com"
                    className="w-full h-96 rounded border border-slate-300"
                    title="Staging Preview"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Last updated: {formatDate(new Date().toISOString())}</span>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Open in new tab →
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Version History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Version History</h2>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-slate-600 mt-2">Loading versions...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={fetchVersions}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No versions found.</p>
                    <p className="text-slate-500 mt-2">Publish your first version to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          version.status === 'active' 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-900">v{version.version}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionTypeColor(version.version_type)}`}>
                              {version.version_type}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                            {version.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{version.change_summary}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{formatDate(version.deployed_at)}</span>
                          {version.status !== 'active' && (
                            <button
                              onClick={() => {
                                setSelectedVersion(version);
                                setShowRevertModal(true);
                              }}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Revert
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 rounded-t-xl">
              <h3 className="text-lg font-semibold text-slate-900">Publish New Version</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Version Type</label>
                <select
                  value={publishData.version_type}
                  onChange={(e) => setPublishData({ ...publishData, version_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="patch">Patch (Bug Fix)</option>
                  <option value="minor">Minor (New Feature)</option>
                  <option value="major">Major (Breaking Change)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Version</label>
                <input
                  type="text"
                  value={publishData.version}
                  onChange={(e) => setPublishData({ ...publishData, version: e.target.value })}
                  placeholder="e.g., 1.2.0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Change Summary</label>
                <textarea
                  value={publishData.change_summary}
                  onChange={(e) => setPublishData({ ...publishData, change_summary: e.target.value })}
                  placeholder="Describe the changes in this version..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Revert Modal */}
      {showRevertModal && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 rounded-t-xl">
              <h3 className="text-lg font-semibold text-slate-900">Revert to Previous Version</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to revert to version <strong>{selectedVersion.version}</strong>?
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700">{selectedVersion.change_summary}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Originally deployed: {formatDate(selectedVersion.deployed_at)}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRevertModal(false);
                  setSelectedVersion(null);
                }}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevert(selectedVersion)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                Revert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

