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
    const iconClass = forceColor ? `${className} ${forceColor}` : `${className}`;
    return IconComponent ? <IconComponent className={iconClass} /> : <Icons.List className={iconClass} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="w-4 h-4" />
          <span className="hidden sm:inline">{t('manageCategories')}</span>
          <span className="sm:hidden">{t('categories')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0 px-1">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            {t('manageCategories')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-1 pb-4">
          {/* Add/Edit Category Form */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                {editingCategory ? t('editCategory') : t('addNewCategory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="category-name" className="text-sm font-medium">
                    {t('categoryName')}
                  </Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('enterCategoryName')}
                    maxLength={20}
                    className="h-10 sm:h-11"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('categoryColor')}</Label>
                  <div className="grid grid-cols-6 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {CATEGORY_COLORS.map(color => (
                      <button
                        key={color}
                        className={cn(
                          "aspect-square w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all hover:scale-105",
                          color,
                          formData.color === color 
                            ? "border-foreground scale-110 ring-2 ring-primary/30 shadow-lg" 
                            : "border-border hover:border-foreground/50"
                        )}
                        onClick={() => setFormData({ ...formData, color })}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="space-y-2 lg:col-span-1 xl:col-span-1">
                  <Label className="text-sm font-medium">{t('categoryIcon')}</Label>
                  <div className="grid grid-cols-8 gap-1.5 max-h-32 sm:max-h-40 overflow-y-auto border rounded-lg p-2 sm:p-3 bg-muted/30">
                    {CATEGORY_ICONS.map(icon => (
                      <button
                        key={icon}
                        className={cn(
                          "aspect-square p-1.5 sm:p-2 rounded-md border transition-all hover:scale-110 flex items-center justify-center",
                          formData.icon === icon 
                            ? "border-primary bg-primary/15 scale-105 shadow-sm text-primary" 
                            : "border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => setFormData({ ...formData, icon })}
                        title={icon}
                      >
                        {renderIcon(icon, "w-3 h-3 sm:w-4 sm:h-4")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-2 pt-3 border-t">
                <Label className="text-sm font-medium">{t('preview')}</Label>
                <div className="flex items-center gap-3">
                  <Badge className={cn(formData.color, "text-white gap-2 px-3 py-1.5 text-sm font-medium shadow-sm")}>
                    {renderIcon(formData.icon, "w-4 h-4", "text-white")}
                    {formData.name || t('categoryName')}
                  </Badge>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    {t('categoryPreview')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                {editingCategory ? (
                  <>
                    <Button 
                      onClick={handleUpdateCategory} 
                      disabled={!formData.name.trim()} 
                      className="gap-2 flex-1 sm:flex-initial"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('updateCategory')}</span>
                      <span className="sm:hidden">{t('update')}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', color: CATEGORY_COLORS[0], icon: CATEGORY_ICONS[0] });
                      }}
                      className="flex-1 sm:flex-initial"
                    >
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleAddCategory} 
                    disabled={!formData.name.trim()} 
                    className="gap-2 flex-1 sm:flex-initial"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('addCategory')}</span>
                    <span className="sm:hidden">{t('add')}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-4 sm:my-6" />

          {/* Existing Categories */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('existingCategories')} ({categories.length})
            </h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>{t('noCategories')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {categories.map(category => {
                  const taskCount = tasks.filter(task => task.category === category.id).length;
                  
                  return (
                    <Card 
                      key={category.id} 
                      className="hover:shadow-md transition-all duration-200 group"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className={cn(
                              "p-1.5 sm:p-2.5 rounded-lg shadow-sm flex-shrink-0", 
                              category.color
                            )}>
                              {renderIcon(category.icon, "w-3 h-3 sm:w-4 sm:h-4", "text-white")}
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <h4 className="font-semibold text-xs sm:text-sm truncate">
                                {category.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                                <span>
                                  {taskCount} {taskCount === 1 ? t('task') : t('tasks')}
                                </span>
                                {!category.isCustom && (
                                  <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1 py-0">
                                    {t('default')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              className="h-7 w-7 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                              title={t('editCategory')}
                            >
                              <Pencil size={12} />
                            </Button>
                            {category.isCustom && taskCount === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                                title={t('deleteCategory')}
                              >
                                <Trash size={12} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};