import React from 'react';

export function ActionButton({ icon: Icon, label, active, onClick }) {
     return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
        ${active
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
<Icon className="h-6 w-6 mb-2 text-blue-600 " />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
