
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props if needed
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const baseStyle = "block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed";
  
  return (
    <input
      className={`${baseStyle} ${className}`}
      {...props}
    />
  );
};
