import React, { useState } from 'react';

const Help = () => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('A support partner will contact you soon!');
    setAddress('');
    setPhoneNumber('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Help Center</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Self-Troubleshooting Options</h2>
        <p className="text-gray-700 dark:text-gray-300">If you are experiencing issues, please check the following:</p>
        <ul className="list-disc list-inside mb-4">
          <li className="text-gray-700 dark:text-gray-300">Ensure your wallet is connected correctly.</li>
          <li className="text-gray-700 dark:text-gray-300">Check if you have the latest version of MetaMask installed.</li>
          <li className="text-gray-700 dark:text-gray-300">Verify your internet connection.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">How IPFS Record Storage Works</h2>
        <p className="text-gray-700 dark:text-gray-300">IPFS (InterPlanetary File System) is a distributed file storage protocol that allows you to store records securely. Each record is stored in a decentralized manner, ensuring redundancy and availability.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">How to Download or View Documents</h2>
        <p className="text-gray-700 dark:text-gray-300">To download or view your documents:</p>
        <ul className="list-disc list-inside mb-4">
          <li className="text-gray-700 dark:text-gray-300">Navigate to your records section.</li>
          <li className="text-gray-700 dark:text-gray-300">Click on the document link to open it in a new tab.</li>
          <li className="text-gray-700 dark:text-gray-300">Use the download button to save it locally.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Whom to Contact for Further Support</h2>
        <p className="text-gray-700 dark:text-gray-300">If you need further assistance, please fill out the form below, and our support team will reach out to you shortly.</p>
      </section>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="address">Patient Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Enter your address"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Enter your phone number"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
          Submit
        </button>
      </form>

      {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default Help;
