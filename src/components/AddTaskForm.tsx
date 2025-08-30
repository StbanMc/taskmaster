import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Task, Category, Priority, PRIORITY_CONFIG } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  categories: Category[];
}

export function AddTaskForm({ onAddTask, categories }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority
    });

    setTitle('');
    setSelectedCategory('general');
    setSelectedPriority('medium');
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-base"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.color}`} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={(value: Priority) => setSelectedPriority(value)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
              <SelectItem key={priority} value={priority}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button type="submit" disabled={!title.trim()}>
          <Plus size={16} />
          Add
        </Button>
      </form>
    </Card>
  );
}