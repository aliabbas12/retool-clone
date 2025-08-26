import React from 'react';
import { Ruler } from 'lucide-react';

interface HeightSelectorProps {
  onSelect: (height: 'small' | 'medium' | 'large') => void;
  onCancel: () => void;
}

function HeightSelector({ onSelect, onCancel }: HeightSelectorProps) {
  const heightOptions = [
    {
      value: 'small' as const,
      label: 'Small',
      height: '200px',
      description: '200px height'
    },
    {
      value: 'medium' as const,
      label: 'Medium', 
      height: '350px',
      description: '350px height'
    },
    {
      value: 'large' as const,
      label: 'Large',
      height: '500px',
      description: '500px height'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex items-center gap-3 mb-6">
          <Ruler size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Choose Height</h2>
        </div>
        
        <div className="space-y-3 mb-6">
          {heightOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
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
}

export default HeightSelector;