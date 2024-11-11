import { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'; 
import contractABI from '../contractABI.json';
import { contractAddress } from '../contractConfig';  // Import from contractConfig.js

const Login = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const role = await contract.getUserRole(accounts[0]);

        // Store user role in local storage
        localStorage.setItem('userRole', role);

        if (role === 'Admin') {
          navigate('/admin');
        } else if (role === 'Patient') {
          navigate('/patient');
        } else {
          setErrorMessage('Unregistered user.');
        }
      } else {
        setErrorMessage('Please install MetaMask!');
      }
    } catch (error) {
      setErrorMessage('Error connecting wallet!');
      console.error(error);
    }
};


  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80")',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Medical Records System
        </h1>
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
