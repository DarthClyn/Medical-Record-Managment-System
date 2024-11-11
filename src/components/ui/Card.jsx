import React from 'react';

export function Card({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center">
      <div className="mr-4 text-blue-500 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}