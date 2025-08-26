import { useState } from "react";
import SideBarComponent from "./components/SideBarComponent";
import PreviewModal from "./components/PreviewModal";
import ColumnSelector from "./components/ColumnSelector";
import HeightSelector from "./components/HeightSelector";
import MainComponent from "./components/MainComponent";
import EditSidebar from "./components/EditSidebar";

export interface ComponentData {
  id: string;
  type: "text" | "image";
  content?: string;
  imageUrl?: string;
  gridColumns?: number;
  imageHeight?: "small" | "medium" | "large";
}

export default function App() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingComponentType, setPendingComponentType] = useState<any>(null);
  const [showHeightSelector, setShowHeightSelector] = useState<any>(null);
  const [editingComponent, setEditingComponent] = useState<any>(null);

  const handleAddComponent = (type: any) => {
    setPendingComponentType(type);
  };

  const handleColumnSelection = (columns: any) => {
    if (!pendingComponentType) return;

    const newComponent: ComponentData = {
      id: `${pendingComponentType}_${Date.now()}`,
      type: pendingComponentType,
      gridColumns: columns,
      content: pendingComponentType === "text" ? "" : undefined,
      imageUrl: pendingComponentType === "image" ? "" : undefined,
      imageHeight: pendingComponentType === "image" ? "medium" : undefined,
    };

    setComponents((prev) => [...prev, newComponent]);
    setPendingComponentType(null);
  };

  const handleCancelSelection = () => {
    setPendingComponentType(null);
  };

  const handleImageUpload = (componentId: any, imageUrl: any) => {
    setShowHeightSelector({ imageUrl, componentId });
  };

  const handleHeightSelection = (height: any) => {
    if (!showHeightSelector) return;

    updateComponent(showHeightSelector.componentId, {
      imageUrl: showHeightSelector.imageUrl,
      imageHeight: height,
    });

    setShowHeightSelector(null);
  };

  const handleCancelHeight = () => {
    setShowHeightSelector(null);
  };

  const updateComponent = (id: any, updates: any) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp))
    );
  };

  const deleteComponent = (id: any) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showPreview ? (
        <PreviewModal
          components={components}
          onClose={() => setShowPreview(false)}
        />
      ) : (
        <div className="flex">
          <div className="w-80 bg-white shadow-lg border-r">
            <SideBarComponent onAddComponent={handleAddComponent} />
          </div>

          <div className="flex-1">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Page Builder</h1>
              <button
                onClick={() => setShowPreview(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Preview
              </button>
            </div>

            <MainComponent
              components={components}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onImageUpload={handleImageUpload}
              onEditComponent={setEditingComponent}
            />
          </div>

          {editingComponent && (
            <div className="w-96 bg-white shadow-lg border-l">
              <EditSidebar
                component={editingComponent}
                onUpdate={updateComponent}
                onClose={() => setEditingComponent(null)}
                onImageUpload={handleImageUpload}
              />
            </div>
          )}
        </div>
      )}

      {pendingComponentType && (
        <ColumnSelector
          componentType={pendingComponentType}
          onSelect={handleColumnSelection}
          onCancel={handleCancelSelection}
        />
      )}

      {showHeightSelector && (
        <HeightSelector
          onSelect={handleHeightSelection}
          onCancel={handleCancelHeight}
        />
      )}
    </div>
  );
}
