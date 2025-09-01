import { useState } from 'react';
import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FolderOpen, Plus, Trash, Pencil } from '@phosphor-icons/react';
import * as Icons from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  tasks: { category: string }[]; // To prevent deleting categories in use
}

export const CategoryManager = ({ categories, onUpdateCategories, tasks }: CategoryManagerProps) => {
  const { t } = useI18n();
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

  const renderIcon = (iconName: string, className = "w-4 h-4", forceColor?: string) => {
    const IconComponent = (Icons as any)[iconName];
    const iconClass = forceColor ? `${className} ${forceColor}` : `${className} text-current`;
    return IconComponent ? <IconComponent className={iconClass} /> : <Icons.List className={iconClass} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-foreground">
          <FolderOpen className="w-4 h-4 text-current" />
          {t('manageCategories')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="w-6 h-6 text-primary" />
            {t('manageCategories')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 px-1 pb-4">
          {/* Add/Edit Category Form */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Name Input */}
                <div className="space-y-3">
                  <Label htmlFor="category-name" className="text-sm font-medium">Category Name</Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    maxLength={20}
                    className="h-11"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category Color</Label>
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {CATEGORY_COLORS.map(color => (
                      <button
                        key={color}
                        className={cn(
                          "aspect-square w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 transition-all hover:scale-105",
                          color,
                          formData.color === color 
                            ? "border-foreground scale-110 ring-2 ring-primary/20 shadow-lg" 
                            : "border-muted hover:border-foreground/50"
                        )}
                        onClick={() => setFormData({ ...formData, color })}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category Icon</Label>
                  <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-muted/20">
                    {CATEGORY_ICONS.map(icon => (
                      <button
                        key={icon}
                        className={cn(
                          "aspect-square p-2 rounded-lg border-2 transition-all hover:bg-muted hover:scale-105 flex items-center justify-center bg-card",
                          formData.icon === icon 
                            ? "border-primary bg-primary/10 scale-105 shadow-md text-primary" 
                            : "border-muted/50 hover:border-primary/30 text-foreground/70 hover:text-foreground"
                        )}
                        onClick={() => setFormData({ ...formData, icon })}
                        title={icon}
                      >
                        {renderIcon(icon, "w-4 h-4", "text-current")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="flex items-center gap-3">
                  <Badge className={cn(formData.color, "text-white gap-2 px-3 py-1.5 text-sm font-medium")}>
                    {renderIcon(formData.icon, "w-4 h-4", "text-white")}
                    {formData.name || 'Category Name'}
                  </Badge>
                  <span className="text-muted-foreground text-sm">This is how your category will appear</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {editingCategory ? (
                  <>
                    <Button onClick={handleUpdateCategory} disabled={!formData.name.trim()} className="gap-2">
                      <Pencil className="w-4 h-4 text-current" />
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
                  <Button onClick={handleAddCategory} disabled={!formData.name.trim()} className="gap-2">
                    <Plus className="w-4 h-4 text-current" />
                    Add Category
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Existing Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Existing Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map(category => {
                const taskCount = tasks.filter(task => task.category === category.id).length;
                
                return (
                  <Card key={category.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={cn("p-2.5 rounded-lg shadow-sm flex-shrink-0", category.color)}>
                            {renderIcon(category.icon, "w-4 h-4 text-white")}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-semibold text-sm truncate">{category.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                              {!category.isCustom && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            title={t('editCategory')}
                          >
                            <Pencil size={14} className="text-current" />
                          </Button>
                          {category.isCustom && taskCount === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                              title={t('deleteCategory')}
                            >
                              <Trash size={14} className="text-current" />
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