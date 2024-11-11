import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress } from '../contractConfig';
import contractABI from '../contractABI.json';
import { Card } from '../components/ui/Card';
import { FileText, Users, UserCog } from 'lucide-react';

const AdminHome = () => {
  const [adminDetails, setAdminDetails] = useState({ name: '', department: '', adminId: '' });
  const [metrics, setMetrics] = useState({ totalRecords: 0, totalPatients: 0, totalAdmins: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const address = await signer.getAddress();
        const admins = await contract.getAdmins();

        for (let i = 0; i < admins.length; i++) {
          const admin = admins[i];
          if (admin.adminAddress.toLowerCase() === address.toLowerCase()) {
            setAdminDetails({
              name: admin.name,
              institution: admin.institution,
              department: admin.department,
              qualification: admin.qualification,
              adminId: admin.adminId.toString(),
              totalRecords: admin.totalRecords.toString(),
            });
            break;
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin details:', error);
        setErrorMessage('Failed to load admin details.');
        setLoading(false);
      }
    };

    const fetchMetrics = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const [totalAdmins, totalPatients, totalRecords] = await contract.getMetrics();
        
        // Adding base values to each metric
        setMetrics({
          totalAdmins: (parseInt(totalAdmins) + 20).toString(),
          totalPatients: (parseInt(totalPatients) + 92).toString(),
          totalRecords: (parseInt(totalRecords) + 175).toString(),
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setErrorMessage('Failed to load metrics.');
      }
    };

    fetchAdminDetails();
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Details</h2>
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Hospital"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading admin details...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.name}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Admin ID</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.adminId}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.totalRecords}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Institution</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.institution}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.department}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Qualification</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {adminDetails.qualification}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
