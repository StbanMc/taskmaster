import { useState } from 'react';
import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/types';
import { getSafeIcon } from '@/lib/icon-validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FolderOpen, Plus, Trash, Pencil } from '@phosphor-icons/react';
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
    const IconComponent = getSafeIcon(iconName);
    const iconClass = forceColor ? `${className} ${forceColor}` : `${className} text-current`;
    
    return <IconComponent className={iconClass} weight="regular" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="icon-container">
            <FolderOpen className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">{t('manageCategories')}</span>
          <span className="sm:hidden">{t('categories')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0 px-1">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="icon-container">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            {t('manageCategories')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-1 pb-4">
          {/* Add/Edit Category Form */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <div className="icon-container">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                {editingCategory ? t('editCategory') : t('addNewCategory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5">
              {/* Name and Color Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                  <div className="grid grid-cols-8 sm:grid-cols-6 gap-2">
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
              </div>

              {/* Icon Picker - Full Width Below */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('categoryIcon')}</Label>
                <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 xl:grid-cols-16 gap-2 max-h-48 overflow-y-auto">
                    {CATEGORY_ICONS.map(icon => {
                      const isSelected = formData.icon === icon;
                      return (
                        <div key={icon} className="relative group">
                          <button
                            className={cn(
                              "relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
                              "hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50",
                              isSelected 
                                ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/30" 
                                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                            )}
                            onClick={() => setFormData({ ...formData, icon })}
                            title={icon}
                            type="button"
                          >
                            <div className="icon-container">
                              {renderIcon(icon, "w-5 h-5 sm:w-5 sm:h-5")}
                            </div>
                          </button>
                          
                          {/* Simplified tooltip */}
                          <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover border border-border text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 whitespace-nowrap pointer-events-none">
                            {icon}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {t('selectIconForCategory')}
                </p>
              </div>

              {/* Preview Section */}
              <div className="space-y-3 pt-4 border-t bg-muted/20 rounded-lg p-4">
                <Label className="text-sm font-medium">{t('preview')}</Label>
                <div className="flex items-center gap-4">
                  <Badge className={cn(
                    formData.color, 
                    "text-white gap-2 px-4 py-2 text-sm font-medium shadow-lg border-0 transition-all hover:scale-105"
                  )}>
                    {renderIcon(formData.icon, "w-4 h-4", "text-white drop-shadow-sm")}
                    {formData.name || t('categoryName')}
                  </Badge>
                  <span className="text-muted-foreground text-xs sm:text-sm italic">
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
                      <div className="icon-container">
                        <Pencil className="w-4 h-4" />
                      </div>
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
                    <div className="icon-container">
                      <Plus className="w-4 h-4" />
                    </div>
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
              <div className="icon-container">
                <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              {t('existingCategories')} ({categories.length})
            </h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="icon-container mb-3">
                  <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
                </div>
                <p>{t('noCategories')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map(category => {
                  const taskCount = tasks.filter(task => task.category === category.id).length;
                  
                  return (
                    <Card 
                      key={category.id} 
                      className="hover:shadow-md transition-all duration-200 group border-l-4 hover:border-l-primary/60"
                      style={{ borderLeftColor: `var(--tw-${category.color.replace('bg-', '').replace('-500', '')})` }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between gap-3">
                          {/* Category Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={cn(
                              "w-8 h-8 rounded-lg shadow-sm flex-shrink-0 flex items-center justify-center", 
                              category.color
                            )}>
                              <div className="icon-container">
                                {renderIcon(category.icon, "w-4 h-4", "text-white drop-shadow-sm")}
                              </div>
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate text-foreground">
                                {category.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                  {taskCount} {taskCount === 1 ? t('task') : t('tasks')}
                                </span>
                                {!category.isCustom && (
                                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 h-4">
                                    {t('default')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              className="h-8 w-8 p-0 opacity-60 hover:opacity-100 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                              title={t('editCategory')}
                            >
                              <div className="icon-container">
                                <Pencil size={14} />
                              </div>
                            </Button>
                            {category.isCustom && taskCount === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                title={t('deleteCategory')}
                              >
                                <div className="icon-container">
                                  <Trash size={14} />
                                </div>
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