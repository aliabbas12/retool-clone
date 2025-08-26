import React, { useRef, useEffect } from 'react';
import { FileText, Bold, Italic, List } from 'lucide-react';

export default function TextArea({ 
  value, 
  onChange, 
  onSave, 
  onCancel, 
  placeholder 
}: any) {
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave();
    }
  };

  const addFormat = (format: any) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let beforeText = '';
    let afterText = '';
    let newCursorPos = start;
    
    switch (format) {
      case 'bold':
        beforeText = '**';
        afterText = '**';
        newCursorPos = start + 2;
        break;
      case 'italic':
        beforeText = '*';
        afterText = '*';
        newCursorPos = start + 1;
        break;
      case 'list':
        beforeText = '- ';
        afterText = '';
        newCursorPos = start + 2;
        break;
      default:
        return;
    }
    
    const newValue = value.substring(0, start) + beforeText + selectedText + afterText + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + beforeText.length, start + beforeText.length + selectedText.length);
      } else {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-600" size={24} />
          <h2 className="text-lg font-semibold">Edit Text</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => addFormat('bold')}
            className="p-2 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => addFormat('italic')}
            className="p-2 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => addFormat('list')}
            className="p-2 hover:bg-gray-100 rounded"
            title="List"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 mb-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-3 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder || "Write your content here...\n\nUse **bold** and *italic* formatting\nPress Ctrl+Enter to save"}
        />
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