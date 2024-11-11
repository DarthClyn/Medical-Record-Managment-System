import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, Download, Calendar } from 'lucide-react';
import { contractAddress } from '../contractConfig';
import contractABI from '../contractABI.json';
import styled from 'styled-components';

const FetchPatientRecords = () => {
  const { showError } = useToast();
  const [patientAddress, setPatientAddress] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [previewData, setPreviewData] = useState(null);

  const fetchRecords = async (e) => {
    e.preventDefault();
    if (!ethers.utils.isAddress(patientAddress)) {
      showError('Invalid Ethereum address. Please enter a valid address.');
      return;
    }

    setLoading(true);
    setRecords([]);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Retrieve patient details
      const [name] = await contract.getPatientDetails(patientAddress);
      setPatientName(name);

      // Fetch associated record IDs
      const recordIds = await contract.getPatientRecords(patientAddress);
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
      showError('Failed to fetch records. Ensure the address belongs to a registered patient and you are connected to the correct network.');
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fetch Medical Records</h2>
        
        <form onSubmit={fetchRecords} className="mb-8">
          <div className="flex gap-4 items-end">
            <Input
              label="Patient Address"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1"
              required
            />
            <div className="flex items-end mb-4">
            <Button type="submit" isLoading={loading}>Fetch Records</Button>
          </div>
          </div>
        </form>

        {patientName && <h3 className="text-xl font-semibold mb-4">Patient: {patientName}</h3>}
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {records.length > 0 ? (
            records.map((record) => (
              <div
                key={record.recordId}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between animate-slide-up"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-medium">{record.documentName}</h4>
                  <p>Token ID: {record.recordId}</p>
                  <p>Mint Date: {record.mintDate}</p>
                  <p>Admin: {record.adminUploader.name}</p>
                  <p>Department: {record.adminUploader.department}</p>
                  <p>Institution: {record.adminUploader.institution}</p>
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
            !loading && <p className='dark:text-white'>No records found for this patient.</p>
          )}
        </div>
        {loading && <p className='dark:text-white'>Loading records...</p>}

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
