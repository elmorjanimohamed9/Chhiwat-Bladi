import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FilterChip from '../common/FilterChip';
import Icon from 'react-native-vector-icons/Feather';

type SortOption = 'Popular' | 'Recent' | 'A-Z';

interface FilterSectionProps {
  filterStats: {
    hasFilters: boolean;
    filteredCount: number;
  };
  activeSort: SortOption;
  activeCategory: string;
  activeCuisine: string;
  sortOptions: SortOption[];
  categoryOptions: string[];
  cuisineOptions: string[];
  onResetFilters: () => void;
  onSortChange: (sort: SortOption) => void;
  onCategoryChange: (category: string) => void;
  onCuisineChange: (cuisine: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filterStats,
  activeSort,
  activeCategory,
  activeCuisine,
  sortOptions,
  categoryOptions,
  cuisineOptions,
  onResetFilters,
  onSortChange,
  onCategoryChange,
  onCuisineChange,
}) => {
  const renderSortIcon = (sortType: string) => {
    if (sortType === 'Popular') return 'trending-up';
    if (sortType === 'Recent') return 'clock';
    return 'align-left';
  };

  return (
    <View className="mb-3">
      {/* Filter Pills Section */}
      <View className="mb-4 mt-2">
        <View className="px-4 mb-2 flex-row items-center justify-between">
          <Text className="text-gray-700 font-medium">Filters</Text>
          {filterStats.hasFilters && (
            <TouchableOpacity onPress={onResetFilters} className="flex-row items-center">
              <Text className="text-amber-500 text-xs mr-1">Reset All</Text>
              <Icon name="x" size={12} color="#F59E0B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Options */}
        <View className="px-4 mb-3">
          <Text className="text-gray-500 text-xs mb-1">Sort By</Text>
          <FlatList
            data={sortOptions}
            renderItem={({ item }) => (
              <FilterChip
                label={item}
                isSelected={activeSort === item}
                onSelect={() => onSortChange(item)}
                icon={renderSortIcon(item)}
              />
            )}
            keyExtractor={item => `sort-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Categories */}
        <View className="px-4 mb-3">
          <Text className="text-gray-500 text-xs mb-1">Categories</Text>
          <FlatList
            data={categoryOptions}
            renderItem={({ item }) => (
              <FilterChip
                label={item}
                isSelected={activeCategory === item}
                onSelect={() => onCategoryChange(item)}
              />
            )}
            keyExtractor={item => `category-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Cuisines */}
        <View className="px-4">
          <Text className="text-gray-500 text-xs mb-1">Cuisines</Text>
          <FlatList
            data={cuisineOptions}
            renderItem={({ item }) => (
              <FilterChip
                label={item}
                isSelected={activeCuisine === item}
                onSelect={() => onCuisineChange(item)}
              />
            )}
            keyExtractor={item => `cuisine-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* Results count */}
      <View className="px-4 mb-2 flex-row justify-between items-center">
        <Text className="text-gray-800 font-bold text-lg">
          {filterStats.filteredCount > 0
            ? `${filterStats.filteredCount} Recipe${filterStats.filteredCount !== 1 ? 's' : ''}`
            : 'No Recipes Found'}
        </Text>
        {activeSort && (
          <View className="flex-row items-center">
            <Icon name={renderSortIcon(activeSort)} size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">{activeSort}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FilterSection;
