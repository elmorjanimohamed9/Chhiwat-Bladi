import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, onClear, placeholder }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white px-4 py-2 rounded-full shadow-sm mb-4">
      <Icon name="search" size={20} color={value ? '#F59E0B' : '#9CA3AF'} />
      <TextInput
        placeholder={placeholder || 'Search'}
        className="flex-1 ml-3 text-gray-800"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <View className="bg-gray-100 rounded-full p-1">
            <Icon name="x" size={16} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
