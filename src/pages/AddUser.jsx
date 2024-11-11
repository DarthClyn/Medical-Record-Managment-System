import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus, UserCog } from 'lucide-react';
import contractABI from '../contractABI.json';
import { contractAddress } from '../contractConfig';

export default function AdminPatientForm() {
  const { showSuccess, showError } = useToast();
  const [isAdminForm, setIsAdminForm] = useState(true);
  const [formValues, setFormValues] = useState({
    address: '',
    name: '',
    department: '',
    age: '',
    phoneNumber: '',
    institution: '',
    qualification: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (!ethers.utils.isAddress(formValues.address)) {
      showError('Invalid Ethereum address.');
      return false;
    }
    if (!isAdminForm && (formValues.age <= 0 || formValues.age === '')) {
      showError('Age must be a valid number.');
      return false;
    }
    if (!isAdminForm && !/^\d{10}$/.test(formValues.phoneNumber)) {
      showError('Phone number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      if (!window.ethereum) {
        showError('MetaMask is not installed.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      if (isAdminForm) {
        console.log("Attempting to add admin with details:", formValues);
        const tx = await contract.addAdmin(
          formValues.address,
          formValues.name,
          formValues.institution,
          formValues.department,
          formValues.qualification
        );
        await tx.wait();
        showSuccess('Admin added successfully!');
      } else {
        console.log("Attempting to add patient with details:", formValues);
        const tx = await contract.addPatient(
          formValues.address,
          formValues.name,
          Number(formValues.age),
          formValues.phoneNumber
        );
        await tx.wait();
        showSuccess('Patient added successfully!');
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      showError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setIsAdminForm(true)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
        >
          <UserCog className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Admin</h3>
        </button>

        <button
          onClick={() => setIsAdminForm(false)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
        >
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Patient</h3>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isAdminForm ? 'Add Administrator' : 'Add Patient'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ethereum Address"
            name="address"
            value={formValues.address}
            onChange={handleInputChange}
            placeholder="0x..."
            required
          />
          <Input
            label="Full Name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            required
          />
          {isAdminForm ? (
            <>
              <Input
                label="Department"
                name="department"
                value={formValues.department}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Institution"
                name="institution"
                value={formValues.institution}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Qualification"
                name="qualification"
                value={formValues.qualification}
                onChange={handleInputChange}
                required
              />
            </>
          ) : (
            <>
              <Input
                label="Age"
                type="number"
                name="age"
                value={formValues.age}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <Button type="submit" isLoading={loading} className="w-full">
            {loading ? 'Processing...' : isAdminForm ? 'Add Admin' : 'Add Patient'}
          </Button>
        </form>
      </div>
    </div>
  );
}
