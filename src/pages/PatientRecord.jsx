import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Eye, Download, Calendar } from 'lucide-react';
import { contractAddress } from '../contractConfig';
import contractABI from '../contractABI.json';
import styled from 'styled-components';

const FetchPatientRecords = () => {
  const { showError } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchConnectedAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          fetchRecords(address);
        } catch (error) {
          showError('Failed to connect to Ethereum wallet.');
          console.error('Error fetching user address:', error);
        }
      } else {
        showError('Ethereum wallet not detected.');
      }
    };

    fetchConnectedAddress();
  }, []);

  const fetchRecords = async (address) => {
    if (!ethers.utils.isAddress(address)) {
      showError('Invalid Ethereum address.');
      return;
    }

    setLoading(true);
    setRecords([]);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Retrieve patient details
      const [name] = await contract.getPatientDetails(address);
      setPatientName(name);

      // Fetch associated record IDs
      const recordIds = await contract.getPatientRecords(address);
      if (recordIds.length === 0) {
        showError('No records found for this patient.');
        setLoading(false);
        return;
      }

      const recordsData = await Promise.all(
        recordIds.map(async (recordId) => {
          const [documentName, mintTimestamp, adminUploaderAddress] = await contract.getRecordMetadata(recordId);
          const mintDate = new Date(mintTimestamp * 1000).toLocaleString();
          
          // Fetch admin details
          const [adminName, institution, department] = await contract.getAdminDetails(adminUploaderAddress);

          // Fetch token URI for direct link
          const tokenURI = await contract.tokenURI(recordId);

          return {
            recordId: recordId.toString(),
            documentName,
            mintDate,
            adminUploader: {
              name: adminName,
              institution,
              department,
            },
            tokenURI,
          };
        })
      );

      setRecords(recordsData);
    } catch (error) {
      showError('Failed to fetch records. Ensure you are connected to the correct network.');
      console.error('Error fetching patient records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (record) => {
    setPreviewData(record);
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Patient Medical Records</h2>

        {patientName && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Patient: {patientName}
            </h3>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {records.length > 0 ? (
            records.map((record) => (
              <div
                key={record.recordId}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between animate-slide-up"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {record.documentName}
                  </h4>
                  
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                    Token ID: {record.recordId}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Admin: {record.adminUploader.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Department: {record.adminUploader.department}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Institution: {record.adminUploader.institution}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      : {record.mintDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handlePreview(record)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${record.tokenURI}`, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-500 dark:text-gray-400">No records found for this patient.</p>
          )}
        </div>

        {loading && <p className="text-gray-700 dark:text-gray-300">Loading records...</p>}

        {/* Preview Modal */}
        {previewData && (
          <PreviewOverlay onClick={closePreview}>
            <PreviewCard onClick={(e) => e.stopPropagation()}>
              <h3>{previewData.documentName}</h3>
              <iframe
                src={`https://gateway.pinata.cloud/ipfs/${previewData.tokenURI}`}
                width="100%"
                height="100%"
                title="Document Preview"
              />
              <CloseButton onClick={closePreview}>Close</CloseButton>
            </PreviewCard>
          </PreviewOverlay>
        )}
      </div>
    </div>
  );
};

// Styled Components for Preview Modal
const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PreviewCard = styled.div`
  width: 600px;
  height: 600px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export default FetchPatientRecords;
