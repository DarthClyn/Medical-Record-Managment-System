# Medical Record Management System - User Manual

## 1. Clone the Repository and Initial Setup

1. **Clone the Repository**
   - Open a terminal and clone the repository using:
     ```bash
     git clone https://github.com/DarthClyn/Medical-Record-Managment-System.git
     cd Medical-Record-Managment-System
     ```

2. **Install Node.js**
   - If Node.js is not installed, download it from [Node.js official website](https://nodejs.org/).
   - Follow installation steps and verify installation by running:
     ```bash
     node -v
     npm -v
     ```

3. **Install Project Dependencies**
   - Inside the project folder, run the following to install required dependencies:
     ```bash
     npm install
     ```

4. **Run the Application**
   - Start the Vite development server:
     ```bash
     npm run dev
     ```
   - Open the application in your browser at the URL shown (usually `http://localhost:3000`).

---

## 2. Setting Up MetaMask Wallet and Accounts

1. **Install MetaMask**
   - Download and install MetaMask from [MetaMask's official website](https://metamask.io/).
   - Set up a wallet if you haven't already, and save your secret recovery phrase securely.

2. **Create Accounts in MetaMask**
   - Create three accounts within MetaMask:
     - **Master Admin** (for contract deployment and managing admins)
     - **Admin** (for uploading records)
     - **Patient** (to view their records)

3. **Connect MetaMask to Localhost (Optional)**
   - For development, connect MetaMask to a local blockchain (e.g., using Ganache) or use a test network like Rinkeby.

---

## 3. Deploying the Smart Contract Using Remix

1. **Open Remix IDE**
   - Go to [Remix Ethereum IDE](https://remix.ethereum.org/).

2. **Create a New Contract**
   - In the Remix IDE, create a new file (e.g., `MedicalRecord.sol`) and paste your smart contract code.

3. **Compile the Contract**
   - Use the Solidity compiler to compile the contract.

4. **Deploy the Contract**
   - In the "Deploy & Run Transactions" panel:
     - Select the account set up as **Master Admin** in MetaMask.
     - Deploy the contract to your selected network.
   - **Save the Contract Address** and **ABI** from the deployed contract for use in the application.

---

## 4. Configuring the Application with Contract Address and ABI

1. **Add Contract Address**
   - Open the `contractConfig.js` file and update `contractAddress` with the address from Remix:
     ```javascript
     export const contractAddress = "YOUR_CONTRACT_ADDRESS";
     ```

2. **Add Contract ABI**
   - In the `contractABI.json` file, paste the ABI obtained from Remix.

---

## 5. Using the Application

### Master Admin Actions

1. **Add an Admin**
   - Log in as the Master Admin account in MetaMask.
   - Navigate to the "Admin" section.
   - Use the "Add Admin" form to enter details for a new admin (name, department, qualification, etc.).

2. **View Admins, Patients, and Records**
   - Go to the "Home" page to view statistics such as the total number of admins, patients, and records.

3. **Doctor List**
   - The "Doctors" page shows all registered doctors except the master admin, with ratings and qualifications displayed.

---

### Admin Actions

1. **Login and Upload Records**
   - Log in to the application as an admin account.
   - Go to the "Patient Records" page, enter patient information, and upload medical records.
   - Specify the patient’s Ethereum address and upload the record details.

2. **View and Download Records**
   - Go to the "Records" page to view records you've uploaded.
   - Click the "eye" icon to preview a record or the "download" icon to save a copy.

---

### Patient Actions

1. **View Personal Details and Medical Records**
   - Log in to the application as a patient account.
   - Access the "Patient Home" page to see personal details, including name and Ethereum address.
   - Go to "Patient Records" to view your own records.

2. **View Doctor List**
   - On the "Doctors" page, view all doctors and their qualifications.

---

### General Application Navigation

- **Home Page**: Overview of current metrics (total admins, patients, records).
- **Patient Records**: View patient records as an admin or a patient.
- **Doctors**: View the list of doctors with details like department, institution, and rating.
- **Help Center**: Access application usage guidelines and support information.

--- 

## 6. Common Troubleshooting Tips

- **MetaMask Not Detected**: Ensure MetaMask is installed and the correct network is selected.
- **Smart Contract Errors**: Check if you are on the correct network and using the latest contract address and ABI.
- **Record Not Displayed**: Ensure the record is uploaded by the correct admin and associated with the correct patient address.

---

## 7. Summary of Application Features

1. **User Roles**: Three roles with distinct permissions:
   - **Master Admin**: Can add new admins and view all records.
   - **Admin**: Can upload patient records.
   - **Patient**: Can view their own records.

2. **Record Management**: Securely upload and store medical records on the blockchain.
3. **Doctor Directory**: View a list of doctors with their qualifications.
4. **Help Center**: In-app guidelines for managing accounts and records.

---

## 8. Security and Maintenance

- **Secure Private Keys**: Ensure private keys for all MetaMask accounts are stored securely.
- **Contract Address and ABI Updates**: If the contract is redeployed, update `contractConfig.js` and `contractABI.json`.
- **Dependencies**: Regularly update dependencies for security patches using:
  ```bash
  npm update
