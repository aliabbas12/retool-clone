import React from 'react';
import { FileText, ImageIcon } from 'lucide-react';

const ColumnSelector: React.FC<any> = ({ componentType, onSelect, onCancel }) => {
  const IconComponent = componentType === 'text' ? FileText : ImageIcon;
  const title = componentType === 'text' ? 'Add Text' : 'Add Image';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex items-center gap-3 mb-6">
          <IconComponent size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onSelect(6)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-center">
              <div className="font-medium text-gray-900">Half Width</div>
              <div className="text-sm text-gray-500 mt-1">6 columns</div>
            </div>
          </button>
          
          <button
            onClick={() => onSelect(12)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-center">
              <div className="font-medium text-gray-900">Full Width</div>
              <div className="text-sm text-gray-500 mt-1">12 columns</div>
            </div>
          </button>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnSelector;