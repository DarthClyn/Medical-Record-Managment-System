
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import PatientHome from './pages/PatientHome';
import UploadRecord from './pages/UploadRecord';
import FetchRecord from './pages/FetchRecord';
import PatientRecord from './pages/PatientRecord';
import AddUser from './pages/AddUser';
import Help from './pages/Help'; // Import the Help component
import Doc from './pages/DoctorsPage'; // Import the Doc component
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="admin" element={<AdminHome />} />
              <Route path="patient" element={<PatientHome />} />
              <Route path="upload" element={<UploadRecord />} />
              <Route path="fetch" element={<FetchRecord />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="my-record" element={<PatientRecord />} />
              <Route path="help" element={<Help />} /> 
              <Route path="doctors" element={<Doc />} /> 
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
