// src/components/common/FilterChipList.tsx
import React from 'react';
import { FlatList } from 'react-native';
import FilterChip from './FilterChip';

interface FilterOption {
  key: string;
  icon: string;
}

interface FilterChipListProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterSelect: (key: string) => void;
}

const FilterChipList = ({ filters, activeFilter, onFilterSelect }: FilterChipListProps) => (
  <FlatList
    data={filters}
    renderItem={({ item }) => (
      <FilterChip
        label={item.key}
        icon={item.icon}
        isSelected={activeFilter === item.key}
        onSelect={() => onFilterSelect(item.key)}
      />
    )}
    keyExtractor={item => item.key}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
    className="border-b border-gray-100"
  />
);

export default React.memo(FilterChipList);