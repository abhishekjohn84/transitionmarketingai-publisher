import React, { useState, useEffect } from 'react';
import './App.css';
import { VersionHistoryTable } from './components/VersionHistoryTable';
import { PublishModal } from './components/PublishModal';
import { RevertModal } from './components/RevertModal';

export function PublisherApp() {
  const [versions, setVersions] = useState([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API Base URL
  const API_BASE = 'https://vgh0i1cj33x7.manus.space/api';
  
  // Fetch versions on component mount
  useEffect(() => {
    fetchVersions();
  }, []);
  
  // Function to fetch versions from the API
  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/versions`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setVersions(data.versions || []);
      } else {
        throw new Error(data.error || 'Failed to fetch versions');
      }
    } catch (err) {
      console.error('Error fetching versions:', err);
      setError('Failed to fetch versions. Please try again.');
      
      // For development, use mock data
      setVersions([
        {
          id: '1',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          summary: 'Initial release',
          author: 'TransitionMarketingAI'
        },
        {
          id: '2',
          version: '1.1.0',
          timestamp: new Date().toISOString(),
          summary: 'Added new features and fixed bugs',
          author: 'TransitionMarketingAI'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle publishing new version
  const handlePublish = async (versionData) => {
    try {
      const response = await fetch(`${API_BASE}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish version');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the version list
        fetchVersions();
        
        // Show success message
        alert('Version published successfully!');
      } else {
        throw new Error(data.error || 'Failed to publish version');
      }
    } catch (err) {
      console.error('Error publishing version:', err);
      alert('Failed to publish version. Please try again.');
      
      // For development, add the new version to the local state
      const newVersion = {
        id: String(versions.length + 1),
        ...versionData,
        author: 'TransitionMarketingAI'
      };
      
      setVersions([newVersion, ...versions]);
    }
  };
  
  // Function to handle reverting to a previous version
  const handleRevert = async (version) => {
    try {
      const response = await fetch(`${API_BASE}/versions/${version.id}/revert`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to revert version');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the version list
        fetchVersions();
        
        // Show success message
        alert(`Successfully reverted to version ${version.version}!`);
      } else {
        throw new Error(data.error || 'Failed to revert version');
      }
    } catch (err) {
      console.error('Error reverting version:', err);
      alert('Failed to revert version. Please try again.');
      
      // For development, simulate a successful revert
      alert(`Simulated revert to version ${version.version} successful!`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TransitionMarketingAI Publisher</h1>
              <p className="text-gray-600">Manage website versions and deployments</p>
            </div>
            <button
              onClick={() => setShowPublishModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Publish New Version
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Version History</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading versions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchVersions}
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No versions found.</p>
              <p className="text-gray-500 mt-2">Publish your first version to get started.</p>
            </div>
          ) : (
            <VersionHistoryTable
              versions={versions}
              onRevert={(version) => {
                setSelectedVersion(version);
                setShowRevertModal(true);
              }}
            />
          )}
        </div>
      </main>
      
      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          onPublish={handlePublish}
          currentVersion={versions[0]?.version || '0.0.0'}
        />
      )}
      
      {/* Revert Modal */}
      {showRevertModal && selectedVersion && (
        <RevertModal
          version={selectedVersion}
          onClose={() => {
            setShowRevertModal(false);
            setSelectedVersion(null);
          }}
          onRevert={() => {
            handleRevert(selectedVersion);
            setShowRevertModal(false);
            setSelectedVersion(null);
          }}
        />
      )}
    </div>
  );
}

