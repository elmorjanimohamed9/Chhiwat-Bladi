// src/components/food/CategoryItem.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface CategoryItemProps {
  category: string;
  isSelected: boolean;
  onSelect: (category: string) => void;
}

const CategoryItem = ({ category, isSelected, onSelect }: CategoryItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(category)}
      className={`px-4 py-2 mr-3 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-gray-100'}`}>
      <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
        {category}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
