import { useState } from 'react';
import { Plus, Calendar, AlignLeft } from '@phosphor-icons/react';
import { Task, Category, Priority, PRIORITY_CONFIG } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  categories: Category[];
}

export function AddTaskForm({ onAddTask, categories }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: title.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined
    };

    onAddTask(taskData);

    setTitle('');
    setDescription('');
    setDueDate('');
    setSelectedCategory('general');
    setSelectedPriority('medium');
    setShowAdvanced(false);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
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
        </div>

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground p-0"
            >
              <AlignLeft size={14} className="mr-2" />
              {showAdvanced ? 'Hide' : 'Add'} details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={14} />
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={today}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Add task details or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-sm min-h-[60px] resize-none"
                rows={2}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Card>
  );
}