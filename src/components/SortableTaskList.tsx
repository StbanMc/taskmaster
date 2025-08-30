import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { Task, Category } from '@/lib/types';

interface SortableTaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

export function SortableTaskList({ 
  tasks, 
  categories, 
  onToggleTask, 
  onDeleteTask, 
  onReorderTasks 
}: SortableTaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCategoryById = (categoryId: string) => 
    categories.find(cat => cat.id === categoryId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = tasks.findIndex(task => task.id === active.id);
    const overIndex = tasks.findIndex(task => task.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      const reorderedTasks = [...tasks];
      const [movedTask] = reorderedTasks.splice(activeIndex, 1);
      reorderedTasks.splice(overIndex, 0, movedTask);
      
      // Update order property for all tasks
      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        order: index
      }));
      
      onReorderTasks(updatedTasks);
    }
  }

  if (tasks.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              category={getCategoryById(task.category)}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              isDragDisabled={task.completed}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}