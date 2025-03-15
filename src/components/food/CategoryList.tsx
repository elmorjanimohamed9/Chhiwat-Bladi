import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import CategoryItem from './CategoryItem';
import { Category } from '../../types';

interface CategoryListProps {
  title: string;
  categories: (Category | { strCategory: string })[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewAll?: () => void;
}

const CategoryList = ({
  title,
  categories,
  selectedCategory,
  onSelectCategory,
  onViewAll,
}: CategoryListProps) => {
  return (
    <View className="mb-4">
      <View className="px-4 flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-800">{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-amber-500 font-medium">View all</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            category={item.strCategory}
            isSelected={selectedCategory === item.strCategory}
            onSelect={onSelectCategory}
          />
        )}
        keyExtractor={item => ('idCategory' in item ? item.idCategory : item.strCategory)}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4 py-2"
      />
    </View>
  );
};

export default CategoryList;
