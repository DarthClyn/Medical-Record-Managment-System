import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Upload } from 'lucide-react';
import { pinata } from '../utils/config'; // Pinata SDK initialization
import contractABI from '../contractABI.json';
import { contractAddress } from '../contractConfig';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { HelpCircle } from 'lucide-react';

export default function UploadRecord() {
  const { showSuccess, showError } = useToast();
  const [file, setFile] = useState(null);
  const [patientAddress, setPatientAddress] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);
  const [cid, setCid] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Handle file upload
  const handleFileUpload = (selectedFile) => {
    setFile(selectedFile);
  };

  // Upload file to Pinata (IPFS)
  const handleUpload = async () => {
    if (!file || !patientAddress || !documentName) {
      alert('Please provide all required details!');
      return;
    }

    setLoadingUpload(true);
    setUploadSuccess(null);

    try {
      const uploadedFile = await pinata.upload.file(file);
      const fileCid = uploadedFile.IpfsHash;
      setCid(fileCid);
      setUploadSuccess('File uploaded to IPFS successfully. Ready to mint NFT.');
      showSuccess('File uploaded to IPFS successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadSuccess('Failed to upload file to IPFS.');
      showError('Failed to upload file to IPFS.');
    }
    setLoadingUpload(false);
  };

  // Mint the record as an NFT
  const handleMint = async () => {
    if (!cid || !patientAddress || !documentName) {
      alert('Please upload the file and provide the document name before minting.');
      return;
    }

    setLoadingMint(true);
    setUploadSuccess(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Pass CID, patient address, and document name as per the new structure
      const tx = await contract.mintRecord(cid, patientAddress, documentName);
      await tx.wait();

      setUploadSuccess(`Record minted successfully! CID: ${cid}`);
      showSuccess('Record minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      setUploadSuccess('Failed to mint the record.');
      showError('Failed to mint the record.');
    }

    setLoadingMint(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Medical Record & Mint</h2>
        
        <form className="space-y-6">
          <Input
            label="Patient Address"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
            placeholder="0x..."
            required
          />

          <Input
            label="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="X-Ray Report"
            required
          />

          <div className="relative">
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className="absolute -right-11 top-1/2 -translate-y-1/2">
              <div className="group relative">
                <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-full top-1/2 -translate-y-1/2 mr-2 w-64 p-2 bg-gray-900 text-white text-sm rounded-lg">
                  Supported formats: PDF, JPG, PNG. Max file size: 10MB.
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleUpload}
              isLoading={loadingUpload}
              className="flex-1"
              disabled={!file || !patientAddress || !documentName || loadingUpload}
            >
              {loadingUpload ? 'Uploading...' : 'Upload to IPFS'}
            </Button>

            <Button
              type="button"
              onClick={handleMint}
              isLoading={loadingMint}
              className="flex-1"
              disabled={!cid || loadingMint}
            >
              {loadingMint ? 'Minting...' : 'Mint Record as NFT'}
            </Button>
          </div>

          {uploadSuccess && (
            <p className={`mt-2 text-sm ${uploadSuccess.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {uploadSuccess}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
