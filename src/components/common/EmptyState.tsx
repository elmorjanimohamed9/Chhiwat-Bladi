import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon, title, message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6">
        <Icon name={icon} size={32} color="#9CA3AF" />
      </View>

      <Text className="text-xl font-bold text-gray-700 mb-2 text-center">{title}</Text>
      <Text className="text-gray-500 text-center mb-8">{message}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} className="bg-amber-500 px-6 py-3 rounded-full">
          <Text className="text-white font-medium">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
