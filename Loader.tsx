
import React from 'react';

interface LoaderProps {
  mini?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ mini, text = "Loading..." }) => {
  const sizeClass = mini ? "w-8 h-8" : "w-16 h-16";
  const textSizeClass = mini ? "text-sm" : "text-lg";
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${mini ? '' : 'h-full'}`}>
      <div 
        className={`${sizeClass} border-4 border-dashed rounded-full animate-spin border-blue-500`}
        style={{borderTopColor: 'transparent'}}
      ></div>
      <p className={`mt-3 ${textSizeClass} font-medium text-gray-400`}>{text}</p>
    </div>
  );
};
