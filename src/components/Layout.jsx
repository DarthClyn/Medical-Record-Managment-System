import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve user role from local storage
  const role = localStorage.getItem('userRole');

  // Define navigation items based on user role
  const navItems = role === 'Admin'
    ? [
        { path: '/admin', label: 'Home' },
        { path: '/upload', label: 'Upload Record' },
        { path: '/fetch', label: 'Fetch Record' },
        { path: '/add-user', label: 'Add User' },
        { path: '/doctors', label: 'Doctors' },
      ]
    : role === 'Patient'
    ? [
        { path: '/patient', label: 'Home' },
        { path: '/my-record', label: 'My Records' },
        { path: '/doctors', label: 'Doctors' },
        { path: '/help', label: 'Help' },
      ]
    : []; // No navigation items for unregistered users

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Clear the role on logout
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {navItems.length > 0 ? (
                navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <span className="text-gray-500">No navigation items available.</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <button
        onClick={toggleTheme}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-6 h-6 text-gray-800" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-400" />
        )}
      </button>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
