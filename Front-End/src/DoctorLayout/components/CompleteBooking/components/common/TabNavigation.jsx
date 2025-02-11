import React from 'react';

export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-4 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg transition-all duration-200 ${activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-lg shadow-blue-100 scale-105'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
        >
          {tab.icon}
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
