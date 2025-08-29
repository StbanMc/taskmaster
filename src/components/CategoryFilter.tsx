import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="h-8"
      >
        All Tasks
        {Object.values(taskCounts).reduce((sum, count) => sum + count, 0) > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
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
          className="h-8"
        >
          <div className={cn("w-2 h-2 rounded-full mr-2", category.color)} />
          {category.name}
          {taskCounts[category.id] > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
              {taskCounts[category.id]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}