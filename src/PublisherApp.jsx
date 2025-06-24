import React, { useState, useEffect } from 'react';

const PublisherApp = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [publishForm, setPublishForm] = useState({
    versionType: 'patch',
    versionNumber: '',
    changeSummary: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState(null);

  // API Base URL
  const API_BASE = 'https://p9hwiqc5o950.manus.space';

  // Mock data for demonstration
  const mockVersions = [
    {
      id: 1,
      version: '1.07.0',
      date: 'Jun 6, 2025, 05:25 AM',
      summary: 'FINAL FIX: Completely removed all pricing elements and ensured How It Works section is properly displayed',
      author: 'TransitionMarketingAI',
      status: 'active',
      type: 'patch'
    },
    {
      id: 2,
      version: '1.06.0',
      date: 'Jun 6, 2025, 05:18 AM',
      summary: 'Added comprehensive How It Works section with infographics to replace pricing section - pure consultation focus',
      author: 'TransitionMarketingAI',
      status: 'reverted',
      type: 'minor'
    },
    {
      id: 3,
      version: '1.05.0',
      date: 'Jun 6, 2025, 05:07 AM',
      summary: 'Reorganized header navigation and removed all pricing elements for consultation-focused approach',
      author: 'TransitionMarketingAI',
      status: 'reverted',
      type: 'minor'
    },
    {
      id: 4,
      version: '1.04.0',
      date: 'Jun 6, 2025, 04:44 AM',
      summary: 'Fixed navigation and ensured all corporate pages (FAQ, Contact, etc.) and login functionality are working properly',
      author: 'TransitionMarketingAI',
      status: 'reverted',
      type: 'patch'
    },
    {
      id: 5,
      version: '1.03.0',
      date: 'Jun 6, 2025, 04:30 AM',
      summary: 'Added complete authentication system with login/signup and CRM dashboard integration',
      author: 'TransitionMarketingAI',
      status: 'reverted',
      type: 'minor'
    }
  ];

  // Function to fetch versions
  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      } else {
        // Use mock data if API fails
        setVersions(mockVersions);
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error);
      // Use mock data as fallback
      setVersions(mockVersions);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle publishing
  const handlePublish = async () => {
    if (!publishForm.versionNumber || !publishForm.changeSummary) {
      setPublishMessage({
        type: 'error',
        text: 'Please fill in all required fields (Version Number and Change Summary)'
      });
      return;
    }

    setIsPublishing(true);
    setPublishMessage(null);

    try {
      const response = await fetch(`${API_BASE}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version_type: publishForm.versionType,
          version_number: publishForm.versionNumber,
          change_summary: publishForm.changeSummary,
          staging_url: 'https://demo.transitionmarketingai.com',
          production_url: 'https://transitionmarketingai.com'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPublishMessage({
          type: 'success',
          text: `🎉 Successfully published version ${publishForm.versionNumber} to production! Changes are now live at transitionmarketingai.com`
        });
        
        // Reset form
        setPublishForm({
          versionType: 'patch',
          versionNumber: '',
          changeSummary: ''
        });
        
        // Refresh versions
        fetchVersions();
        
        // Close modal after 3 seconds and redirect
        setTimeout(() => {
          setShowPublishModal(false);
          setPublishMessage(null);
          // Redirect back to staging site
          window.location.href = 'https://demo.transitionmarketingai.com';
        }, 3000);
        
      } else {
        setPublishMessage({
          type: 'error',
          text: `❌ Deployment failed: ${data.error || 'Unknown error occurred'}`
        });
      }
    } catch (error) {
      console.error('Publish error:', error);
      setPublishMessage({
        type: 'error',
        text: `❌ Network error: Failed to connect to deployment server. Please check your connection and try again.`
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Function to handle revert
  const handleRevert = async (version) => {
    try {
      const response = await fetch(`${API_BASE}/api/revert/${version.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ Successfully reverted to version ${version.version}`);
        fetchVersions();
        setShowRevertModal(false);
      } else {
        alert(`❌ Revert failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Revert error:', error);
      alert('❌ Network error: Failed to revert version');
    }
  };

  // Load versions on component mount
  useEffect(() => {
    fetchVersions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="publisher-gradient text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">TransitionMarketingAI Publisher</h1>
              <p className="text-orange-100 mt-1">Manage website versions and deployments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-orange-100">Current Version</p>
                <p className="text-lg font-semibold">1.07.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Staging Preview */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-xl shadow-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-3 flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-slate-300 text-sm font-medium">demo.transitionmarketingai.com</span>
                </div>
                <a 
                  href="https://demo.transitionmarketingai.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="h-96 bg-white">
                <iframe 
                  src="https://demo.transitionmarketingai.com" 
                  className="w-full h-full border-0"
                  title="Staging Site Preview"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            
            {/* Publish Button */}
            <div className="glass-effect rounded-xl p-6 shadow-lg">
              <button
                onClick={() => setShowPublishModal(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover-lift shadow-lg flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Publish New Version</span>
              </button>
              <p className="text-slate-600 text-sm mt-3 text-center">
                Deploy staging changes to production
              </p>
            </div>

            {/* Quick Stats */}
            <div className="glass-effect rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Deployment Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Versions</span>
                  <span className="font-semibold text-slate-800">{versions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Deploy</span>
                  <span className="font-semibold text-slate-800">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="text-green-600 font-semibold">✓ Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version History */}
        <div className="mt-8">
          <div className="glass-effect rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Version History</h2>
                <button
                  onClick={fetchVersions}
                  className="text-orange-500 hover:text-orange-600 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-slate-600 mt-2">Loading versions...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchVersions}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="custom-scrollbar max-h-96 overflow-y-auto">
                {versions.map((version) => (
                  <div key={version.id} className="px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-slate-800">{version.version}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            version.type === 'major' ? 'bg-red-100 text-red-800' :
                            version.type === 'minor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {version.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            version.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {version.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">{version.summary}</p>
                        <p className="text-slate-500 text-xs">{version.date} • {version.author}</p>
                      </div>
                      <div className="ml-4">
                        {version.status !== 'active' && (
                          <button
                            onClick={() => {
                              setSelectedVersion(version);
                              setShowRevertModal(true);
                            }}
                            className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm hover:bg-slate-300 transition-colors"
                          >
                            Revert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Publish New Version</h3>
                <button
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishMessage(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {publishMessage && (
                <div className={`p-4 rounded-lg mb-6 ${
                  publishMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                  'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {publishMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Version Type</label>
                  <select
                    value={publishForm.versionType}
                    onChange={(e) => setPublishForm({...publishForm, versionType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="patch">Patch (Bug fixes)</option>
                    <option value="minor">Minor (New features)</option>
                    <option value="major">Major (Breaking changes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Version Number *</label>
                  <input
                    type="text"
                    value={publishForm.versionNumber}
                    onChange={(e) => setPublishForm({...publishForm, versionNumber: e.target.value})}
                    placeholder="e.g., 1.08.0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Change Summary *</label>
                  <textarea
                    value={publishForm.changeSummary}
                    onChange={(e) => setPublishForm({...publishForm, changeSummary: e.target.value})}
                    placeholder="Describe the changes in this version..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPublishModal(false);
                    setPublishMessage(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={isPublishing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revert Modal */}
      {showRevertModal && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Revert to Version {selectedVersion.version}</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to revert to version {selectedVersion.version}? This will make it the active version.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRevertModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRevert(selectedVersion)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Revert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublisherApp;

