import React, { useMemo, useEffect } from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  icon?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onSelect, icon }) => {
  const animatedScale = useMemo(() => new Animated.Value(isSelected ? 1.05 : 1), [isSelected]);

  useEffect(() => {
    Animated.spring(animatedScale, {
      toValue: isSelected ? 1.05 : 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isSelected, animatedScale]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: animatedScale }],
        },
      ]}>
      <TouchableOpacity
        onPress={onSelect}
        className={`px-4 py-2 mr-3 rounded-full flex-row items-center justify-center ${
          isSelected ? 'bg-amber-500 shadow-sm' : 'bg-gray-100'
        }`}
        activeOpacity={0.7}>
        {icon && (
          <Icon
            name={icon}
            size={14}
            color={isSelected ? '#FFF' : '#4B5563'}
            style={{ marginRight: 4 }}
          />
        )}
        <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FilterChip;
