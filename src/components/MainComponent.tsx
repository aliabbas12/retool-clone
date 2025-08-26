import ComponentRow from './ComponentRow';

export default function MainComponent({ components, onUpdateComponent, onDeleteComponent, onImageUpload, onEditComponent }: any) {
  const rows: any = [];
  let currentRow: any = [];
  let rowWidth = 0;

  components.forEach((component: any) => {
    const width = component.gridColumns || 6;
    
    if (rowWidth + width > 12) {
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
        currentRow = [];
        rowWidth = 0;
      }
    }
    
    currentRow.push(component);
    rowWidth += width;
    
    if (rowWidth === 12) {
      rows.push([...currentRow]);
      currentRow = [];
      rowWidth = 0;
    }
  });
  
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return (
    <div className="w-full h-full bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {rows.length > 0 ? (
          rows.map((rowComponents: any, i: any) => (
            <ComponentRow
              key={i}
              components={rowComponents}
              onUpdateComponent={onUpdateComponent}
              onDeleteComponent={onDeleteComponent}
              onImageUpload={onImageUpload}
              onEditComponent={onEditComponent}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <h2 className="text-gray-400 text-lg mb-2">Nothing here yet</h2>
            <p className="text-gray-500">Start building by adding components from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}