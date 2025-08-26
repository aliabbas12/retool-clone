import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { ComponentData } from '../App';
import { Monitor, Smartphone, X, ImageIcon } from 'lucide-react';

interface PreviewModalProps {
  components: ComponentData[];
  onClose: () => void;
}

function PreviewModal({ components, onClose }: PreviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  const rows = [];
  const rowsData: ComponentData[][] = [];
  let currentRow: ComponentData[] = [];
  let currentRowWidth = 0;

  for (const component of components) {
    const componentWidth = component.gridColumns || 6;
    
    if (currentRowWidth + componentWidth > 12) {
      if (currentRow.length > 0) {
        rowsData.push([...currentRow]);
        currentRow = [];
        currentRowWidth = 0;
      }
    }
    
    currentRow.push(component);
    currentRowWidth += componentWidth;
    
    if (currentRowWidth === 12) {
      rowsData.push([...currentRow]);
      currentRow = [];
      currentRowWidth = 0;
    }
  }
  
  if (currentRow.length > 0) {
    rowsData.push(currentRow);
  }

  for (let i = 0; i < rowsData.length; i++) {
    const rowComponents = rowsData[i];
    rows.push(
      <div key={`preview-row-${i}`} className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-12'}`}>
        {rowComponents.map((component) => {
          const columnClass = isMobile ? '' : (component.gridColumns === 12 ? 'col-span-12' : 'col-span-6');
          
          return (
            <div key={component.id} className={columnClass}>
              {component.type === 'text' ? (
                <div className="bg-white h-full flex items-center">
                  <div className="w-full p-6">
                    {component.content ? (
                      <MarkdownRenderer>{component.content}</MarkdownRenderer>
                    ) : (
                      <div className="text-gray-500 italic">Empty text component</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white h-full">
                  {component.imageUrl ? (
                    <div 
                      className="w-full overflow-hidden"
                      style={{ 
                        height: component.imageHeight === 'small' ? '200px' : 
                                component.imageHeight === 'medium' ? '350px' : 
                                component.imageHeight === 'large' ? '500px' : '300px'
                      }}
                    >
                      <img
                        src={component.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/400x300?text=Image+Error';
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-full bg-gray-100 flex items-center justify-center"
                      style={{ height: '300px' }}
                    >
                      <div className="text-gray-500 text-center">
                        <ImageIcon size={32} className="mx-auto mb-2" />
                        <div>No image</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100]">
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-gray-900">Preview</h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsMobile(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md flex ${
                  !isMobile ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Monitor size={16} className="mr-1" />
                Desktop
              </button>
              <button
                onClick={() => setIsMobile(true)}
                className={`px-3 py-2 text-sm font-medium rounded-md flex ${
                  isMobile ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Smartphone size={16} className="mr-1" />
                Mobile
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className={`mx-auto ${isMobile ? 'max-w-sm' : 'max-w-6xl'}`}>
            {rows.length > 0 ? (
              rows
            ) : (
              <div className="text-center py-20 bg-white">
                <div className="text-gray-400 text-lg mb-2">Nothing to preview</div>
                <div className="text-gray-500">Add components to see them here</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;