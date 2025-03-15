import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ErrorViewProps {
  message: string;
  subMessage?: string;
  buttonText: string;
  onRetry: () => void;
}

const ErrorView = ({ message, subMessage, buttonText, onRetry }: ErrorViewProps) => (
  <View className="flex-1 justify-center items-center px-6">
    <Icon name="alert-circle" size={40} color="#EF4444" />
    <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">{message}</Text>
    {subMessage && <Text className="text-gray-500 text-center mb-6">{subMessage}</Text>}
    <TouchableOpacity className="bg-amber-500 py-3 px-6 rounded-full" onPress={onRetry}>
      <Text className="text-white font-semibold">{buttonText}</Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(ErrorView);
