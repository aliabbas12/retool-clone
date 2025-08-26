import { useState } from 'react';
import { X, FileText, ImageIcon } from 'lucide-react';
import TextEditor from './TextEditor';

export default function EditSidebar({ component, onUpdate, onClose, onImageUpload }: any) {
  const [editValue, setEditValue] = useState(component.content || component.imageUrl || '');
  const [imageMode, setImageMode] = useState('url');

  const handleSave = () => {
    if (component.type === 'text') {
      onUpdate(component.id, { content: editValue });
    } else if (onImageUpload && editValue) {
      onImageUpload(component.id, editValue);
    } else {
      onUpdate(component.id, { imageUrl: editValue });
    }
    onClose();
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setEditValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {component.type === 'text' ? (
            <FileText className="text-blue-600" size={20} />
          ) : (
            <ImageIcon className="text-purple-600" size={20} />
          )}
          <h3 className="font-semibold text-gray-900">
            Edit {component.type === 'text' ? 'Text' : 'Image'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {component.type === 'text' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <TextEditor
                value={editValue}
                onChange={setEditValue}
                placeholder="Write your content here... Use markdown for rich formatting"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setImageMode('url')}
                className={`px-3 py-2 text-sm rounded ${
                  imageMode === 'url'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setImageMode('file')}
                className={`px-3 py-2 text-sm rounded ${
                  imageMode === 'file'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upload
              </button>
            </div>

            {editValue && (
              <div className="mb-4">
                <img
                  src={editValue}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                  onError={() => alert('Failed to load image')}
                />
              </div>
            )}

            {imageMode === 'url' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Choose File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}