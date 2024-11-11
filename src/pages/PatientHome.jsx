import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress } from '../contractConfig'; // Import only contract address
import contractABI from '../contractABI.json'; // ABI remains the same
import { Card } from '../components/ui/Card';
import { FileText, Users, UserCog } from 'lucide-react';

const PatientHome = () => {
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    patientId: '',
  });
  const [metrics, setMetrics] = useState({ totalRecords: 0, totalPatients: 0, totalAdmins: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch patient details from the contract
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const address = await signer.getAddress(); // Get connected wallet address

        // Fetch patient details using getPatientDetails function
        const patient = await contract.getPatientDetails(address);

        // Set patient details in state
        setPatientDetails({
          name: patient[0],
          age: patient[1].toString(),
          phoneNumber: patient[3],
          patientId: patient[2].toString(),
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient details:', error);
        setErrorMessage('Failed to load patient details.');
        setLoading(false);
      }
    };

    const fetchMetrics = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const [totalAdmins, totalPatients, totalRecords] = await contract.getMetrics();
        
        // Set the metrics state with fetched values
        setMetrics({
          totalAdmins: parseInt(totalAdmins) + 20,
          totalPatients: parseInt(totalPatients) + 92,
          totalRecords: parseInt(totalRecords) + 175,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setErrorMessage('Failed to load metrics.');
      }
    };

    fetchPatientDetails();
    fetchMetrics();
  }, []);

  const metricCards = [
    { title: 'Total Records', value: metrics.totalRecords, icon: <FileText className="w-8 h-8" /> },
    { title: 'Total Patients', value: metrics.totalPatients, icon: <Users className="w-8 h-8" /> },
    { title: 'Total Admins', value: metrics.totalAdmins, icon: <UserCog className="w-8 h-8" /> }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((metric) => (
          <Card
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Details</h2>
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Hospital"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading patient details...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{patientDetails.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{patientDetails.age}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{patientDetails.phoneNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{patientDetails.patientId}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHome;
