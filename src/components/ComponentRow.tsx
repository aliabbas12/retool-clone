import EditableComponent from './EditableComponent';

export default function ComponentRow({ components, onUpdateComponent, onDeleteComponent, onImageUpload, onEditComponent }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[200px] p-4">
      <div className="grid grid-cols-12 gap-4 h-full">
        {components.map((component: any) => {
          const span = component.gridColumns === 12 ? 'col-span-12' : 'col-span-6';
          
          return (
            <div key={component.id} className={`${span} min-h-[150px]`}>
              <EditableComponent
                component={component}
                onUpdate={onUpdateComponent}
                onDelete={onDeleteComponent}
                onImageUpload={onImageUpload}
                onEdit={onEditComponent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}