import { useState } from 'react';
import { Plus, Calendar, AlignLeft, Star } from '@phosphor-icons/react';
import { Task, Category, Priority, PRIORITY_CONFIG, TaskTemplate } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TaskTemplatePicker } from '@/components/TaskTemplatePicker';
import { useI18n } from '@/contexts/I18nContext';
import { getCategoryName, getPriorityName } from '@/lib/i18n';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  categories: Category[];
  templates: TaskTemplate[];
  onQuickAdd?: () => void; // For keyboard shortcut
}

export function AddTaskForm({ onAddTask, categories, templates, onQuickAdd }: AddTaskFormProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

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
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setSelectedCategory('general');
    setSelectedPriority('medium');
    setShowAdvanced(false);
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    setTitle(template.title);
    setSelectedCategory(template.category);
    setSelectedPriority(template.priority);
    setDescription(template.description || '');
    
    // Auto-set due date for recurring templates
    if (template.isRecurring && template.recurringType) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
    
    setShowTemplates(false);
    setShowAdvanced(!!template.description);
  };

  // Quick add functionality for keyboard shortcut
  const handleQuickAdd = () => {
    onQuickAdd?.();
    // Focus the title input
    setTimeout(() => {
      const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder={t('addTaskPlaceholder')}
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
                      {getCategoryName(category.id, t)}
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
                      {getPriorityName(priority, t)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowTemplates(true)}
              className="gap-2"
              aria-label="Open templates"
            >
              <Star size={16} />
            </Button>
            
            <Button type="submit" disabled={!title.trim()}>
              <Plus size={16} />
              {t('addTask')}
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
                    {t('setDueDate')}
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
                  placeholder={t('addTaskDescription')}
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

      {/* Template Picker Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <TaskTemplatePicker
            templates={templates}
            categories={categories}
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}