import { useState } from 'react';
import { Task, TaskTemplate, Category, Priority } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookmarkSimple, Plus, Clock, Repeat } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TemplateManagerProps {
  templates: TaskTemplate[];
  onUpdateTemplates: (templates: TaskTemplate[]) => void;
  categories: Category[];
  selectedTask?: Task; // Optional task to create template from
}

export const TemplateManager = ({
  templates,
  onUpdateTemplates,
  categories,
  selectedTask
}: TemplateManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: selectedTask?.title || '',
    description: selectedTask?.description || '',
    category: selectedTask?.category || 'general',
    priority: selectedTask?.priority || 'medium' as Priority,
    estimatedDuration: 30,
    isRecurring: false,
    recurringType: 'daily' as 'daily' | 'weekly' | 'monthly',
    tags: ''
  });

  const handleSaveTemplate = () => {
    if (!formData.title.trim()) return;

    const newTemplate: TaskTemplate = {
      id: 'custom-' + Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      priority: formData.priority,
      estimatedDuration: formData.estimatedDuration,
      isRecurring: formData.isRecurring,
      recurringType: formData.isRecurring ? formData.recurringType : undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      createdAt: Date.now()
    };

    onUpdateTemplates([...templates, newTemplate]);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      estimatedDuration: 30,
      isRecurring: false,
      recurringType: 'daily',
      tags: ''
    });
    
    setIsOpen(false);
    toast.success('Template saved successfully!');
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    onUpdateTemplates(updatedTemplates);
    toast.success('Template deleted');
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };

  // Filter to show only custom templates in management
  const customTemplates = templates.filter(template => template.id.startsWith('custom-'));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookmarkSimple className="w-4 h-4" />
          Manage Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkSimple className="w-5 h-5" />
            Template Management
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Create Template Form */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Create New Template</h3>
                {selectedTask && (
                  <Badge variant="secondary" className="text-xs">
                    From current task
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-title">Template Title</Label>
                  <Input
                    id="template-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter template title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="template-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", category.color)} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger id="template-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="template-duration"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Template description..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                <Input
                  id="template-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="work, daily, important"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="template-recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked as boolean })}
                  />
                  <Label htmlFor="template-recurring">Recurring template</Label>
                </div>

                {formData.isRecurring && (
                  <Select value={formData.recurringType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFormData({ ...formData, recurringType: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button onClick={handleSaveTemplate} disabled={!formData.title.trim()} className="gap-2">
                <Plus className="w-4 h-4" />
                Save Template
              </Button>
            </CardContent>
          </Card>

          {/* Existing Custom Templates */}
          {customTemplates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Your Custom Templates</h3>
              <div className="grid gap-3">
                {customTemplates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{template.title}</h4>
                            <Badge
                              className={cn(getCategoryColor(template.category), "text-white text-xs")}
                            >
                              {getCategoryName(template.category)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.priority}
                            </Badge>
                          </div>
                          
                          {template.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {template.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {template.estimatedDuration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {template.estimatedDuration}m
                              </div>
                            )}
                            
                            {template.isRecurring && (
                              <div className="flex items-center gap-1">
                                <Repeat className="w-3 h-3" />
                                {template.recurringType}
                              </div>
                            )}
                            
                            {template.tags && template.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {template.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.tags.length > 2 && '...'}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-destructive hover:text-destructive ml-2"
                        >
                          ×
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};