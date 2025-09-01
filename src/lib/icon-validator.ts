import * as Icons from '@phosphor-icons/react';

// Validate that all our icons exist in Phosphor Icons
export function validateIcons(iconNames: string[]): { valid: string[], invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  iconNames.forEach(iconName => {
    if ((Icons as any)[iconName]) {
      valid.push(iconName);
    } else {
      invalid.push(iconName);
    }
  });
  
  return { valid, invalid };
}

// Get a safe icon component
export function getSafeIcon(iconName: string, defaultIcon = 'List') {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || (Icons as any)[defaultIcon] || Icons.List;
}

// Test function to check all our category icons
export function testCategoryIcons() {
  const testIcons = [
    'User',
    'Briefcase', 
    'ShoppingCart',
    'Heart',
    'List',
    'BookOpen',
    'Car',
    'House',
    'MusicNote',
    'Camera',
    'GameController',
    'Barbell',
    'Coffee',
    'Airplane',
    'Gift',
    'Star',
    'FolderOpen',
    'Calendar',
    'Clock',
    'MapPin',
    'Phone',
    'Envelope',
    'Gear',
    'Palette'
  ];
  
  return validateIcons(testIcons);
}