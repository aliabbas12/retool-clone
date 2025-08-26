import MarkdownRenderer from "./MarkdownRenderer";
import { FileText, ImageIcon, Edit3, X } from "lucide-react";

export default function EditableComponent({
  component,
  onDelete,
  onEdit,
}: any) {
  const startEditing = () => {
    onEdit(component);
  };

  const imageHeight = component.imageHeight === "small" ? "200px" : 
                     component.imageHeight === "medium" ? "350px" : 
                     component.imageHeight === "large" ? "500px" : "300px";

  return (
    <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors group relative">
      {component.type === "text" ? (
        <div className="h-full overflow-hidden">
          {component.content ? (
            <MarkdownRenderer>{component.content}</MarkdownRenderer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FileText size={32} className="text-gray-400 mb-2 mx-auto" />
                <div>Click to add text</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full">
          {component.imageUrl ? (
            <div className="w-full rounded-lg overflow-hidden" style={{ height: imageHeight }}>
              <img
                src={component.imageUrl}
                alt="Component"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x200?text=Image+Error";
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <ImageIcon size={32} className="text-gray-400 mb-2 mx-auto" />
                <div>Click to add image</div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={startEditing}
        className="absolute inset-0 bg-transparent hover:bg-white hover:bg-opacity-20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <Edit3 size={16} />
          Edit {component.type}
        </div>
      </button>

      <button
        onClick={() => onDelete(component.id)}
        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
      >
        <X size={16} />
      </button>
    </div>
  );
}