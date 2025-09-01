import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import * as Icons from '@phosphor-icons/react';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  taskCounts: Record<string, number>;
}

export function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  taskCounts 
}: CategoryFilterProps) {
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-3 h-3" /> : <Icons.List className="w-3 h-3" />;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="h-8 gap-2"
      >
        <Icons.List className="w-3 h-3" />
        All Tasks
        {Object.values(taskCounts).reduce((sum, count) => sum + count, 0) > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
            {Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
          </Badge>
        )}
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="h-8 gap-2"
        >
          <div className={cn("w-3 h-3 rounded-md flex items-center justify-center", category.color)}>
            {renderIcon(category.icon)}
          </div>
          {category.name}
          {taskCounts[category.id] > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
              {taskCounts[category.id]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}