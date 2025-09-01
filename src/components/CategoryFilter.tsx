import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { getSafeIcon } from '@/lib/icon-validator';
import { cn } from '@/lib/utils';
import { List } from '@phosphor-icons/react';

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
    const IconComponent = getSafeIcon(iconName);
    return <IconComponent className="w-3 h-3 text-white drop-shadow-sm" weight="regular" />;
  };

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="h-7 md:h-8 gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-3"
      >
        <List className="w-3 h-3" />
        <span className="hidden sm:inline">All Tasks</span>
        <span className="sm:hidden">All</span>
        {Object.values(taskCounts).reduce((sum, count) => sum + count, 0) > 0 && (
          <Badge variant="secondary" className="ml-0.5 md:ml-1 h-4 md:h-5 px-1.5 md:px-2 text-[10px] md:text-xs">
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
          className="h-7 md:h-8 gap-1.5 md:gap-2 text-xs md:text-sm px-2 md:px-3"
        >
          <div className={cn("w-3.5 h-3.5 md:w-4 md:h-4 rounded-md flex items-center justify-center shadow-sm", category.color)}>
            {renderIcon(category.icon)}
          </div>
          <span className="truncate max-w-[60px] md:max-w-none">{category.name}</span>
          {taskCounts[category.id] > 0 && (
            <Badge variant="secondary" className="ml-0.5 md:ml-1 h-4 md:h-5 px-1.5 md:px-2 text-[10px] md:text-xs">
              {taskCounts[category.id]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}