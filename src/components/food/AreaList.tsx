import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

interface Area {
  strArea: string;
}

interface AreaListProps {
  title: string;
  areas: Area[];
  selectedArea: string;
  onSelectArea: (area: string) => void;
  onViewAll?: () => void;
}

const AreaList = ({ title, areas, selectedArea, onSelectArea, onViewAll }: AreaListProps) => {
  const renderAreaItem = ({ item }: { item: Area }) => (
    <TouchableOpacity
      onPress={() => onSelectArea(item.strArea)}
      className={`px-4 py-2 mr-3 rounded-full ${
        selectedArea === item.strArea ? 'bg-amber-500' : 'bg-gray-100'
      }`}>
      <Text
        className={`font-medium ${selectedArea === item.strArea ? 'text-white' : 'text-gray-700'}`}>
        {item.strArea}
      </Text>
    </TouchableOpacity>
  );

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
        data={areas}
        renderItem={renderAreaItem}
        keyExtractor={(item, index) => `area-${item.strArea}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4 py-2"
      />
    </View>
  );
};

export default AreaList;
