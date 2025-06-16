
import React from 'react';
import { Loader } from './Loader';

interface InspectorPanelProps {
  content: React.ReactNode;
  isLoading?: boolean;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ content, isLoading }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-200 min-h-[200px] flex flex-col">
      <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-3 text-gray-100">Inspector</h3>
      <div className="flex-grow overflow-y-auto">
        {isLoading ? <Loader mini text="Fetching details..." /> : content || <p className="text-sm text-gray-400">No inspection data yet. Perform an action.</p>}
      </div>
    </div>
  );
};
