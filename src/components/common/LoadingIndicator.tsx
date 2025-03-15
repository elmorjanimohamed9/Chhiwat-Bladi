import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingIndicator = ({ message, size = 'large' }: LoadingIndicatorProps) => {
  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size={size} color="#F59E0B" className="mb-2" />
      {message && <Text className="text-gray-500 text-center">{message}</Text>}
    </View>
  );
};

export default LoadingIndicator;
