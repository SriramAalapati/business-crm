import React, { useEffect, useRef } from 'react';
import { FiX, FiMenu } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WidgetConfig } from '../pages/Dashboard';

interface SortableItemProps {
    widget: WidgetConfig;
    onVisibilityToggle: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ widget, onVisibilityToggle }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
                <button {...attributes} {...listeners} className="cursor-grab p-2 text-gray-500 dark:text-gray-400" aria-label={`Reorder ${widget.title}`}>
                    <FiMenu />
                </button>
                <span className="ml-2 text-gray-800 dark:text-gray-200">{widget.title}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={widget.visible} onChange={() => onVisibilityToggle(widget.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
            </label>
        </div>
    );
};


interface DashboardSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    widgets: WidgetConfig[];
    setWidgets: (widgets: WidgetConfig[]) => void;
}

const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({ isOpen, onClose, widgets, setWidgets }) => {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
      }
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = widgets.findIndex(w => w.id === active.id);
            const newIndex = widgets.findIndex(w => w.id === over.id);
            setWidgets(arrayMove(widgets, oldIndex, newIndex));
        }
    };
    
    const toggleVisibility = (id: string) => {
        setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div ref={modalRef} tabIndex={-1} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 outline-none" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customize Dashboard</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close settings"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag and drop to reorder widgets. Use the toggle to show or hide them.</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                {widgets.map(widget => (
                                    <SortableItem key={widget.id} widget={widget} onVisibilityToggle={toggleVisibility} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm">Done</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardSettingsModal;
