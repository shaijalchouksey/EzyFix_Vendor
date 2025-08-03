import React, { useEffect } from 'react';

const Popup = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const colorScheme = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-800',
    },
  }[type] || {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-800',
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} 
                  px-6 py-4 rounded-xl shadow-xl z-50 w-[90%] max-w-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">{message}</span>
        <button
          onClick={onClose}
          className={`${colorScheme.text} text-lg font-bold hover:opacity-70`}
        >
          
        </button>
      </div>
    </div>
  );
};

export default Popup;
