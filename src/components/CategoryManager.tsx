import { useState } from 'react';
import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Plus, Trash2, Edit } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  tasks: { category: string }[]; // To prevent deleting categories in use
}

export const CategoryManager = ({ categories, onUpdateCategories, tasks }: CategoryManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0]
  });

  const handleAddCategory = () => {
    if (!formData.name.trim()) return;

    const newCategory: Category = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon,
      isCustom: true
    };

    onUpdateCategories([...categories, newCategory]);
    setFormData({ name: '', color: CATEGORY_COLORS[0], icon: CATEGORY_ICONS[0] });
    toast.success('Category added successfully!');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !formData.name.trim()) return;

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: formData.name.trim(), color: formData.color, icon: formData.icon }
        : cat
    );

    onUpdateCategories(updatedCategories);
    setEditingCategory(null);
    setFormData({ name: '', color: CATEGORY_COLORS[0], icon: CATEGORY_ICONS[0] });
    toast.success('Category updated successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    // Check if category is in use
    const isInUse = tasks.some(task => task.category === categoryId);
    if (isInUse) {
      toast.error('Cannot delete category that contains tasks');
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);
    toast.success('Category deleted successfully!');
  };

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : <Icons.List className={className} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Category Management
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Add/Edit Category Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    maxLength={20}
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label>Category Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {CATEGORY_COLORS.map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded-md border-2 transition-all",
                          color,
                          formData.color === color ? "border-foreground scale-110" : "border-muted"
                        )}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="space-y-2">
                  <Label>Category Icon</Label>
                  <div className="grid grid-cols-8 gap-2 max-h-24 overflow-y-auto">
                    {CATEGORY_ICONS.map(icon => (
                      <button
                        key={icon}
                        className={cn(
                          "p-2 rounded-md border transition-all hover:bg-muted",
                          formData.icon === icon ? "border-primary bg-primary/10" : "border-muted"
                        )}
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {renderIcon(icon)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <Badge className={cn(formData.color, "text-white gap-2")}>
                  {renderIcon(formData.icon)}
                  {formData.name || 'Category Name'}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editingCategory ? (
                  <>
                    <Button onClick={handleUpdateCategory} disabled={!formData.name.trim()}>
                      Update Category
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', color: CATEGORY_COLORS[0], icon: CATEGORY_ICONS[0] });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddCategory} disabled={!formData.name.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Existing Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map(category => {
                const taskCount = tasks.filter(task => task.category === category.id).length;
                
                return (
                  <Card key={category.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-md", category.color)}>
                            {renderIcon(category.icon, "w-4 h-4 text-white")}
                          </div>
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {taskCount} task{taskCount !== 1 ? 's' : ''}
                              {!category.isCustom && ' (Default)'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {category.isCustom && taskCount === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};