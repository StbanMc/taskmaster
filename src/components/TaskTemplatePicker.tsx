import { useState } from 'react';
import { TaskTemplate, Category, DEFAULT_TEMPLATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Repeat, Tag, Plus, Star } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface TaskTemplatePickerProps {
  templates: TaskTemplate[];
  categories: Category[];
  onSelectTemplate: (template: TaskTemplate) => void;
  onClose: () => void;
}

export const TaskTemplatePicker = ({
  templates,
  categories,
  onSelectTemplate,
  onClose
}: TaskTemplatePickerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = selectedCategory
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };

  const categoryGroups = categories.filter(category => 
    templates.some(template => template.category === category.id)
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Choose a Template
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Select from pre-made templates or your saved templates
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Templates ({templates.length})
          </Button>
          {categoryGroups.map(category => {
            const count = templates.filter(t => t.category === category.id).length;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-1"
              >
                <div className={cn("w-2 h-2 rounded-full", category.color)} />
                {category.name} ({count})
              </Button>
            );
          })}
        </div>

        <Separator />

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No templates found in this category</p>
          </div>
        ) : (
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {filteredTemplates.map(template => (
              <Card
                key={template.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{template.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          getCategoryColor(template.category),
                          "text-white"
                        )}
                      >
                        {getCategoryName(template.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  {template.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {template.priority}
                    </Badge>
                    
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
                        <Tag className="w-3 h-3" />
                        {template.tags.slice(0, 2).join(', ')}
                        {template.tags.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator />

        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};