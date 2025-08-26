import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export default function MarkdownRenderer({ children, className = "" }: MarkdownRendererProps) {
  return (
    <div className={className}>
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
        {children}
      </ReactMarkdown>
    </div>
  );
}