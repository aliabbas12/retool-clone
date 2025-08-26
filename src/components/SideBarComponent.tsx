import { Type, Image } from 'lucide-react';

function SideBarComponent({ onAddComponent }: any) {
  const components = [
    {
      type: 'text' as const,
      title: 'Text',
      description: 'Add text content',
      icon: Type,
      bgColor: 'bg-blue-500',
    },
    {
      type: 'image' as const,
      title: 'Image',
      description: 'Add an image',
      icon: Image,
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Components</h2>
      <div className="space-y-3">
        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => onAddComponent(component.type)}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${component.bgColor} rounded-lg flex items-center justify-center text-white`}>
                <component.icon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{component.title}</h3>
                <p className="text-sm text-gray-500">{component.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SideBarComponent;