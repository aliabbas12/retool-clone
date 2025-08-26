import { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  List, 
  ListOrdered,
  Quote,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface FormatAction {
  type: string;
  before: string;
  after: string;
  block?: boolean;
}

const formatActions: Record<string, FormatAction> = {
  bold: { type: 'bold', before: '**', after: '**' },
  italic: { type: 'italic', before: '*', after: '*' },
  underline: { type: 'underline', before: '<u>', after: '</u>' },
  code: { type: 'code', before: '`', after: '`' },
  quote: { type: 'quote', before: '> ', after: '', block: true },
  h1: { type: 'h1', before: '# ', after: '', block: true },
  h2: { type: 'h2', before: '## ', after: '', block: true },
  h3: { type: 'h3', before: '### ', after: '', block: true },
  list: { type: 'list', before: '- ', after: '', block: true },
  orderedList: { type: 'orderedList', before: '1. ', after: '', block: true },
};

export default function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addToHistory = useCallback((newValue: string) => {
    if (newValue !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    addToHistory(newValue);
  };

  const insertFormat = (action: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newValue: string;
    let newCursorPos: number;

    if (action.block) {
      const lines = value.split('\n');
      const startLine = value.substring(0, start).split('\n').length - 1;
      const endLine = value.substring(0, end).split('\n').length - 1;
      
      let addedChars = 0;
      
      for (let i = startLine; i <= endLine; i++) {
        const originalLine = lines[i];
        let newLine = '';
        
        if (action.type === 'orderedList') {
          const listNumber = i - startLine + 1;
          const cleanLine = originalLine.replace(/^(\d+\.\s|[-*]\s|>\s|#{1,6}\s)/, '');
          newLine = `${listNumber}. ${cleanLine}`;
        } else if (action.type === 'quote') {
          if (originalLine.startsWith('> ')) {
            newLine = originalLine.substring(2);
          } else {
            const cleanLine = originalLine.replace(/^([-*]\s|\d+\.\s|#{1,6}\s)/, '');
            newLine = `> ${cleanLine}`;
          }
        } else if (action.type.startsWith('h')) {
          const level = parseInt(action.type.substring(1));
          const prefix = '#'.repeat(level) + ' ';
          const cleanLine = originalLine.replace(/^#{1,6}\s*/, '');
          newLine = `${prefix}${cleanLine}`;
        } else if (action.type === 'list') {
          if (originalLine.startsWith('- ')) {
            newLine = originalLine.substring(2);
          } else {
            const cleanLine = originalLine.replace(/^(\d+\.\s|>\s|#{1,6}\s)/, '');
            newLine = `- ${cleanLine}`;
          }
        }
        
        if (i === startLine) {
          addedChars = newLine.length - originalLine.length;
        }
        lines[i] = newLine;
      }
      
      newValue = lines.join('\n');
      newCursorPos = start + addedChars;
    } else {
      if (selectedText) {
        newValue = value.substring(0, start) + action.before + selectedText + action.after + value.substring(end);
        newCursorPos = start + action.before.length + selectedText.length + action.after.length;
      } else {
        newValue = value.substring(0, start) + action.before + action.after + value.substring(end);
        newCursorPos = start + action.before.length;
      }
    }

    handleChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (!url) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const linkText = selectedText || 'Link text';
    
    const linkMarkdown = `[${linkText}](${url})`;
    const newValue = value.substring(0, start) + linkMarkdown + value.substring(end);
    
    handleChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + linkMarkdown.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleKeyDown = (e: any) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'b':
          e.preventDefault();
          insertFormat(formatActions.bold);
          break;
        case 'i':
          e.preventDefault();
          insertFormat(formatActions.italic);
          break;
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={14} />
            </button>
          </div>
          
          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => insertFormat(formatActions.bold)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Bold (Ctrl+B)"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.italic)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Italic (Ctrl+I)"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.underline)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Underline"
            >
              <Underline size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.code)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Inline Code"
            >
              <Code size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => insertFormat(formatActions.h1)}
              className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold"
              title="Heading 1"
            >
              <Heading1 size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.h2)}
              className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold"
              title="Heading 2"
            >
              <Heading2 size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.h3)}
              className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold"
              title="Heading 3"
            >
              <Heading3 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={() => insertFormat(formatActions.list)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Bullet List"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.orderedList)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </button>
            <button
              onClick={() => insertFormat(formatActions.quote)}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Quote"
            >
              <Quote size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2 mr-2">
            <button
              onClick={insertLink}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Insert Link"
            >
              <Link size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1.5 text-xs rounded ${
                showPreview 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {showPreview ? (
          <div className="p-4 min-h-64 max-h-96 overflow-auto bg-white">
            <div className="max-w-none">
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                  p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                  code: ({children, className}) => {
                    const isInline = !className;
                    if (isInline) {
                      return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
                    } else {
                      return (
                        <pre className="bg-gray-100 p-3 rounded overflow-x-auto mb-4">
                          <code className="text-sm font-mono">{children}</code>
                        </pre>
                      );
                    }
                  },
                  strong: ({children}) => <strong className="font-bold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  u: ({children}) => <u className="underline">{children}</u>,
                  a: ({children, href}) => <a href={href} className="text-blue-600 underline hover:text-blue-800">{children}</a>,
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-64 p-4 border-none resize-none focus:outline-none focus:ring-0 font-mono text-sm"
            placeholder={placeholder || "Start typing... Use markdown for formatting"}
          />
        )}
      </div>

      {!showPreview && (
        <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>
              Use **bold**, *italic*, `code`, # headings, - lists, &gt; quotes
            </span>
            <span>
              {value.length} characters
            </span>
          </div>
        </div>
      )}
    </div>
  );
}