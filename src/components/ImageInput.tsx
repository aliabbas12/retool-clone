import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export default function ImageInput({ imageUrl, onImageChange, onSave, onCancel }: any) {
  const [mode, setMode] = useState('url');

  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="text-blue-600" size={24} />
          <h2 className="text-lg font-semibold">Add Image</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('url')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'url'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setMode('file')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'file'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="flex-1 mb-6">
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded border"
              onError={() => alert('Failed to load image')}
            />
          </div>
        )}

        {mode === 'url' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageChange(e.target.value)}
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

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}