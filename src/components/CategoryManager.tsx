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

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : <Icons.List className={className} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="w-4 h-4" />
          {t('manageCategories')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="w-6 h-6" />
            {t('manageCategories')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-8 px-1">
          {/* Add/Edit Category Form */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
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
                    className="h-10"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category Color</Label>
                  <div className="grid grid-cols-6 gap-3">
                    {CATEGORY_COLORS.map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 transition-all hover:scale-105",
                          color,
                          formData.color === color ? "border-foreground scale-110 ring-2 ring-primary/20" : "border-muted"
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
                  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2 bg-muted/30">
                    {CATEGORY_ICONS.map(icon => (
                      <button
                        key={icon}
                        className={cn(
                          "p-2.5 rounded-lg border transition-all hover:bg-muted hover:scale-105",
                          formData.icon === icon ? "border-primary bg-primary/10 scale-105" : "border-muted/50"
                        )}
                        onClick={() => setFormData({ ...formData, icon })}
                        title={icon}
                      >
                        {renderIcon(icon, "w-4 h-4")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="flex items-center gap-3">
                  <Badge className={cn(formData.color, "text-white gap-2 px-3 py-1.5 text-sm")}>
                    {renderIcon(formData.icon, "w-4 h-4")}
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
                      <Pencil className="w-4 h-4" />
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
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Existing Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Existing Categories
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {categories.map(category => {
                const taskCount = tasks.filter(task => task.category === category.id).length;
                
                return (
                  <Card key={category.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-lg shadow-sm", category.color)}>
                            {renderIcon(category.icon, "w-5 h-5 text-white")}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-base">{category.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
                              {!category.isCustom && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-9 w-9 p-0 hover:bg-primary/10"
                            title={t('editCategory')}
                          >
                            <Pencil size={16} />
                          </Button>
                          {category.isCustom && taskCount === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                              title={t('deleteCategory')}
                            >
                              <Trash size={16} />
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