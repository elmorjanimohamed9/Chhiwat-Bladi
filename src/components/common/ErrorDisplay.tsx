import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <View className="items-center justify-center py-8 px-4">
      <View className="bg-red-50 w-16 h-16 rounded-full items-center justify-center mb-4">
        <Icon name="alert-triangle" size={30} color="#F87171" />
      </View>

      <Text className="text-gray-700 text-center font-medium mb-2">Something went wrong</Text>

      <Text className="text-gray-500 text-center mb-6">
        {message || 'Failed to load data. Please try again.'}
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-amber-500 px-6 py-3 rounded-full"
          activeOpacity={0.8}>
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorDisplay;
