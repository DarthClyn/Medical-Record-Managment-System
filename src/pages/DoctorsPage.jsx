import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress } from '../contractConfig';
import contractABI from '../contractABI.json';
import { Star } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const allAdmins = await contract.getAdmins();
        const filteredDoctors = allAdmins.slice(1).map((admin) => ({
          adminId: admin.adminId.toString(),
          name: admin.name,
          qualification: admin.qualification,
          department: admin.department,
          institution: admin.institution,
          rating: Math.floor(Math.random() * 2) + 3,
        }));

        setDoctors(filteredDoctors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setErrorMessage('Failed to load doctors list.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Doctors</h2>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading doctors...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No doctors found.</p>
        ) : (
          <div className="space-y-4 max-h-296 overflow-y-auto">
            {doctors.map((doctor) => (
              <div
                key={doctor.adminId}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {doctor.name} (ID: {doctor.adminId})
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Qualification: {doctor.qualification}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Department: {doctor.department}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Institution: {doctor.institution}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-yellow-500">
                    {[...Array(doctor.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
